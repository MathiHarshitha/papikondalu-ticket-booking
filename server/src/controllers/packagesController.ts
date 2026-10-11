import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import Package from '../models/Package'
import { AppError } from '../middleware/errorHandler'

export async function listPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, departure, page = '1', limit = '20' } = req.query
    const filter: Record<string, unknown> = { isPublished: true }
    if (category && category !== 'all') filter.category = category
    if (departure && departure !== 'all') filter.departureLocations = departure

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const [packages, total] = await Promise.all([
      Package.find(filter).skip(skip).limit(parseInt(limit as string)).select('-itinerary -inclusions -exclusions').lean(),
      Package.countDocuments(filter),
    ])
    res.json({ packages, total, page: parseInt(page as string), pages: Math.ceil(total / parseInt(limit as string)) })
  } catch (err) { next(err) }
}

export async function getPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isPublished: true }).lean()
    if (!pkg) throw new AppError('Package not found', 404)
    res.json({ package: pkg })
  } catch (err) { next(err) }
}

const packageSchema = z.object({
  title: z.string().min(3), slug: z.string().min(3),
  category: z.enum(['day-tour','multi-day','camping','temple','adventure']),
  duration: z.string(), departureLocations: z.array(z.string()),
  description: z.string(), maxCapacity: z.number().positive(),
  adultPrice: z.number().nullable().optional(), childPrice: z.number().nullable().optional(),
  isPublished: z.boolean().optional(),
})

export async function createPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = packageSchema.parse(req.body)
    const pkg = await Package.create(data)
    res.status(201).json({ package: pkg })
  } catch (err) { next(err) }
}

export async function updatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!pkg) throw new AppError('Package not found', 404)
    res.json({ package: pkg })
  } catch (err) { next(err) }
}

export async function deletePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id)
    if (!pkg) throw new AppError('Package not found', 404)
    res.json({ message: 'Package deleted' })
  } catch (err) { next(err) }
}
