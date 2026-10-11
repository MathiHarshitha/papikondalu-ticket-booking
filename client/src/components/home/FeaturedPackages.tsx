import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Users, ArrowRight, Star } from 'lucide-react'

const packages = [
  {
    slug: 'rajahmundry-papikondalu-packages',
    name: 'Rajahmundry to Papikondalu',
    subtitle: 'One Day Tour',
    duration: '1 Day',
    from: 'Rajahmundry',
    capacity: 100,
    price: 1500,
    highlights: ['Perantalapalli Stop', 'Onboard Lunch', 'Life Jackets', 'Guide Included'],
    season: 'Oct – Mar',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_scale,w_800,q_auto,f_auto/v1756003757/rajamundry_v2aufm.jpg',
    badge: 'Most Popular',
    badgeColor: 'bg-sunset',
  },
  {
    slug: 'bhadrachalam-papikondalu-packages',
    name: 'Bhadrachalam to Papikondalu',
    subtitle: 'Two Day Tour',
    duration: '2 Days',
    from: 'Bhadrachalam',
    capacity: 100,
    price: 2300,
    highlights: ['Temple Visit', 'Overnight Stay', 'All Meals', 'Professional Guide'],
    season: 'Nov – Feb',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_scale,w_800,q_auto,f_auto/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png',
    badge: 'Best Value',
    badgeColor: 'bg-teal',
  },
  {
    slug: 'sirivaka-night-stay-package',
    name: 'Sirivaka Night Stay',
    subtitle: '& Camping Experience',
    duration: '1 Night',
    from: 'Rajahmundry',
    capacity: 40,
    price: 5200,
    highlights: ['Riverside Camping', 'Campfire', 'Nature Walk', 'Stargazing'],
    season: 'Oct – Mar',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_scale,w_800,q_auto,f_auto/v1756003855/sirivaka_fdzsuf.avif',
    badge: 'Adventure',
    badgeColor: 'bg-forest',
  },
  {
    slug: 'maredumilli-packages',
    name: 'Maredumilli Waterfalls',
    subtitle: 'Adventure Day Trip',
    duration: '1 Day',
    from: 'Rajahmundry',
    capacity: 25,
    price: null,
    highlights: ['Forest Trails', 'Waterfall Visit', 'Guide & Transport', 'Lunch'],
    season: 'Jun – Feb',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_scale,w_800,q_auto,f_auto/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg',
    badge: 'Nature',
    badgeColor: 'bg-green-600',
  },
]

export default function FeaturedPackages() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-2">Curated Experiences</div>
            <h2 className="section-title">Featured Packages</h2>
            <p className="section-subtitle max-w-lg">
              Hand-picked boat tours through the Godavari gorges — from peaceful day cruises
              to multi-day adventures deep into Papikondalu.
            </p>
          </div>
          <Link href="/packages" className="btn-secondary flex-shrink-0 self-start md:self-auto">
            View All 9 Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => (
            <div key={pkg.slug} className="card group flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={pkg.image} alt={pkg.name}
                  fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                {pkg.badge && (
                  <span className={`absolute top-3 left-3 badge ${pkg.badgeColor} text-white`}>
                    {pkg.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
                  <MapPin className="w-3 h-3" /> {pkg.from}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-muted font-medium mb-1">{pkg.subtitle}</div>
                <h3 className="font-display font-semibold text-ink text-lg leading-snug mb-3">{pkg.name}</h3>

                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Up to {pkg.capacity}</span>
                </div>

                <ul className="space-y-1.5 mb-5">
                  {pkg.highlights.map(h => (
                    <li key={h} className="text-xs text-muted flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />{h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-3">
                    {pkg.price ? (
                      <>
                        <span className="text-xs text-muted">From</span>
                        <span className="text-xl font-bold text-river">₹{pkg.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-muted">/person</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted italic">Contact for pricing</span>
                    )}
                  </div>
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

        {/* Season note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
          <Star className="w-4 h-4 text-sunset" />
          Best travel season: <strong className="text-ink">October to March</strong> — calm river, clear skies, ideal temperatures
        </div>
      </div>
    </section>
  )
}
