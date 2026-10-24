'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Users, ArrowRight, Filter, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type ApiPackage = {
  _id: string; title: string; slug: string; subtitle: string; category: string
  duration: string; departureLocations: string[]; adultPrice: number | null
  maxCapacity: number; bestSeason: string; coverImage: string; images: string[]
  badge: string | null; highlights: string[]; description: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'day-tour': 'Day Tours',
  'multi-day': 'Multi-Day',
  'camping': 'Camping & Adventure',
  'temple': 'Temple Tours',
  'adventure': 'Adventure',
}

export default function PackagesList() {
  const [packages, setPackages] = useState<ApiPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [departure, setDeparture] = useState('all')

  useEffect(() => {
    fetch(`${API}/packages?limit=50`)
      .then(r => r.json())
      .then(d => setPackages(d.packages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Build filter options dynamically from loaded packages
  const categories = useMemo(() => {
    const cats = [...new Set(packages.map(p => p.category).filter(Boolean))]
    return cats
  }, [packages])

  const departures = useMemo(() => {
    const locs = new Set<string>()
    packages.forEach(p => p.departureLocations?.forEach(l => l && locs.add(l)))
    return [...locs]
  }, [packages])

  const filtered = packages.filter(p => {
    const catMatch = category === 'all' || p.category === category
    const depMatch = departure === 'all' || (p.departureLocations ?? []).includes(departure)
    return catMatch && depMatch
  })

  return (
    <section className="py-12 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Filter className="w-4 h-4 text-muted" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === 'all' ? 'bg-river text-white' : 'bg-gray-100 text-muted hover:bg-teal/10 hover:text-teal'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat ? 'bg-river text-white' : 'bg-gray-100 text-muted hover:bg-teal/10 hover:text-teal'
                }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
          {departures.length > 0 && (
            <div className="ml-auto">
              <select
                value={departure} onChange={e => setDeparture(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="all">All Departures</option>
                {departures.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-teal" />
          </div>
        ) : (
          <>
            <p className="text-muted text-sm mb-6">{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(pkg => {
                const image = pkg.coverImage || pkg.images?.[0] || ''
                const from = pkg.departureLocations?.[0] ?? ''
                const price = pkg.adultPrice

                return (
                  <div key={pkg.slug} className="card group flex flex-col">
                    <div className="relative h-52 overflow-hidden">
                      {image ? (
                        <Image src={image} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-muted" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                      {pkg.badge && (
                        <span className="absolute top-3 left-3 badge bg-sunset text-white">{pkg.badge}</span>
                      )}
                      {from && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs">
                          <MapPin className="w-3.5 h-3.5" /> {from}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-xs text-muted font-medium mb-1">{pkg.subtitle}</div>
                      <h3 className="font-display font-semibold text-ink text-lg leading-tight mb-2">{pkg.title}</h3>
                      {pkg.description && (
                        <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">{pkg.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Up to {pkg.maxCapacity}</span>
                        {pkg.bestSeason && <span className="text-teal/70">{pkg.bestSeason}</span>}
                      </div>

                      {(pkg.highlights ?? []).length > 0 && (
                        <ul className="grid grid-cols-2 gap-1.5 mb-4">
                          {pkg.highlights.slice(0, 4).map(h => (
                            <li key={h} className="text-xs text-muted flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />{h}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto">
                        {price ? (
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-xs text-muted">From</span>
                            <span className="text-xl font-bold text-river">₹{price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-muted">/person</span>
                          </div>
                        ) : (
                          <div className="text-sm text-muted italic mb-3">Contact for pricing</div>
                        )}
                        <div className="flex gap-2">
                          <Link
                            href={`/packages/${pkg.slug}`}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-river text-river text-sm font-semibold py-2.5 rounded-lg hover:bg-river/5 transition-colors"
                          >
                            View Details
                          </Link>
                          {price ? (
                            <Link
                              href={`/book?package=${pkg.slug}`}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-river text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-teal transition-colors"
                            >
                              Book Now
                            </Link>
                          ) : (
                            <Link
                              href="/contact"
                              className="flex-1 flex items-center justify-center gap-1.5 bg-teal text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-river transition-colors"
                            >
                              Enquire
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted">
                <p className="text-lg font-medium mb-2">No packages match your filter</p>
                <button onClick={() => { setCategory('all'); setDeparture('all') }} className="btn-secondary mt-3">
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
