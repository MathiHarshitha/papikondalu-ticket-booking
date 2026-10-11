import { Schema, model, Document, Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'EXPIRED'
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'CANCELLED' | 'PARTIALLY_REFUNDED' | 'REFUNDED'

export interface IBooking extends Document {
  bookingRef: string
  customer: Types.ObjectId
  package: Types.ObjectId
  departure: Types.ObjectId
  passengers: { name: string; ageCategory: 'adult' | 'child' }[]
  adultCount: number
  childCount: number
  leadPassengerName: string
  leadPassengerPhone: string
  leadPassengerEmail: string
  fareBreakdown: {
    adultPrice: number; childPrice: number;
    adultTotal: number; childTotal: number;
    tax: number; total: number;
  }
  packageSnapshot: { title: string; duration: string; departureDate: Date; boardingLocation: string }
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  holdExpiresAt: Date | null
  cancellationReason: string
  cancelledAt: Date | null
  cancelledBy: Types.ObjectId | null
  specialRequests: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>({
  bookingRef: { type: String, default: () => `PK${Date.now().toString(36).toUpperCase()}${uuidv4().slice(0,4).toUpperCase()}` },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  departure: { type: Schema.Types.ObjectId, ref: 'Departure', required: true },
  passengers: [{ name: String, ageCategory: { type: String, enum: ['adult','child'], default: 'adult' } }],
  adultCount: { type: Number, required: true, min: 1 },
  childCount: { type: Number, default: 0 },
  leadPassengerName: { type: String, required: true },
  leadPassengerPhone: { type: String, required: true },
  leadPassengerEmail: { type: String, required: true },
  fareBreakdown: {
    adultPrice: Number, childPrice: Number,
    adultTotal: Number, childTotal: Number,
    tax: { type: Number, default: 0 }, total: Number,
  },
  packageSnapshot: {
    title: String, duration: String,
    departureDate: Date, boardingLocation: String,
  },
  bookingStatus: { type: String, enum: ['PENDING','CONFIRMED','CANCELLED','COMPLETED','EXPIRED'], default: 'PENDING' },
  paymentStatus: { type: String, enum: ['PENDING','AUTHORIZED','CAPTURED','FAILED','CANCELLED','PARTIALLY_REFUNDED','REFUNDED'], default: 'PENDING' },
  holdExpiresAt: { type: Date, default: null },
  cancellationReason: { type: String, default: '' },
  cancelledAt: { type: Date, default: null },
  cancelledBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  specialRequests: { type: String, default: '' },
}, { timestamps: true })

BookingSchema.index({ customer: 1, createdAt: -1 })
BookingSchema.index({ bookingRef: 1 }, { unique: true })
BookingSchema.index({ departure: 1, bookingStatus: 1 })
BookingSchema.index({ holdExpiresAt: 1 }, { sparse: true })

export default model<IBooking>('Booking', BookingSchema)
