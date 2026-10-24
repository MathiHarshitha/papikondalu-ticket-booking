import 'dotenv/config'
import { connectDB } from '../config/db'
import User from '../models/User'
import argon2 from 'argon2'

async function main(): Promise<void> {
  await connectDB()

  const email = 'mrposibabu@gmail.com'
  const password = 'Satya#116!'

  const existing = await User.findOne({ email })
  if (existing) {
    // Update role and reset password in case it was created with wrong role/hash
    existing.role = 'SUPER_ADMIN'
    existing.isActive = true
    existing.emailVerified = true
    existing.passwordHash = await argon2.hash(password)
    await existing.save()
    console.log(`✅ Admin updated — email: ${email}`)
  } else {
    await User.create({
      name: 'Posibabu Yalla',
      email,
      phone: '+919848323488',
      passwordHash: await argon2.hash(password),
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
    })
    console.log(`✅ Admin created — email: ${email}`)
  }

  console.log(`   Password: ${password}`)
  console.log(`   Role: SUPER_ADMIN`)
  process.exit(0)
}

main().catch(err => { console.error('Failed:', err); process.exit(1) })
