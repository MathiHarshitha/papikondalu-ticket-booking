import 'dotenv/config'
import { connectDB } from '../config/db'
import Package from '../models/Package'
import Boat from '../models/Boat'
import User from '../models/User'
import argon2 from 'argon2'

const BOATS = [
  { name: 'MV Aswini', identifier: 'AG-001', capacity: 120, features: ['Flagship vessel', 'AC cabin', 'On-board restaurant', 'Safety equipment', 'Trained crew'], status: 'ACTIVE' },
  { name: 'MV Sri Godavari', identifier: 'AG-002', capacity: 150, features: ['Largest boat', 'Dining hall', 'Upper deck', 'Luxury seating', 'Entertainment'], status: 'ACTIVE' },
  { name: 'MV Srilaxmi', identifier: 'AG-003', capacity: 100, features: ['Photography deck', 'Open view areas', 'Refreshments', 'Comfort seating'], status: 'ACTIVE' },
]

const PACKAGES = [
  {
    title: 'Rajahmundry to Papikondalu One Day Tour',
    slug: 'rajahmundry-papikondalu-packages',
    subtitle: 'One Day Tour',
    category: 'day-tour',
    duration: '1 Day (Same-day return)',
    departureLocations: ['Rajahmundry'],
    description: 'Cruise from Rajahmundry through the iconic Papikondalu gorges. Stop at Perantalapalli riverside temple and return the same day with unforgettable memories.',
    itinerary: [
      { time: '6:00 AM', activity: 'Report to Rajahmundry Boat Ghat' },
      { time: '7:00 AM', activity: 'Departure — cruise begins along the Godavari' },
      { time: '10:00 AM', activity: 'Arrive at Perantalapalli, visit riverside Shiva temple' },
      { time: '12:00 PM', activity: 'Onboard lunch with scenic gorge views' },
      { time: '4:00 PM', activity: 'Return journey begins' },
      { time: '7:00 PM', activity: 'Arrive back at Rajahmundry' },
    ],
    inclusions: ['Boat ride (return)', 'Onboard lunch', 'Life jackets', 'Professional guide', 'Temple entry'],
    exclusions: ['Personal expenses', 'Camera charges', 'Travel to/from Ghat'],
    highlights: ['Perantalapalli Stop', 'Onboard Lunch', 'Life Jackets', 'Professional Guide'],
    adultPrice: 1500, childPrice: null, maxCapacity: 100,
    bestSeason: 'October – March',
    coverImage: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1756003757/rajamundry_v2aufm.jpg',
    images: ['https://res.cloudinary.com/dnz1dmnmb/image/upload/v1756003757/rajamundry_v2aufm.jpg'],
    badge: 'Most Popular',
    isPublished: true,
    cancellationPolicy: 'Free cancellation 48+ hours before. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  {
    title: 'Bhadrachalam to Papikondalu Two Day Boat Tour',
    slug: 'bhadrachalam-papikondalu-packages',
    subtitle: 'Two Day Tour',
    category: 'multi-day',
    duration: '2 Days / 1 Night',
    departureLocations: ['Bhadrachalam'],
    description: 'A two-day journey from the sacred Bhadrachalam temple through the heart of Papikondalu. Visit the temple, cruise through spectacular gorges and spend a night at a riverside camp.',
    itinerary: [
      { time: 'Day 1 — 7:00 AM', activity: 'Report at Bhadrachalam Ghat' },
      { time: '8:00 AM', activity: 'Visit Bhadrachalam Temple' },
      { time: '10:00 AM', activity: 'Depart by boat' },
      { time: 'Day 2 — 5:00 PM', activity: 'Arrive at Rajahmundry Ghat' },
    ],
    inclusions: ['Boat (2 days)', 'All meals (5 meals)', 'Overnight accommodation', 'Temple entry', 'Guide', 'Life jackets'],
    exclusions: ['Personal expenses', 'Travel to/from departure points', 'Camera fees'],
    highlights: ['Bhadrachalam Temple', 'Overnight Stay', 'All Meals', 'Professional Guide'],
    adultPrice: 2300, childPrice: null, maxCapacity: 100,
    bestSeason: 'November – February',
    coverImage: 'https://res.cloudinary.com/djmcbqzqt/image/upload/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png',
    images: ['https://res.cloudinary.com/djmcbqzqt/image/upload/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png'],
    badge: 'Best Value',
    isPublished: true,
    cancellationPolicy: 'Free cancellation 48+ hours before. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  {
    title: 'Sirivaka Night Stay & Camping',
    slug: 'sirivaka-night-stay-package',
    subtitle: 'Overnight Adventure',
    category: 'camping',
    duration: '1 Night',
    departureLocations: ['Rajahmundry'],
    description: 'Camp at the remote Sirivaka riverside clearing deep within the Papikondalu forest. Campfire under stars, nature walks at dawn, and the sound of the Godavari.',
    itinerary: [
      { time: '7:00 AM', activity: 'Depart from Rajahmundry Ghat' },
      { time: '3:00 PM', activity: 'Arrive at Sirivaka camp' },
      { time: '7:00 PM', activity: 'Campfire and dinner' },
      { time: 'Next day 8:00 AM', activity: 'Return cruise to Rajahmundry' },
    ],
    inclusions: ['Boat (return)', 'Tent accommodation', 'All meals', 'Campfire', 'Nature walk guide', 'Life jackets'],
    exclusions: ['Personal sleeping bag', 'Personal expenses', 'Travel to/from Ghat'],
    highlights: ['Riverside Camping', 'Campfire', 'Nature Walk', 'Stargazing', 'All Meals'],
    adultPrice: 5200, childPrice: null, maxCapacity: 40,
    bestSeason: 'October – March',
    coverImage: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1756003855/sirivaka_fdzsuf.avif',
    images: ['https://res.cloudinary.com/dnz1dmnmb/image/upload/v1756003855/sirivaka_fdzsuf.avif'],
    badge: 'Adventure',
    isPublished: true,
    cancellationPolicy: 'Free cancellation 48+ hours before. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  {
    title: 'Maredumilli Waterfalls Adventure',
    slug: 'maredumilli-packages',
    subtitle: 'Adventure Day Trip',
    category: 'adventure',
    duration: '1 Day',
    departureLocations: ['Rajahmundry'],
    description: 'Trek through ancient forest trails to pristine waterfalls in the East Godavari district.',
    itinerary: [{ time: '7:00 AM', activity: 'Depart from Rajahmundry' }, { time: '7:00 PM', activity: 'Return to Rajahmundry' }],
    inclusions: ['Transport', 'Guide', 'Lunch'],
    exclusions: ['Personal expenses', 'Camera fees'],
    highlights: ['Waterfall Visit', 'Forest Trails', 'Guide & Transport', 'Lunch'],
    adultPrice: null, childPrice: null, maxCapacity: 25,
    bestSeason: 'June – February',
    coverImage: 'https://res.cloudinary.com/djmcbqzqt/image/upload/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg',
    images: ['https://res.cloudinary.com/djmcbqzqt/image/upload/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg'],
    badge: 'Nature',
    isPublished: true,
    cancellationPolicy: 'Free cancellation 48+ hours before. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
]

async function seed(): Promise<void> {
  await connectDB()
  console.log('🌱 Starting seed...')

  // Clear existing data
  await Promise.all([Package.deleteMany({}), Boat.deleteMany({})])

  // Insert boats
  await Boat.insertMany(BOATS)
  console.log(`✅ Inserted ${BOATS.length} boats`)

  // Insert packages
  await Package.insertMany(PACKAGES)
  console.log(`✅ Inserted ${PACKAGES.length} packages`)

  // Create admin user if ADMIN_BOOTSTRAP_TOKEN matches
  const bootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN
  if (bootstrapToken && bootstrapToken !== 'change_this_to_a_secret_token') {
    const existing = await User.findOne({ role: 'SUPER_ADMIN' })
    if (!existing) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@papikondalutourism.com',
        phone: '+919848323488',
        passwordHash: await argon2.hash('ChangeThisPassword!123'),
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: true,
      })
      console.log('✅ SUPER_ADMIN created — email: admin@papikondalutourism.com, password: ChangeThisPassword!123')
      console.log('⚠️  CHANGE THE ADMIN PASSWORD IMMEDIATELY after first login!')
    }
  }

  console.log('🎉 Seed complete!')
  process.exit(0)
}

seed().catch(err => { console.error('Seed failed', err); process.exit(1) })
