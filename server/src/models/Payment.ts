import { Schema, model, Document, Types } from 'mongoose'

export type PaymentState = 'CREATED' | 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'CANCELLED' | 'PARTIALLY_REFUNDED' | 'REFUNDED'

export interface IPayment extends Document {
  booking: Types.ObjectId
  gateway: 'razorpay'
  gatewayOrderId: string
  gatewayPaymentId: string | null
  gatewaySignature: string | null
  amount: number
  currency: string
  status: PaymentState
  idempotencyKey: string
  webhookEvents: { eventId: string; type: string; processedAt: Date }[]
  refundIds: string[]
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  gateway: { type: String, default: 'razorpay' },
  gatewayOrderId: { type: String, required: true },
  gatewayPaymentId: { type: String, default: null },
  gatewaySignature: { type: String, default: null },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['CREATED','PENDING','AUTHORIZED','CAPTURED','FAILED','CANCELLED','PARTIALLY_REFUNDED','REFUNDED'], default: 'CREATED' },
  idempotencyKey: { type: String },
  webhookEvents: [{ eventId: String, type: String, processedAt: Date }],
  refundIds: [{ type: String }],
  metadata: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true })

PaymentSchema.index({ booking: 1 })
PaymentSchema.index({ gatewayOrderId: 1 })
PaymentSchema.index({ idempotencyKey: 1 }, { unique: true })

export default model<IPayment>('Payment', PaymentSchema)
