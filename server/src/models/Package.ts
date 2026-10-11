import { Schema, model, Document } from 'mongoose'

export interface IPackage extends Document {
  title: string
  slug: string
  subtitle: string
  category: 'day-tour' | 'multi-day' | 'camping' | 'temple' | 'adventure'
  duration: string
  departureLocations: string[]
  description: string
  itinerary: { time: string; activity: string }[]
  inclusions: string[]
  exclusions: string[]
  highlights: string[]
  adultPrice: number | null
  childPrice: number | null
  maxCapacity: number
  bestSeason: string
  images: string[]
  coverImage: string
  badge: string | null
  isPublished: boolean
  seoTitle: string
  seoDescription: string
  cancellationPolicy: string
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackage>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
  subtitle: { type: String, default: '' },
  category: { type: String, enum: ['day-tour','multi-day','camping','temple','adventure'], required: true },
  duration: { type: String, required: true },
  departureLocations: [{ type: String }],
  description: { type: String, required: true },
  itinerary: [{ time: String, activity: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  highlights: [{ type: String }],
  adultPrice: { type: Number, default: null },
  childPrice: { type: Number, default: null },
  maxCapacity: { type: Number, required: true },
  bestSeason: { type: String, default: 'October – March' },
  images: [{ type: String }],
  coverImage: { type: String, default: '' },
  badge: { type: String, default: null },
  isPublished: { type: Boolean, default: false },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  cancellationPolicy: { type: String, default: '' },
}, { timestamps: true })

PackageSchema.index({ slug: 1 }, { unique: true })
PackageSchema.index({ isPublished: 1, category: 1 })

export default model<IPackage>('Package', PackageSchema)
