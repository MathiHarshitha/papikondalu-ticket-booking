'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Users, ArrowRight, Filter } from 'lucide-react'

const ALL_PACKAGES = [
  {
    slug: 'rajahmundry-papikondalu-packages',
    name: 'Rajahmundry to Papikondalu',
    subtitle: 'One Day Tour',
    category: 'day-tour',
    duration: '1 Day',
    from: 'Rajahmundry',
    capacity: 100,
    price: 1500,
    season: 'Oct – Mar',
    badge: 'Most Popular',
    badgeColor: 'bg-sunset text-white',
    highlights: ['Perantalapalli Stop', 'Onboard Lunch', 'Life Jackets', 'Professional Guide'],
    description: 'Board from Rajahmundry and cruise through the iconic Papikondalu gorges. Stop at Perantalapalli riverside temple and return the same day.',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1756003757/rajamundry_v2aufm.jpg',
  },
  {
    slug: 'bhadrachalam-papikondalu-packages',
    name: 'Bhadrachalam to Papikondalu',
    subtitle: 'Two Day Boat Tour',
    category: 'multi-day',
    duration: '2 Days',
    from: 'Bhadrachalam',
    capacity: 100,
    price: 2300,
    season: 'Nov – Feb',
    badge: 'Best Value',
    badgeColor: 'bg-teal text-white',
    highlights: ['Bhadrachalam Temple', 'Overnight Stay', 'All Meals', 'Professional Guide'],
    description: 'Start from the sacred Bhadrachalam temple and cruise two days through the heart of Papikondalu, staying overnight at a riverside camp.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png',
  },
  {
    slug: 'sirivaka-night-stay-package',
    name: 'Sirivaka Night Stay & Camping',
    subtitle: 'Overnight Adventure',
    category: 'camping',
    duration: '1 Night',
    from: 'Rajahmundry',
    capacity: 40,
    price: 5200,
    season: 'Oct – Mar',
    badge: 'Adventure',
    badgeColor: 'bg-forest text-white',
    highlights: ['Riverside Camping', 'Campfire', 'Nature Walk', 'Stargazing', 'All Meals'],
    description: 'Sleep under the stars at the remote Sirivaka riverside camp deep within the Papikondalu forest. A rare wilderness experience.',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1756003855/sirivaka_fdzsuf.avif',
  },
  {
    slug: 'papikondalu-packages',
    name: 'Papikondalu River Cruise',
    subtitle: 'From Bhadrachalam',
    category: 'day-tour',
    duration: 'Full Day',
    from: 'Bhadrachalam',
    capacity: 50,
    price: null,
    season: 'Oct – Mar',
    badge: null,
    badgeColor: '',
    highlights: ['Temple Entry', 'Gorge Cruise', 'Guide Included', 'Scenic Route'],
    description: 'Begin at Bhadrachalam temple and cruise through the majestic Papikondalu gorges — an unforgettable full-day river journey.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
  },
  {
    slug: 'maredumilli-packages',
    name: 'Maredumilli Waterfalls Adventure',
    subtitle: 'Day Trip',
    category: 'day-tour',
    duration: '1 Day',
    from: 'Rajahmundry',
    capacity: 25,
    price: null,
    season: 'Jun – Feb',
    badge: 'Nature',
    badgeColor: 'bg-green-600 text-white',
    highlights: ['Waterfall Visit', 'Forest Trails', 'Guide & Transport', 'Lunch Included'],
    description: 'Trek through ancient forest trails to pristine waterfalls in the East Godavari district. Ideal for nature lovers and photography enthusiasts.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg',
  },
  {
    slug: 'parnasala-packages',
    name: 'Parnasala Heritage Temple Tour',
    subtitle: 'Cultural Experience',
    category: 'day-tour',
    duration: 'Full Day',
    from: 'Bhadrachalam',
    capacity: 50,
    price: null,
    season: 'Oct – Mar',
    badge: 'Heritage',
    badgeColor: 'bg-amber-600 text-white',
    highlights: ['Ramayana Heritage Site', 'Transport & Guide', 'Temple Visit', 'Cultural Insights'],
    description: 'Visit the sacred Parnasala — a Ramayana heritage site near Bhadrachalam where Sita is believed to have stayed during the forest exile.',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755979312/dev_parnasala_pfvan7.jpg',
  },
  {
    slug: 'rampachodavaram-waterfalls-tour-package',
    name: 'Rampachodavaram Tribal Culture Tour',
    subtitle: 'Cultural Immersion',
    category: 'multi-day',
    duration: 'Full Day',
    from: 'Rajahmundry',
    capacity: 75,
    price: null,
    season: 'Nov – Feb',
    badge: 'Cultural',
    badgeColor: 'bg-purple-600 text-white',
    highlights: ['Local Guides', 'Godavari Cruise', 'Temple Visits', 'Stay & Meals'],
    description: 'Immerse in the tribal culture of the East Godavari region, visiting local villages and temples with expert local guides.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755980907/Bhadrachalam_Temple_yg8met.jpg',
  },
  {
    slug: 'gudisa-packages',
    name: 'Gudisa Hills Trekking Tour',
    subtitle: 'Adventure Trek',
    category: 'camping',
    duration: 'Full Day',
    from: 'Rajahmundry',
    capacity: 20,
    price: null,
    season: 'Sep – Mar',
    badge: 'Trekking',
    badgeColor: 'bg-orange-600 text-white',
    highlights: ['Eastern Ghats Views', 'Guide & Transport', 'Refreshments'],
    description: 'Trek to the Gudisa hill station with panoramic Eastern Ghats views. Perfect for adventure seekers and trekking enthusiasts.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755981754/Camping_in_Mountains_ytwmvi.avif',
  },
  {
    slug: 'perantalapalli-packages',
    name: 'Perantalapalli Eco Tour',
    subtitle: 'River & Temple',
    category: 'day-tour',
    duration: 'Full Day',
    from: 'Rajahmundry',
    capacity: 100,
    price: null,
    season: 'Oct – Mar',
    badge: 'Eco Tour',
    badgeColor: 'bg-emerald-600 text-white',
    highlights: ['Riverside Shiva Temple', 'Boat Tour', 'Forest Trail', 'Village Visit'],
    description: 'Cruise to Perantalapalli for a riverside Shiva temple visit and forest trail exploration in one of the Godavari\'s most scenic stretches.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
  },
]

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Day Tours', value: 'day-tour' },
  { label: 'Multi-Day', value: 'multi-day' },
  { label: 'Camping & Adventure', value: 'camping' },
]

