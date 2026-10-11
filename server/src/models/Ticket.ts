import { Schema, model, Document, Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ITicket extends Document {
  booking: Types.ObjectId
  ticketId: string
  qrPayload: string
  contactName: string
  isValid: boolean
  checkedIn: boolean
  checkedInAt: Date | null
  checkedInBy: Types.ObjectId | null
  checkedInDeparture: Types.ObjectId | null
  invalidatedAt: Date | null
  invalidationReason: string
  issuedAt: Date
}

const TicketSchema = new Schema<ITicket>({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  contactName: { type: String, default: '' },
  ticketId: { type: String, default: () => `TKT-${uuidv4().toUpperCase()}` },
  qrPayload: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date, default: null },
  checkedInBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  checkedInDeparture: { type: Schema.Types.ObjectId, ref: 'Departure', default: null },
  invalidatedAt: { type: Date, default: null },
  invalidationReason: { type: String, default: '' },
  issuedAt: { type: Date, default: Date.now },
}, { timestamps: true })

TicketSchema.index({ ticketId: 1 }, { unique: true })
TicketSchema.index({ booking: 1 }, { unique: true })

export default model<ITicket>('Ticket', TicketSchema)
