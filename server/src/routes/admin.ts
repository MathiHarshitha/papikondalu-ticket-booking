import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth'
import Booking from '../models/Booking'
import User from '../models/User'
import Refund from '../models/Refund'
import Package from '../models/Package'
import Departure from '../models/Departure'
import Boat from '../models/Boat'

const router = Router()
router.use(authenticate, requireAdmin)

// ─── Dashboard metrics ────────────────────────────────────────────────────────
router.get('/metrics', async (req, res) => {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const next7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const [
      totalBookings, todayBookings, confirmedBookings,
      monthRevenue, pendingRefunds, upcomingDepartures,
      cancellations, totalUsers, totalPackages,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfToday } }),
      Booking.countDocuments({ bookingStatus: 'CONFIRMED' }),
      Booking.aggregate([
        { $match: { bookingStatus: { $in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$fareBreakdown.total' } } },
      ]),
      Refund.countDocuments({ status: 'REQUESTED' }),
      Departure.countDocuments({ status: 'SCHEDULED', departureDate: { $gte: now, $lte: next7 } }),
      Booking.countDocuments({ bookingStatus: 'CANCELLED', cancelledAt: { $gte: startOfToday } }),
      User.countDocuments({ role: 'CUSTOMER' }),
      Package.countDocuments({ isPublished: true }),
    ])
    res.json({
      totalBookings,
      todayBookings,
      confirmedBookings,
      monthRevenue: monthRevenue[0]?.total ?? 0,
      pendingRefunds,
      upcomingDepartures,
      cancellations,
      totalUsers,
      totalPackages,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Reports ──────────────────────────────────────────────────────────────────
router.get('/reports', async (req, res) => {
  try {
    const months = 6
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)

    const [revenueByMonth, bookingsByStatus, topPackages] = await Promise.all([
      Booking.aggregate([
        { $match: { bookingStatus: { $in: ['CONFIRMED', 'COMPLETED'] }, createdAt: { $gte: start } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$fareBreakdown.total' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Booking.aggregate([
        { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { bookingStatus: { $in: ['CONFIRMED', 'COMPLETED'] } } },
        { $group: { _id: '$packageSnapshot.title', revenue: { $sum: '$fareBreakdown.total' }, count: { $sum: 1 } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
      ]),
    ])
    res.json({ revenueByMonth, bookingsByStatus, topPackages })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Bookings ─────────────────────────────────────────────────────────────────
router.get('/bookings', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(Math.max(1, Number(req.query.limit) || 50), 100)
    const { status, search } = req.query

    const filter: Record<string, unknown> = {}
    if (status) filter.bookingStatus = status
    if (search) {
      filter.$or = [
        { bookingRef: { $regex: search, $options: 'i' } },
        { leadPassengerName: { $regex: search, $options: 'i' } },
        { leadPassengerEmail: { $regex: search, $options: 'i' } },
      ]
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Booking.countDocuments(filter),
    ])
    res.json({ bookings, total, page, pages: Math.ceil(total / limit) })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body
    const allowed: string[] = ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING']
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const update: Record<string, unknown> = { bookingStatus: status }
    if (status === 'CANCELLED') {
      update.cancellationReason = reason ?? 'Cancelled by admin'
      update.cancelledAt = new Date()
      update.cancelledBy = (req as any).user?.id
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ booking })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Refunds ──────────────────────────────────────────────────────────────────
router.get('/refunds', async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate('booking', 'bookingRef packageSnapshot')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
    res.json({ refunds })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/refunds/:id/approve', async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id)
    if (!refund) return res.status(404).json({ message: 'Refund not found' })
    refund.status = 'APPROVED'
    await refund.save()
    res.json({ message: 'Approved', refund })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Users / Customers ────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { search, role } = req.query
    const filter: Record<string, unknown> = {}
    if (role) filter.role = role
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }
    const users = await User.find(filter).select('-passwordHash -tokens').sort({ createdAt: -1 }).limit(500).lean()
    res.json({ users })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    const allowed = ['CUSTOMER', 'CHECKIN_STAFF', 'BOOKING_MANAGER', 'CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN']
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' })
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Packages (admin list includes unpublished) ───────────────────────────────
router.get('/packages', async (req, res) => {
  try {
    const { search } = req.query
    const filter: Record<string, unknown> = {}
    if (search) filter.title = { $regex: search, $options: 'i' }
    const packages = await Package.find(filter).sort({ createdAt: -1 }).lean()
    res.json({ packages })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/packages', async (req, res) => {
  try {
    const pkg = await Package.create(req.body)
    res.status(201).json({ package: pkg })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/packages/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!pkg) return res.status(404).json({ message: 'Package not found' })
    res.json({ package: pkg })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/packages/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id)
    if (!pkg) return res.status(404).json({ message: 'Package not found' })
    res.json({ message: 'Package deleted' })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Boats ────────────────────────────────────────────────────────────────────
router.get('/boats', async (req, res) => {
  try {
    const boats = await Boat.find().sort({ name: 1 }).lean()
    res.json({ boats })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/boats', async (req, res) => {
  try {
    const boat = await Boat.create(req.body)
    res.status(201).json({ boat })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/boats/:id', async (req, res) => {
  try {
    const boat = await Boat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!boat) return res.status(404).json({ message: 'Boat not found' })
    res.json({ boat })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/boats/:id', async (req, res) => {
  try {
    const boat = await Boat.findByIdAndDelete(req.params.id)
    if (!boat) return res.status(404).json({ message: 'Boat not found' })
    res.json({ message: 'Boat deleted' })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// ─── Departures ───────────────────────────────────────────────────────────────
router.get('/departures', async (req, res) => {
  try {
    const { status, from, to } = req.query
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (from || to) {
      filter.departureDate = {}
      if (from) (filter.departureDate as any).$gte = new Date(from as string)
      if (to) (filter.departureDate as any).$lte = new Date(to as string)
    }
    const departures = await Departure.find(filter)
      .populate('package', 'title slug')
      .populate('boat', 'name identifier capacity')
      .sort({ departureDate: -1 })
      .limit(200)
      .lean()
    res.json({ departures })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/departures', async (req, res) => {
  try {
    const departure = await Departure.create(req.body)
    const populated = await Departure.findById(departure._id)
      .populate('package', 'title slug')
      .populate('boat', 'name identifier capacity')
      .lean()
    res.status(201).json({ departure: populated })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/departures/:id', async (req, res) => {
  try {
    const departure = await Departure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('package', 'title slug')
      .populate('boat', 'name identifier capacity')
    if (!departure) return res.status(404).json({ message: 'Departure not found' })
    res.json({ departure })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/departures/:id', async (req, res) => {
  try {
    const departure = await Departure.findByIdAndDelete(req.params.id)
    if (!departure) return res.status(404).json({ message: 'Departure not found' })
    res.json({ message: 'Departure deleted' })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