const DEPARTURES = [
  { label: 'All Departures', value: 'all' },
  { label: 'Rajahmundry', value: 'Rajahmundry' },
  { label: 'Bhadrachalam', value: 'Bhadrachalam' },
]

export default function PackagesList() {
  const [category, setCategory] = useState('all')
  const [departure, setDeparture] = useState('all')

  const filtered = ALL_PACKAGES.filter(p => {
    const catMatch = category === 'all' || p.category === category
    const depMatch = departure === 'all' || p.from === departure
    return catMatch && depMatch
  })

  return (
    <section className="py-12 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Filter className="w-4 h-4 text-muted" />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === f.value ? 'bg-river text-white' : 'bg-gray-100 text-muted hover:bg-teal/10 hover:text-teal'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select
              value={departure} onChange={e => setDeparture(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal"
            >
              {DEPARTURES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>

        <p className="text-muted text-sm mb-6">{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(pkg => (
            <div key={pkg.slug} className="card group flex flex-col">
              <div className="relative h-52 overflow-hidden">
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                {pkg.badge && (
                  <span className={`absolute top-3 left-3 badge ${pkg.badgeColor}`}>{pkg.badge}</span>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs">
                  <MapPin className="w-3.5 h-3.5" /> {pkg.from}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-muted font-medium mb-1">{pkg.subtitle}</div>
                <h3 className="font-display font-semibold text-ink text-lg leading-tight mb-2">{pkg.name}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">{pkg.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Up to {pkg.capacity}</span>
                  <span className="text-teal/70">{pkg.season}</span>
                </div>

                <ul className="grid grid-cols-2 gap-1.5 mb-4">
                  {pkg.highlights.slice(0, 4).map(h => (
                    <li key={h} className="text-xs text-muted flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />{h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {pkg.price ? (
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-xs text-muted">From</span>
                      <span className="text-xl font-bold text-river">₹{pkg.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-muted">/person</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted italic mb-3">Contact for pricing</div>
                  )}
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-river text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-teal transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="text-lg font-medium mb-2">No packages match your filter</p>
            <button onClick={() => { setCategory('all'); setDeparture('all') }} className="btn-secondary mt-3">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
