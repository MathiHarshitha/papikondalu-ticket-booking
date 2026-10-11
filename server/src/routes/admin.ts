import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth'
import Booking from '../models/Booking'
import User from '../models/User'
import Refund from '../models/Refund'
import Package from '../models/Package'

const router = Router()
router.use(authenticate, requireAdmin)

// Dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const [
      totalBookings, confirmedBookings, totalRevenue, pendingRefunds,
      totalUsers, totalPackages
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'CONFIRMED' }),
      Booking.aggregate([{ $match: { status: { $in: ['CONFIRMED', 'COMPLETED'] } } }, { $group: { _id: null, total: { $sum: '$totalFare' } } }]),
      Refund.countDocuments({ status: 'REQUESTED' }),
      User.countDocuments({ role: 'CUSTOMER' }),
      Package.countDocuments({ isPublished: true }),
    ])
    res.json({
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total ?? 0,
      pendingRefunds,
      totalUsers,
      totalPackages,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// All bookings (paginated)
router.get('/bookings', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 50
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    const total = await Booking.countDocuments()
    res.json({ bookings, total, page, pages: Math.ceil(total / limit) })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// All refunds
router.get('/refunds', async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate('booking', 'bookingRef packageSnapshot')
      .populate('user', 'name email')
      .sort({ requestedAt: -1 })
      .limit(200)
      .lean()
    res.json({ refunds })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// Approve a refund
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

// All users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash -tokens').sort({ createdAt: -1 }).limit(500).lean()
    res.json({ users })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
