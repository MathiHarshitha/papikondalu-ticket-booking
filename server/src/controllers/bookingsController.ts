import { Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'
import Booking from '../models/Booking'
import Departure from '../models/Departure'
import Ticket from '../models/Ticket'
import Package from '../models/Package'
import { AppError } from '../middleware/errorHandler'
import mongoose from 'mongoose'

const holdSchema = z.object({
  departureId: z.string(),
  adultCount: z.number().int().min(1),
  childCount: z.number().int().min(0).default(0),
})

export async function holdSeats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const session = await mongoose.startSession()
  try {
    const { departureId, adultCount, childCount } = holdSchema.parse(req.body)
    const totalSeats = adultCount + childCount

    const result = await session.withTransaction(async () => {
      const dep = await Departure.findOneAndUpdate(
        { _id: departureId, status: 'SCHEDULED', $expr: { $lte: [{ $add: ['$confirmedSeats', '$heldSeats', totalSeats] }, '$totalCapacity'] } },
        { $inc: { heldSeats: totalSeats } },
        { new: true, session }
      )
      if (!dep) throw new AppError('Departure not available or insufficient capacity', 409)

      const pkg = await Package.findById(dep.package).lean().session(session)
      if (!pkg) throw new AppError('Package not found', 404)

      const adultPrice = pkg.adultPrice || 0
      const childPrice = pkg.childPrice || 0
      const total = adultCount * adultPrice + childCount * childPrice

      const booking = await Booking.create([{
        customer: req.user!.id,
        package: dep.package,
        departure: departureId,
        adultCount, childCount,
        leadPassengerName: '', leadPassengerPhone: '', leadPassengerEmail: '',
        fareBreakdown: { adultPrice, childPrice, adultTotal: adultCount * adultPrice, childTotal: childCount * childPrice, tax: 0, total },
        packageSnapshot: { title: pkg.title, duration: pkg.duration, departureDate: dep.departureDate, boardingLocation: dep.boardingLocation },
        bookingStatus: 'PENDING',
        holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      }], { session })

      return { booking: booking[0], fareTotal: total }
    })

    res.status(201).json({ booking: result.booking, fareTotal: result.fareTotal })
  } catch (err) { next(err) } finally { session.endSession() }
}

const bookingSchema = z.object({
  bookingId: z.string(),
  leadPassengerName: z.string().min(2),
  leadPassengerPhone: z.string().min(7),
  leadPassengerEmail: z.string().email(),
  passengers: z.array(z.object({ name: z.string(), ageCategory: z.enum(['adult','child']) })).optional(),
  specialRequests: z.string().optional(),
})

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId, leadPassengerName, leadPassengerPhone, leadPassengerEmail, passengers, specialRequests } = bookingSchema.parse(req.body)
    const booking = await Booking.findOne({ _id: bookingId, customer: req.user!.id, bookingStatus: 'PENDING', holdExpiresAt: { $gt: new Date() } })
    if (!booking) throw new AppError('Booking hold expired or not found. Please restart the booking.', 404)
    booking.leadPassengerName = leadPassengerName
    booking.leadPassengerPhone = leadPassengerPhone
    booking.leadPassengerEmail = leadPassengerEmail
    if (passengers) booking.passengers = passengers
    if (specialRequests) booking.specialRequests = specialRequests
    await booking.save()
    res.json({ booking })
  } catch (err) { next(err) }
}

export async function myBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const bookings = await Booking.find({ customer: req.user!.id }).sort({ createdAt: -1 }).limit(50).lean()
    res.json({ bookings })
  } catch (err) { next(err) }
}

export async function myBookingDetail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user!.id }).populate('package departure').lean()
    if (!booking) throw new AppError('Booking not found', 404)
    res.json({ booking })
  } catch (err) { next(err) }
}

export async function cancelRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { reason } = z.object({ reason: z.string().min(5) }).parse(req.body)
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user!.id, bookingStatus: 'CONFIRMED' })
    if (!booking) throw new AppError('Booking not found or not eligible for cancellation', 404)
    booking.cancellationReason = reason
    await booking.save()
    res.json({ message: 'Cancellation request submitted. We will review and contact you shortly.' })
  } catch (err) { next(err) }
}

export async function getTicket(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user!.id, bookingStatus: 'CONFIRMED' })
    if (!booking) throw new AppError('Confirmed booking not found', 404)
    const ticket = await Ticket.findOne({ booking: booking._id })
    if (!ticket) throw new AppError('Ticket not yet generated', 404)
    res.json({ ticket, booking })
  } catch (err) { next(err) }
}
