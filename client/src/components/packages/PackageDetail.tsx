'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, Users, CheckCircle, XCircle, ArrowRight, Phone, MessageCircle, AlertCircle } from 'lucide-react'

interface PackageData {
  name: string; subtitle: string; duration: string; from: string; capacity: number;
  price: number | null; season: string; description: string; image: string;
  highlights: string[]; itinerary: { time: string; activity: string }[];
  inclusions: string[]; exclusions: string[]; policy: string;
}

export default function PackageDetail({ slug, pkg }: { slug: string; pkg: PackageData | null }) {
  if (!pkg) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-muted" />
        <h1 className="font-display text-2xl font-bold text-ink">Package Not Found</h1>
        <p className="text-muted">This package page is currently being updated. Please contact us for details.</p>
        <div className="flex gap-3 mt-2">
          <Link href="/packages" className="btn-secondary">All Packages</Link>
          <a href="https://wa.me/919848323488" className="btn-primary">WhatsApp Us</a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="relative h-72 sm:h-96">
        <Image src={pkg.image} alt={pkg.name} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-7xl mx-auto">
          <div className="text-white/70 text-sm mb-1">{pkg.subtitle}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">{pkg.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />Departs: {pkg.from}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />Up to {pkg.capacity} passengers</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display font-semibold text-xl text-ink mb-3">About This Tour</h2>
              <p className="text-muted leading-relaxed">{pkg.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {pkg.highlights.map(h => (
                  <span key={h} className="badge bg-teal/10 text-teal">{h}</span>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display font-semibold text-xl text-ink mb-5">Itinerary</h2>
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100" />
                <ol className="space-y-5">
                  {pkg.itinerary.map((item, i) => (
                    <li key={i} className="flex gap-4 relative">
                      <div className="w-7 h-7 rounded-full bg-river text-white text-xs flex items-center justify-center flex-shrink-0 z-10 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-xs text-teal font-semibold">{item.time}</div>
                        <div className="text-sm text-ink">{item.activity}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-ink mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Included
                </h3>
                <ul className="space-y-2">
                  {pkg.inclusions.map(i => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-ink mb-3 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-400" /> Not Included
                </h3>
                <ul className="space-y-2">
                  {pkg.exclusions.map(e => (
                    <li key={e} className="text-sm text-muted flex items-start gap-2">
                      <XCircle className="w-3.5 h-3.5 text-red-300 flex-shrink-0 mt-0.5" />{e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Policy */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Cancellation Policy
              </h3>
              <p className="text-amber-700 text-sm">{pkg.policy}</p>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="text-center mb-5">
                  {pkg.price ? (
                    <>
                      <div className="text-muted text-sm">Starting from</div>
                      <div className="font-display text-4xl font-bold text-river">₹{pkg.price.toLocaleString('en-IN')}</div>
                      <div className="text-muted text-xs">per person</div>
                    </>
                  ) : (
                    <div className="font-display text-xl font-bold text-ink">Contact for Price</div>
                  )}
                </div>

                <div className="space-y-2.5 mb-5 text-sm">
                  {[
                    ['Duration', pkg.duration],
                    ['Departs From', pkg.from],
                    ['Capacity', `Up to ${pkg.capacity} passengers`],
                    ['Best Season', pkg.season],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted">{label}</span>
                      <span className="text-ink font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/book?package=${slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-sunset text-white font-semibold py-3 rounded-xl hover:bg-orange-500 transition-colors text-sm mb-3"
                >
                  Book This Package <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-muted">Login required to complete booking</p>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="text-sm font-semibold text-ink mb-3">Have Questions?</div>
                <div className="space-y-2">
                  <a href="https://wa.me/919848323488" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-100 transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Us
                  </a>
                  <a href="tel:+919848323488"
                    className="flex items-center gap-2 bg-river/5 text-river text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-river/10 transition-colors">
                    <Phone className="w-4 h-4" /> +91 98483 23488
                  </a>
                </div>
                <p className="text-xs text-muted mt-3">Daily 6:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
