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

function getRazorpay() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require('razorpay')
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
}

export async function createOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId } = z.object({ bookingId: z.string() }).parse(req.body)
    const booking = await Booking.findOne({ _id: bookingId, customer: req.user!.id, bookingStatus: 'PENDING', holdExpiresAt: { $gt: new Date() } })
    if (!booking) throw new AppError('Booking hold expired or not found.', 404)

    const razorpay = getRazorpay()
    if (!razorpay) {
      res.status(503).json({ message: 'Payment integration is not configured. Please contact support.' })
      return
    }

    const idempotencyKey = uuidv4()
    const order = await razorpay.orders.create({
      amount: Math.round(booking.fareBreakdown.total * 100),
      currency: 'INR',
      receipt: booking.bookingRef,
      notes: { bookingId: booking._id.toString(), customerId: req.user!.id },
    })

    await Payment.create({
      booking: booking._id,
      gatewayOrderId: order.id,
      amount: booking.fareBreakdown.total,
      currency: 'INR',
      idempotencyKey,
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) { next(err) }
}

export async function verifyPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = z.object({
      razorpay_order_id: z.string(), razorpay_payment_id: z.string(),
      razorpay_signature: z.string(), bookingId: z.string(),
    }).parse(req.body)

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) throw new AppError('Payment integration not configured', 503)

    const expectedSig = crypto.createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSig !== razorpay_signature) throw new AppError('Payment signature verification failed', 400)

    const payment = await Payment.findOne({ gatewayOrderId: razorpay_order_id })
    if (!payment) throw new AppError('Payment record not found', 404)

    const booking = await Booking.findOne({ _id: bookingId, customer: req.user!.id })
    if (!booking) throw new AppError('Booking not found', 404)

    payment.gatewayPaymentId = razorpay_payment_id
    payment.gatewaySignature = razorpay_signature
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
    await Ticket.create({ booking: booking._id, qrPayload: ticketPayload })

    logger.info('Payment verified and booking confirmed', { bookingRef: booking.bookingRef })
    res.json({ message: 'Payment verified. Booking confirmed!', bookingRef: booking.bookingRef })
  } catch (err) { next(err) }
}

export async function webhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['x-razorpay-signature'] as string
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) { res.status(200).json({ received: true }); return }

  try {
    const expectedSig = crypto.createHmac('sha256', secret).update(req.body as Buffer).digest('hex')
    if (sig !== expectedSig) { res.status(400).json({ message: 'Invalid signature' }); return }
    const event = JSON.parse((req.body as Buffer).toString())
    logger.info('Razorpay webhook received', { eventId: event.id, type: event.event })
    res.status(200).json({ received: true })
  } catch (err) {
    logger.error('Webhook processing error', { err })
    res.status(200).json({ received: true })
  }
}

export async function paymentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const payment = await Payment.findById(req.params.id).populate('booking')
    if (!payment) throw new AppError('Payment not found', 404)
    res.json({ status: payment.status, amount: payment.amount, currency: payment.currency })
  } catch (err) { next(err) }
}
