import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'
import Booking from '../models/Booking'
import Payment from '../models/Payment'
import Departure from '../models/Departure'
import Ticket from '../models/Ticket'
import { AppError } from '../middleware/errorHandler'
import { logger } from '../config/logger'
import { v4 as uuidv4 } from 'uuid'
import { sendBookingConfirmationEmail } from '../services/email'

function sha512(str: string): string {
  return crypto.createHash('sha512').update(str).digest('hex')
}

// PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1..udf5|5 empty|salt
function payuRequestHash(key: string, txnid: string, amount: string, productinfo: string, firstname: string, email: string, salt: string): string {
  return sha512(`${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`)
}

// Response hash (reverse of request): salt|status|10 empty|email|firstname|productinfo|amount|txnid|key
// In the request the order is firstname then email; the response reverses that to email then firstname.
function payuResponseHash(salt: string, status: string, txnid: string, amount: string, productinfo: string, firstname: string, email: string, key: string): string {
  return sha512(`${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`)
}

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId } = z.object({ bookingId: z.string() }).parse(req.body)
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user!.id,
      bookingStatus: 'PENDING',
      holdExpiresAt: { $gt: new Date() },
    })
    if (!booking) throw new AppError('Booking hold expired or not found.', 404)

    const { PAYU_KEY, PAYU_SALT } = process.env
    if (!PAYU_KEY || !PAYU_SALT) {
      res.status(503).json({ message: 'Payment integration is not configured. Please contact support.' })
      return
    }

    const txnid = `PK${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const amount = booking.fareBreakdown.total.toFixed(2)
    const productinfo = `Papikondalu Trip - ${booking.bookingRef}`
    const firstname = booking.leadPassengerName.split(' ')[0]
    const email = booking.leadPassengerEmail

    const hash = payuRequestHash(PAYU_KEY, txnid, amount, productinfo, firstname, email, PAYU_SALT)

    await Payment.create({
      booking: booking._id,
      gatewayOrderId: txnid,
      amount: booking.fareBreakdown.total,
      currency: 'INR',
      idempotencyKey: uuidv4(),
      metadata: { firstname, email, amount, productinfo },
    })

    res.json({
      txnid,
      amount,
      productinfo,
      key: PAYU_KEY,
      hash,
      firstname,
      email,
      phone: booking.leadPassengerPhone,
    })
  } catch (err) { next(err) }
}

export async function verifyPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { txnid, mihpayid, txnStatus, hash: responseHash, bookingId } = z.object({
      txnid: z.string(),
      mihpayid: z.string(),
      txnStatus: z.string(),
      hash: z.string(),
      bookingId: z.string(),
    }).parse(req.body)

    const { PAYU_KEY, PAYU_SALT } = process.env
    if (!PAYU_KEY || !PAYU_SALT) throw new AppError('Payment integration not configured', 503)

    const payment = await Payment.findOne({ gatewayOrderId: txnid })
    if (!payment) throw new AppError('Payment record not found', 404)

    const { firstname, email, amount, productinfo } = payment.metadata as Record<string, string>
    const status = txnStatus.toLowerCase()
    const expectedHash = payuResponseHash(PAYU_SALT, status, txnid, amount, productinfo, firstname, email, PAYU_KEY)

    if (expectedHash !== responseHash) throw new AppError('Payment signature verification failed', 400)
    if (status !== 'success') throw new AppError(`Payment ${status}`, 400)

    const booking = await Booking.findOne({ _id: bookingId, customer: req.user!.id })
    if (!booking) throw new AppError('Booking not found', 404)

    payment.gatewayPaymentId = mihpayid
    payment.gatewaySignature = responseHash
    payment.status = 'CAPTURED'
    await payment.save()

    booking.bookingStatus = 'CONFIRMED'
    booking.paymentStatus = 'CAPTURED'
    booking.holdExpiresAt = null
    await booking.save()

    await Departure.findByIdAndUpdate(booking.departure, {
      $inc: { confirmedSeats: booking.adultCount + booking.childCount, heldSeats: -(booking.adultCount + booking.childCount) }
    })

    const ticketPayload = JSON.stringify({ bookingRef: booking.bookingRef, bookingId: booking._id.toString() })
    await Ticket.create({ booking: booking._id, qrPayload: ticketPayload, contactName: booking.leadPassengerName })

    sendBookingConfirmationEmail({
      to: booking.leadPassengerEmail,
      name: booking.leadPassengerName,
      bookingRef: booking.bookingRef,
      packageTitle: booking.packageSnapshot.title,
      departureDate: booking.packageSnapshot.departureDate,
      boardingLocation: booking.packageSnapshot.boardingLocation,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      total: booking.fareBreakdown.total,
    }).catch(() => {})

    logger.info('PayU payment verified and booking confirmed', { bookingRef: booking.bookingRef })
    res.json({ message: 'Payment verified. Booking confirmed!', bookingRef: booking.bookingRef })
  } catch (err) { next(err) }
}

export async function webhook(req: Request, res: Response): Promise<void> {
  try {
    const { PAYU_KEY, PAYU_SALT } = process.env
    if (!PAYU_SALT || !PAYU_KEY) { res.status(200).json({ received: true }); return }

    const body = req.body as Record<string, string>
    const { txnid, mihpayid, amount, productinfo, firstname, email, txnStatus, hash: responseHash } = body

    if (!txnid || !responseHash) { res.status(200).json({ received: true }); return }

    const status = (txnStatus || '').toLowerCase()
    const expectedHash = payuResponseHash(PAYU_SALT, status, txnid, amount, productinfo, firstname, email, PAYU_KEY)
    if (expectedHash !== responseHash) {
      logger.warn('PayU webhook invalid signature', { txnid })
      res.status(400).json({ message: 'Invalid signature' })
      return
    }

    logger.info('PayU webhook received', { txnid, status })

    // Idempotency: skip if already processed
    const payment = await Payment.findOne({ gatewayOrderId: txnid })
    if (!payment) { res.status(200).json({ received: true }); return }

    if (payment.status === 'CAPTURED') {
      res.status(200).json({ received: true }); return
    }

    if (status === 'success') {
      payment.gatewayPaymentId = mihpayid || payment.gatewayPaymentId
      payment.status = 'CAPTURED'
      await payment.save()

      const booking = await Booking.findById(payment.booking)
      if (booking && booking.bookingStatus !== 'CONFIRMED') {
        booking.bookingStatus = 'CONFIRMED'
        booking.paymentStatus = 'CAPTURED'
        booking.holdExpiresAt = null
        await booking.save()

        await Departure.findByIdAndUpdate(booking.departure, {
          $inc: { confirmedSeats: booking.adultCount + booking.childCount, heldSeats: -(booking.adultCount + booking.childCount) }
        })

        const existingTicket = await Ticket.findOne({ booking: booking._id })
        if (!existingTicket) {
          const ticketPayload = JSON.stringify({ bookingRef: booking.bookingRef, bookingId: booking._id.toString() })
          await Ticket.create({ booking: booking._id, qrPayload: ticketPayload, contactName: booking.leadPassengerName })
          sendBookingConfirmationEmail({
            to: booking.leadPassengerEmail,
            name: booking.leadPassengerName,
            bookingRef: booking.bookingRef,
            packageTitle: booking.packageSnapshot.title,
            departureDate: booking.packageSnapshot.departureDate,
            boardingLocation: booking.packageSnapshot.boardingLocation,
            adultCount: booking.adultCount,
            childCount: booking.childCount,
            total: booking.fareBreakdown.total,
          }).catch(() => {})
        }
        logger.info('Webhook: booking confirmed via IPN', { bookingRef: booking.bookingRef })
      }
    } else if (['failure', 'failed'].includes(status)) {
      payment.status = 'FAILED'
      await payment.save()
      await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'FAILED' })
    }

    res.status(200).json({ received: true })
  } catch (err) {
    logger.error('Webhook processing error', { err })
    res.status(200).json({ received: true })
  }
}

export async function payuReturn(req: Request, res: Response): Promise<void> {
  const { CLIENT_URL, PAYU_KEY, PAYU_SALT } = process.env
  const clientUrl = (CLIENT_URL || 'http://localhost:3000').split(',')[0].trim()

  try {
    const body = req.body as Record<string, string>
    const { txnid, mihpayid, amount, productinfo, firstname, email, txnStatus, hash: responseHash } = body

    if (!PAYU_KEY || !PAYU_SALT || !txnid || !responseHash) {
      res.redirect(`${clientUrl}/book/confirmed?status=failed&reason=invalid`); return
    }

    const status = (txnStatus || '').toLowerCase()
    const expectedHash = payuResponseHash(PAYU_SALT, status, txnid, amount, productinfo, firstname, email, PAYU_KEY)
    if (expectedHash !== responseHash) {
      logger.warn('PayU return: invalid signature', { txnid })
      res.redirect(`${clientUrl}/book/confirmed?status=failed&reason=tampered`); return
    }

    if (status !== 'success') {
      res.redirect(`${clientUrl}/book/confirmed?status=failed&reason=${encodeURIComponent(txnStatus || 'failed')}`); return
    }

    const payment = await Payment.findOne({ gatewayOrderId: txnid })
    if (!payment) {
      res.redirect(`${clientUrl}/book/confirmed?status=failed&reason=not_found`); return
    }

    if (payment.status !== 'CAPTURED') {
      payment.gatewayPaymentId = mihpayid || payment.gatewayPaymentId
      payment.gatewaySignature = responseHash
      payment.status = 'CAPTURED'
      await payment.save()

      const booking = await Booking.findById(payment.booking)
      if (booking && booking.bookingStatus !== 'CONFIRMED') {
        booking.bookingStatus = 'CONFIRMED'
        booking.paymentStatus = 'CAPTURED'
        booking.holdExpiresAt = null
        await booking.save()

        await Departure.findByIdAndUpdate(booking.departure, {
          $inc: { confirmedSeats: booking.adultCount + booking.childCount, heldSeats: -(booking.adultCount + booking.childCount) }
        })

        const existingTicket = await Ticket.findOne({ booking: booking._id })
        if (!existingTicket) {
          const ticketPayload = JSON.stringify({ bookingRef: booking.bookingRef, bookingId: booking._id.toString() })
          await Ticket.create({ booking: booking._id, qrPayload: ticketPayload, contactName: booking.leadPassengerName })
        }

        sendBookingConfirmationEmail({
          to: booking.leadPassengerEmail,
          name: booking.leadPassengerName,
          bookingRef: booking.bookingRef,
          packageTitle: booking.packageSnapshot.title,
          departureDate: booking.packageSnapshot.departureDate,
          boardingLocation: booking.packageSnapshot.boardingLocation,
          adultCount: booking.adultCount,
          childCount: booking.childCount,
          total: booking.fareBreakdown.total,
        }).catch(() => {})

        logger.info('PayU return: booking confirmed', { bookingRef: booking.bookingRef })
        res.redirect(`${clientUrl}/book/confirmed?status=success&ref=${encodeURIComponent(booking.bookingRef)}`); return
      }
    }

    // Already captured — find ref and redirect
    const booking = await Booking.findById(payment.booking).select('bookingRef').lean()
    res.redirect(`${clientUrl}/book/confirmed?status=success&ref=${encodeURIComponent((booking as any)?.bookingRef || '')}`)
  } catch (err) {
    logger.error('PayU return error', { err })
    res.redirect(`${(CLIENT_URL || 'http://localhost:3000').split(',')[0].trim()}/book/confirmed?status=failed&reason=error`)
  }
}

export async function paymentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const payment = await Payment.findById(req.params.id).populate<{ booking: { customer: { toString(): string } } }>('booking')
    if (!payment) throw new AppError('Payment not found', 404)
    // IDOR guard: payment must belong to the requesting user's booking
    if (!payment.booking || payment.booking.customer.toString() !== req.user!.id) {
      throw new AppError('Payment not found', 404)
    }
    res.json({ status: payment.status, amount: payment.amount, currency: payment.currency })
  } catch (err) { next(err) }
}
