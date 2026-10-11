import { Schema, model, Document, Types } from 'mongoose'

export interface IDeparture extends Document {
  package: Types.ObjectId
  boat: Types.ObjectId
  departureDate: Date
  departureTime: string
  boardingLocation: string
  route: string
  totalCapacity: number
  confirmedSeats: number
  heldSeats: number
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'CLOSED'
  notes: string
}

const DepartureSchema = new Schema<IDeparture>({
  package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  boat: { type: Schema.Types.ObjectId, ref: 'Boat', required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  boardingLocation: { type: String, required: true },
  route: { type: String, default: '' },
  totalCapacity: { type: Number, required: true },
  confirmedSeats: { type: Number, default: 0 },
  heldSeats: { type: Number, default: 0 },
  status: { type: String, enum: ['SCHEDULED','CANCELLED','COMPLETED','CLOSED'], default: 'SCHEDULED' },
  notes: { type: String, default: '' },
}, { timestamps: true })

DepartureSchema.index({ package: 1, departureDate: 1 })
DepartureSchema.index({ status: 1, departureDate: 1 })

export default model<IDeparture>('Departure', DepartureSchema)
