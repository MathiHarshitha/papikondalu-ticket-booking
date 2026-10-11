import { Router } from 'express'
import * as authController from '../controllers/authController'
import { authenticate } from '../middleware/auth'
import rateLimit from 'express-rate-limit'

const router = Router()

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts. Try again in 15 minutes.' } })
const resetLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { message: 'Too many reset attempts. Try again in 1 hour.' } })

router.post('/register', loginLimiter, authController.register)
router.post('/login', loginLimiter, authController.login)
router.post('/logout', authenticate, authController.logout)
router.get('/me', authenticate, authController.me)
router.post('/verify-email', authController.verifyEmail)
router.post('/forgot-password', resetLimiter, authController.forgotPassword)
router.post('/reset-password', resetLimiter, authController.resetPassword)

export default router
