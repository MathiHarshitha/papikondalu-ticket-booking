import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Users, ArrowRight, Star } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type ApiPackage = {
  _id: string; title: string; slug: string; subtitle: string
  duration: string; departureLocations: string[]; adultPrice: number | null
  maxCapacity: number; bestSeason: string; coverImage: string; images: string[]
  badge: string | null; highlights: string[]
}

export default async function FeaturedPackages() {
  let packages: ApiPackage[] = []
  try {
    const res = await fetch(`${API}/packages?limit=4`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      packages = data.packages ?? []
    }
  } catch {}

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
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {packages.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p>No packages available at the moment. Please check back soon.</p>
            <Link href="/contact" className="btn-primary mt-4">Contact Us</Link>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map(pkg => {
              const image = pkg.coverImage || pkg.images?.[0] || ''
              const from = pkg.departureLocations?.[0] ?? ''
              const price = pkg.adultPrice

              return (
                <div key={pkg.slug} className="card group flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {image ? (
                      <Image
                        src={image} alt={pkg.title}
                        fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                    {pkg.badge && (
                      <span className="absolute top-3 left-3 badge bg-sunset text-white">
                        {pkg.badge}
                      </span>
                    )}
                    {from && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
                        <MapPin className="w-3 h-3" /> {from}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-muted font-medium mb-1">{pkg.subtitle}</div>
                    <h3 className="font-display font-semibold text-ink text-lg leading-snug mb-3">{pkg.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-muted mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Up to {pkg.maxCapacity}</span>
                    </div>

                    {(pkg.highlights ?? []).length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {pkg.highlights.slice(0, 4).map(h => (
                          <li key={h} className="text-xs text-muted flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />{h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1 mb-3">
                        {price ? (
                          <>
                            <span className="text-xs text-muted">From</span>
                            <span className="text-xl font-bold text-river">₹{price.toLocaleString('en-IN')}</span>
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
              )
            })}
          </div>
        )}

        {/* Season note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
          <Star className="w-4 h-4 text-sunset" />
          Best travel season: <strong className="text-ink">October to March</strong> — calm river, clear skies, ideal temperatures
        </div>
      </div>
    </section>
  )
}
