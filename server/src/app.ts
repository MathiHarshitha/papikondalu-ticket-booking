import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth'
import packageRoutes from './routes/packages'
import bookingRoutes from './routes/bookings'
import paymentRoutes from './routes/payments'
import ticketRoutes from './routes/tickets'
import refundRoutes from './routes/refunds'
import adminRoutes from './routes/admin'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './config/logger'

const app = express()

// Warn on missing critical secrets at startup
if (!process.env.JWT_ACCESS_SECRET) logger.warn('JWT_ACCESS_SECRET is not set — using insecure fallback. Set it before going to production.')
if (!process.env.PAYU_KEY || !process.env.PAYU_SALT) logger.warn('PAYU_KEY / PAYU_SALT not set — payment features will be unavailable.')

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://jssdk.payu.in'],
      frameSrc: ["'self'", 'https://secure.payu.in'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map(o => o.trim())
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Body parsing.
// Webhook requires urlencoded (PayU IPN) and bypasses JSON middleware.
// All other routes receive JSON only — deliberately NOT applying global urlencoded
// so cross-origin form POST attacks cannot submit a parseable body (CSRF mitigation).
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payments/webhook') return next()
  express.json({ limit: '2mb' })(req, res, next)
})
app.use(cookieParser())

// General rate limiter — covers all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(globalLimiter)

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API routes — login/register rate limits are applied per-route inside auth.ts
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/packages', packageRoutes)
app.use('/api/v1/bookings', bookingRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/tickets', ticketRoutes)
app.use('/api/v1/refunds', refundRoutes)
app.use('/api/v1/admin', adminRoutes)

// 404
app.use((_, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use(errorHandler)

export default app
