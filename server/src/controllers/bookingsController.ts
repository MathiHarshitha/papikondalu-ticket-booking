import { Response, NextFunction } from 'express'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'
import Booking from '../models/Booking'
import Departure from '../models/Departure'
import Ticket from '../models/Ticket'
import Package from '../models/Package'
import Boat from '../models/Boat'
import { AppError } from '../middleware/errorHandler'
import mongoose from 'mongoose'

const holdSchema = z.object({
  packageSlug: z.string(),
  departureDate: z.string(),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).default(0),
  contactName: z.string().min(2),
  contactPhone: z.string().min(7),
  contactEmail: z.string().email(),
  passengers: z.array(z.object({
    name: z.string(),
    age: z.string().optional(),
    id: z.string().optional(),
  })).optional(),
})

/** Release heldSeats for bookings whose hold window has expired. */
async function releaseExpiredHolds(): Promise<void> {
  const now = new Date()
  const expired = await Booking.find({
    bookingStatus: 'PENDING',
    holdExpiresAt: { $lt: now },
  }).select('departure adultCount childCount').lean()

  for (const b of expired) {
    await Booking.updateOne({ _id: b._id }, { $set: { bookingStatus: 'EXPIRED' } })
    await Departure.findByIdAndUpdate(b.departure, {
      $inc: { heldSeats: -(b.adultCount + b.childCount) },
    })
  }
}

export async function holdSeats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const session = await mongoose.startSession()
  try {
    const { packageSlug, departureDate, adults, children, contactName, contactPhone, contactEmail, passengers } = holdSchema.parse(req.body)
    const totalSeats = adults + children

    // Release seats from holds that have already expired so they don't
    // permanently consume capacity.  Runs outside the transaction so that
    // errors here do not block the new booking attempt.
    await releaseExpiredHolds().catch(() => {})

    const result = await session.withTransaction(async () => {
      const pkg = await Package.findOne({ slug: packageSlug }).lean().session(session)
      if (!pkg) throw new AppError('Package not found', 404)

      const depDate = new Date(departureDate + 'T00:00:00')
      const nextDay = new Date(depDate.getTime() + 24 * 60 * 60 * 1000)

      // Find an existing scheduled departure for this package+date, or create one
      let dep = await Departure.findOneAndUpdate(
        {
          package: pkg._id,
          departureDate: { $gte: depDate, $lt: nextDay },
          status: 'SCHEDULED',
          $expr: { $lte: [{ $add: ['$confirmedSeats', '$heldSeats', totalSeats] }, '$totalCapacity'] },
        },
        { $inc: { heldSeats: totalSeats } },
        { new: true, session }
      )

      if (!dep) {
        // Auto-create a departure for this date (uses first available boat)
        const boat = await Boat.findOne().lean().session(session)
        if (!boat) throw new AppError('No boats available. Please contact us to book this date.', 409)

        const capacity = (boat as any).capacity ?? pkg.maxCapacity
        if (totalSeats > capacity) throw new AppError('Requested seats exceed boat capacity', 409)

        const [created] = await Departure.create([{
          package: pkg._id,
          boat: (boat as any)._id,
          departureDate: depDate,
          departureTime: '06:00',
          boardingLocation: pkg.departureLocations?.[0] ?? 'Rajahmundry',
          totalCapacity: capacity,
          confirmedSeats: 0,
          heldSeats: totalSeats,
          status: 'SCHEDULED',
        }], { session })
        dep = created
      }

      const adultPrice = pkg.adultPrice ?? 0
      const childPrice = pkg.childPrice ?? adultPrice
      const subtotal = adults * adultPrice + children * childPrice
      const tax = Math.round(subtotal * 0.05)
      const total = subtotal + tax

      const passengerList = (passengers ?? []).map((p, i) => ({
        name: p.name,
        ageCategory: i < adults ? 'adult' : 'child',
      }))

      const [booking] = await Booking.create([{
        customer: req.user!.id,
        package: pkg._id,
        departure: dep._id,
        adultCount: adults,
        childCount: children,
        leadPassengerName: contactName,
        leadPassengerPhone: contactPhone,
        leadPassengerEmail: contactEmail,
        passengers: passengerList,
        fareBreakdown: {
          adultPrice,
          childPrice,
          adultTotal: adults * adultPrice,
          childTotal: children * childPrice,
          tax,
          total,
        },
        packageSnapshot: {
          title: pkg.title,
          duration: pkg.duration,
          departureDate: depDate,
          boardingLocation: dep.boardingLocation,
        },
        bookingStatus: 'PENDING',
        holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      }], { session })

      return { booking, fareTotal: total }
    })

    res.status(201).json({ bookingId: result.booking._id, fareTotal: result.fareTotal })
  } catch (err) { next(err) } finally { session.endSession() }
}

const bookingSchema = z.object({
  bookingId: z.string(),
  leadPassengerName: z.string().min(2),
  leadPassengerPhone: z.string().min(7),
  leadPassengerEmail: z.string().email(),
  passengers: z.array(z.object({ name: z.string(), ageCategory: z.enum(['adult', 'child']) })).optional(),
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
    if (passengers) booking.passengers = passengers as Array<{ name: string; ageCategory: 'adult' | 'child' }>
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
    // Atomic status transition: only one concurrent request can win this update.
    // The bookingStatus: 'CONFIRMED' filter means the second concurrent call
    // will match nothing (status is already CANCELLED) and returns null,
    // preventing a double-decrement of confirmedSeats.
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customer: req.user!.id, bookingStatus: 'CONFIRMED' },
      {
        $set: {
          bookingStatus: 'CANCELLED',
          cancellationReason: reason,
          cancelledAt: new Date(),
          cancelledBy: new mongoose.Types.ObjectId(req.user!.id),
        },
      },
      { new: true }
    )
    if (!booking) throw new AppError('Booking not found or not eligible for cancellation', 404)
    // Safe to decrement: the atomic findOneAndUpdate guarantees this runs at most once.
    await Departure.findByIdAndUpdate(booking.departure, {
      $inc: { confirmedSeats: -(booking.adultCount + booking.childCount) },
    })
    res.json({ message: 'Booking cancelled. Refund will be processed per our cancellation policy.' })
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
