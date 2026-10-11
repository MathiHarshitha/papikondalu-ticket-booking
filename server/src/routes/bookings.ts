import { Router } from 'express'
import * as ctrl from '../controllers/bookingsController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.post('/hold', ctrl.holdSeats)
router.post('/', ctrl.createBooking)
router.get('/my', ctrl.myBookings)
router.get('/my/:id', ctrl.myBookingDetail)
router.post('/my/:id/cancel-request', ctrl.cancelRequest)
router.post('/:id/cancel', ctrl.cancelRequest)
router.get('/:id/ticket', ctrl.getTicket)

export default router
