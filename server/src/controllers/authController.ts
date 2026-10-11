import { Request, Response, NextFunction } from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from 'zod'
import User from '../models/User'
import { AppError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { logger } from '../config/logger'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(15),
  password: z.string().min(8).max(72),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function issueToken(userId: string, role: string, email: string): string {
  return jwt.sign(
    { id: userId, role, email },
    process.env.JWT_ACCESS_SECRET || 'fallback_secret',
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any }
  )
}

function setCookieToken(res: Response, token: string): void {
  res.cookie(process.env.COOKIE_NAME || 'papikondalu_session', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  })
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, phone, password } = registerSchema.parse(req.body)
    const exists = await User.findOne({ email }).select('_id').lean()
    if (exists) { throw new AppError('An account with this email already exists.', 409) }
    const passwordHash = await argon2.hash(password)
    const verifyToken = crypto.randomBytes(32).toString('hex')
    const user = await User.create({
      name, email, phone, passwordHash,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    logger.info('New customer registered', { userId: user._id, email })
    res.status(201).json({ message: 'Account created. Please check your email to verify your account.', userId: user._id })
  } catch (err) { next(err) }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new AppError('Invalid email or password.', 401)
    }
    if (!user.isActive) throw new AppError('Account is deactivated. Contact support.', 403)
    const token = issueToken(user._id.toString(), user.role, user.email)
    setCookieToken(res, token)
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) { next(err) }
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie(process.env.COOKIE_NAME || 'papikondalu_session')
  res.json({ message: 'Logged out successfully' })
}

export async function me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user!.id).select('-passwordHash')
    if (!user) throw new AppError('User not found', 404)
    res.json({ user })
  } catch (err) { next(err) }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = z.object({ token: z.string() }).parse(req.body)
    const user = await User.findOne({ emailVerifyToken: token, emailVerifyExpires: { $gt: new Date() } })
    if (!user) throw new AppError('Invalid or expired verification token.', 400)
    user.emailVerified = true
    user.emailVerifyToken = undefined
    user.emailVerifyExpires = undefined
    await user.save()
    res.json({ message: 'Email verified successfully.' })
  } catch (err) { next(err) }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body)
    const user = await User.findOne({ email })
    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      user.passwordResetToken = token
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000)
      await user.save()
      logger.info('Password reset requested', { userId: user._id })
    }
    res.json({ message: 'If an account exists, a password reset link has been sent.' })
  } catch (err) { next(err) }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = z.object({ token: z.string(), password: z.string().min(8) }).parse(req.body)
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: new Date() } })
    if (!user) throw new AppError('Invalid or expired reset token.', 400)
    user.passwordHash = await argon2.hash(password)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (err) { next(err) }
}
