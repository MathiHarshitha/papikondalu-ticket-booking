import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { UserRole } from '../models/User'

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole; email: string }
}

const SESSION_DAYS = 7
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000
const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60
const COOKIE_NAME = () => process.env.COOKIE_NAME || 'papikondalu_session'

function slideCookie(res: Response, payload: { id: string; role: UserRole; email: string }, secret: string): void {
  const isProd = process.env.NODE_ENV === 'production'
  const newToken = jwt.sign({ id: payload.id, role: payload.role, email: payload.email }, secret, { expiresIn: SESSION_SECONDS })
  res.cookie(COOKIE_NAME(), newToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: SESSION_MS,
    path: '/',
  })
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME()]
  if (!token) { res.status(401).json({ message: 'Authentication required' }); return }
  try {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) { res.status(503).json({ message: 'Server configuration error' }); return }
    const payload = jwt.verify(token, secret) as { id: string; role: UserRole; email: string; exp: number }
    req.user = { id: payload.id, role: payload.role, email: payload.email }

    // Sliding session: refresh the cookie whenever less than 6 days remain
    const remaining = payload.exp - Math.floor(Date.now() / 1000)
    if (remaining < 6 * 24 * 60 * 60) {
      slideCookie(res, req.user, secret)
    }

    next()
  } catch {
    res.status(401).json({ message: 'Session expired. Please login again.' })
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) { res.status(401).json({ message: 'Authentication required' }); return }
    if (!roles.includes(req.user.role)) { res.status(403).json({ message: 'Insufficient permissions' }); return }
    next()
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) { res.status(401).json({ message: 'Authentication required' }); return }
  const adminRoles: UserRole[] = ['ADMIN', 'SUPER_ADMIN']
  if (!adminRoles.includes(req.user.role)) { res.status(403).json({ message: 'Admin access required' }); return }
  next()
}
