'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Users, ArrowRight, Play, Phone } from 'lucide-react'
import { useState } from 'react'

const HERO_IMAGE = 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1920,h_1080,q_auto,f_webp/v1755976642/1b45e060-bfee-4be1-85f4-51c2c6430c70_itqkts.jpg'

export default function HeroSection() {
  const [departure, setDeparture] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState('2')

  return (
    <section className="relative min-h-screen flex flex-col justify-end">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Papikondalu Godavari River Cruise"
          fill priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Floating badge */}
      <div className="absolute top-28 right-6 lg:right-12 glass rounded-2xl p-4 text-white text-center hidden md:block animate-float">
        <div className="text-3xl font-bold font-display">20+</div>
        <div className="text-xs text-white/70 mt-0.5">Years of Trust</div>
      </div>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-sunset/20 border border-sunset/40 text-sunset text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5" />
            Rajahmundry &amp; Bhadrachalam Departures
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
            Sail Through the<br />
            <span className="text-sunset italic">Papikondalu</span> Hills
          </h1>

          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
            Cruise the magnificent Godavari river through ancient gorges, tribal villages and
            sacred temples. Trusted by 7 lakh+ travellers since 2004.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/packages" className="btn-primary text-base px-7 py-3.5">
              Explore Packages <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/919848323488" target="_blank" rel="noopener noreferrer"
              className="btn-outline-white text-base px-7 py-3.5">
              <Phone className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>

          {/* Quick search */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 max-w-2xl">
            <div className="text-white/80 text-xs font-medium uppercase tracking-wider mb-3">Quick Search</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-white/60 text-xs block mb-1">Departure Point</label>
                <select
                  value={departure} onChange={e => setDeparture(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sunset"
                >
                  <option value="" className="text-ink">Select departure</option>
                  <option value="rajahmundry" className="text-ink">Rajahmundry</option>
                  <option value="bhadrachalam" className="text-ink">Bhadrachalam</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Travel Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="date" value={date} onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sunset"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <select
                    value={guests} onChange={e => setGuests(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sunset"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n} className="text-ink">{n} {n===1?'Guest':'Guests'}</option>
                    ))}
                    <option value="10+" className="text-ink">10+ (Group)</option>
                  </select>
                </div>
              </div>
            </div>
            <Link
              href={`/packages${departure ? `?from=${departure}` : ''}${date ? `&date=${date}` : ''}`}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-sunset hover:bg-orange-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Search Packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-8 bg-white/40" />
        <div className="text-white/40 text-xs">Scroll</div>
      </div>
    </section>
  )
}
