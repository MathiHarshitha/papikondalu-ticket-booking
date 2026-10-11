import mongoose from 'mongoose'
import dns from 'dns'

// Node's c-ares resolver fails SRV lookups on some ISP DNS servers.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — server starting without database. Set it in server/.env to enable bookings.')
    return
  }
  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB connected')
  } catch (err: any) {
    console.error('❌ MongoDB connection failed:', err.message)
    if (process.env.NODE_ENV === 'production') throw err
    console.warn('⚠️  Continuing without database in development mode.')
  }
}
