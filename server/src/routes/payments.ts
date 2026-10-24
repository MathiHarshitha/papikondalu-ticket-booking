import { Router } from 'express'
import * as ctrl from '../controllers/paymentsController'
import { authenticate } from '../middleware/auth'
import express from 'express'

const router = Router()

router.post('/create-order', authenticate, ctrl.createOrder)
router.post('/verify', authenticate, ctrl.verifyPayment)
router.post('/webhook', express.urlencoded({ extended: false }), ctrl.webhook)
router.post('/payu-return', express.urlencoded({ extended: false }), ctrl.payuReturn)
router.get('/:id/status', authenticate, ctrl.paymentStatus)

export default router
