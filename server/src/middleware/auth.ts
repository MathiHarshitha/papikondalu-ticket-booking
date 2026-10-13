import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { UserRole } from '../models/User'

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole; email: string }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[process.env.COOKIE_NAME || 'papikondalu_session']
  if (!token) { res.status(401).json({ message: 'Authentication required' }); return }
  try {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) { res.status(503).json({ message: 'Server configuration error' }); return }
    const payload = jwt.verify(token, secret) as { id: string; role: UserRole; email: string }
    req.user = payload
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
