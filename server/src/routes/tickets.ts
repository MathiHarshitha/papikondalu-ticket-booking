import { Router, Response } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import Ticket from '../models/Ticket'
import Booking from '../models/Booking'

const router = Router()

// Customer: get my tickets
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customer: req.user!.id }).select('_id').lean()
    const bookingIds = bookings.map(b => b._id)
    const tickets = await Ticket.find({ booking: { $in: bookingIds } })
      .populate('booking', 'bookingRef packageSnapshot adultCount childCount')
      .sort({ createdAt: -1 })
      .lean()
    const formatted = tickets.map((t: any) => ({
      ticketId: t.ticketId,
      bookingRef: t.booking?.bookingRef,
      packageName: t.booking?.packageSnapshot?.title,
      departureDate: t.booking?.packageSnapshot?.departureDate,
      passengers: (t.booking?.adultCount ?? 0) + (t.booking?.childCount ?? 0),
      departurePoint: t.booking?.packageSnapshot?.boardingLocation ?? 'Rajahmundry',
      status: t.checkedIn ? 'CHECKED_IN' : 'VALID',
      qrPayload: t.qrPayload,
    }))
    res.json({ tickets: formatted })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// Checkin staff / admin: verify and check in a ticket
router.post('/checkin', authenticate, requireRole('CHECKIN_STAFF', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { ticketId } = req.body
    if (!ticketId) return res.status(400).json({ message: 'ticketId is required' })

    const ticket: any = await Ticket.findOne({ ticketId })
      .populate('booking', 'bookingRef packageSnapshot adultCount childCount')

    if (!ticket) return res.status(404).json({ message: 'Ticket not found. Check the ID and try again.' })

    const alreadyCheckedIn = ticket.checkedIn === true
    if (!alreadyCheckedIn) {
      ticket.checkedIn = true
      ticket.checkedInAt = new Date()
      ticket.checkedInBy = req.user!.id
      await ticket.save()
    }

    const bk: any = ticket.booking
    res.json({
      message: alreadyCheckedIn ? 'Ticket already checked in' : 'Check-in successful',
      ticket: {
        ticketId: ticket.ticketId,
        bookingRef: bk?.bookingRef,
        packageName: bk?.packageSnapshot?.title,
        departureDate: bk?.packageSnapshot?.departureDate,
        passengers: (bk?.adultCount ?? 0) + (bk?.childCount ?? 0),
        contactName: ticket.contactName,
        alreadyCheckedIn,
      },
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
