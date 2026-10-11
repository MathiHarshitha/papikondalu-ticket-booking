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

const app = express()

// Security headers
app.use(helmet())

// CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',')
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Body parsing (webhook uses raw body — must be before json middleware for that route)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payments/webhook') next()
  else express.json({ limit: '2mb' })(req, res, next)
})
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(cookieParser())

// Global rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }))

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API routes
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
