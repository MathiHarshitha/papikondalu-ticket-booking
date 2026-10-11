import { Schema, model, Document } from 'mongoose'

export interface IBoat extends Document {
  name: string
  identifier: string
  capacity: number
  features: string[]
  status: 'ACTIVE' | 'MAINTENANCE' | 'RETIRED'
  notes: string
}

const BoatSchema = new Schema<IBoat>({
  name: { type: String, required: true },
  identifier: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  features: [{ type: String }],
  status: { type: String, enum: ['ACTIVE','MAINTENANCE','RETIRED'], default: 'ACTIVE' },
  notes: { type: String, default: '' },
}, { timestamps: true })

export default model<IBoat>('Boat', BoatSchema)
