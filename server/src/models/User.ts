import { Schema, model, Document } from 'mongoose'

export type UserRole = 'CUSTOMER' | 'CHECKIN_STAFF' | 'BOOKING_MANAGER' | 'CONTENT_MANAGER' | 'ADMIN' | 'SUPER_ADMIN'

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  passwordHash: string
  role: UserRole
  isActive: boolean
  emailVerified: boolean
  emailVerifyToken?: string
  emailVerifyExpires?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER','CHECKIN_STAFF','BOOKING_MANAGER','CONTENT_MANAGER','ADMIN','SUPER_ADMIN'], default: 'CUSTOMER' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String, select: false },
  emailVerifyExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
}, { timestamps: true })

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ role: 1 })

export default model<IUser>('User', UserSchema)
