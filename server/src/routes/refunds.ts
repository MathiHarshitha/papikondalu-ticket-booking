import { Router, Response } from 'express'
import { authenticate, requireRole, AuthRequest } from '../middleware/auth'
import Refund from '../models/Refund'

const router = Router()

// Customer: list my refunds
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const refunds = await Refund.find({ requestedBy: req.user!.id })
      .populate('booking', 'bookingRef')
      .sort({ createdAt: -1 })
      .lean()
    const formatted = refunds.map((r: any) => ({
      _id: r._id,
      bookingRef: r.booking?.bookingRef ?? '—',
      amount: r.requestedAmount,
      status: r.status,
      requestedAt: r.createdAt,
      processedAt: r.processedAt,
    }))
    res.json({ refunds: formatted })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// Admin: list all refunds
router.get('/', authenticate, requireRole('BOOKING_MANAGER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const refunds = await Refund.find()
      .populate('booking', 'bookingRef packageSnapshot')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
    const formatted = refunds.map((r: any) => ({
      _id: r._id,
      bookingRef: r.booking?.bookingRef,
      contactName: r.requestedBy?.name,
      packageName: r.booking?.packageSnapshot?.title,
      amount: r.requestedAmount,
      status: r.status,
      requestedAt: r.createdAt,
    }))
    res.json({ refunds: formatted })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

// Admin: approve refund
router.post('/:id/approve', authenticate, requireRole('BOOKING_MANAGER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const refund = await Refund.findById(req.params.id)
    if (!refund) return res.status(404).json({ message: 'Refund not found' })
    if (refund.status !== 'REQUESTED') return res.status(400).json({ message: `Cannot approve a refund in ${refund.status} status` })
    refund.status = 'APPROVED'
    await refund.save()
    res.json({ message: 'Refund approved', refund })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

export default router
