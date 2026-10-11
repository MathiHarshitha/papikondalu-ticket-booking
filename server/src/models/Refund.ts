import { Schema, model, Document, Types } from 'mongoose'

export type RefundStatus = 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'PROCESSED' | 'FAILED'

export interface IRefund extends Document {
  booking: Types.ObjectId
  payment: Types.ObjectId
  requestedBy: Types.ObjectId
  approvedBy: Types.ObjectId | null
  requestedAmount: number
  approvedAmount: number | null
  reason: string
  internalNotes: string
  status: RefundStatus
  gatewayRefundId: string | null
  failureReason: string
  processedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const RefundSchema = new Schema<IRefund>({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  requestedAmount: { type: Number, required: true },
  approvedAmount: { type: Number, default: null },
  reason: { type: String, required: true },
  internalNotes: { type: String, default: '' },
  status: { type: String, enum: ['REQUESTED','UNDER_REVIEW','APPROVED','REJECTED','PROCESSING','PROCESSED','FAILED'], default: 'REQUESTED' },
  gatewayRefundId: { type: String, default: null },
  failureReason: { type: String, default: '' },
  processedAt: { type: Date, default: null },
}, { timestamps: true })

RefundSchema.index({ booking: 1 })
RefundSchema.index({ status: 1 })

export default model<IRefund>('Refund', RefundSchema)
