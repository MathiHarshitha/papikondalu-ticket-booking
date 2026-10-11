import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../config/logger'

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    })
    return
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }
  logger.error('Unhandled error', { err, path: req.path })
  res.status(500).json({ message: 'An unexpected error occurred. Please try again.' })
}
