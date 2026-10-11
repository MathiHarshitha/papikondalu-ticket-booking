import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Users, Star, Anchor, MapPin, Phone, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Aswini Godavari Travel — trusted Papikondalu boat tour operator since 2004, serving 7 lakh+ travellers with safe and authentic Godavari river cruises.',
}

const milestones = [
  { year: '2004', event: 'Founded as a small family boat tour business in Rajahmundry' },
  { year: '2008', event: 'Expanded fleet with the addition of MV Sri Godavari' },
  { year: '2012', event: 'Launched Bhadrachalam two-day packages; 1 lakh travellers served' },
  { year: '2016', event: 'Introduced Sirivaka overnight camping experience' },
  { year: '2020', event: 'Reached 5 lakh travellers milestone' },
  { year: '2024', event: '20+ years, 7 lakh+ travellers, 3 boats, 9 curated packages' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory">
        {/* Hero */}
        <div className="relative bg-river py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
            <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-3">Our Story</div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Two Decades on the Godavari</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              A family business built on safety, local knowledge and genuine love for one of India's most magnificent rivers.
            </p>
          </div>
        </div>

        {/* Story */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-2">Who We Are</div>
                <h2 className="font-display text-3xl font-bold text-ink mb-5">
                  Aswini Godavari Travel & Tourism
                </h2>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    Established in 2004, Aswini Godavari Travel & Tourism began as a small family venture
                    operating boat tours along the Godavari from Rajahmundry. Over two decades, we have
                    grown into one of Andhra Pradesh's most trusted tourism operators — without ever losing
                    the personal touch that defines us.
                  </p>
                  <p>
                    Our team lives and works along the Godavari. We know every gorge, every temple and
                    every tribal village that lines the 200-kilometre stretch between Rajahmundry and
                    Bhadrachalam. That local knowledge is what makes every journey exceptional.
                  </p>
                  <p>
                    Safety, reliability and genuine hospitality are the values we were built on — and
                    the values that have brought 7 lakh+ travellers back to the Godavari with us.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-6">
                  {[
                    { value: '7L+', label: 'Travellers', color: 'text-river' },
                    { value: '20+', label: 'Years', color: 'text-teal' },
                    { value: '3', label: 'Boats', color: 'text-sunset' },
                    { value: '9', label: 'Packages', color: 'text-forest' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-muted mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-80 lg:h-auto lg:min-h-96">
                <Image
                  src="https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg"
                  alt="Papikondalu Boat Tour" fill className="object-cover" unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">What We Stand For</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Safety Above All', desc: 'Life jackets for every passenger, trained crew, and regular vessel maintenance.', color: 'bg-river/10 text-river' },
                { icon: Users, title: 'Local Knowledge', desc: 'Our guides grew up here — their stories bring the Godavari alive for every traveller.', color: 'bg-teal/10 text-teal' },
                { icon: Anchor, title: 'Own Fleet', desc: 'Three owned, well-maintained boats — no middlemen, full control over your experience.', color: 'bg-sunset/10 text-sunset' },
                { icon: Star, title: 'Genuine Care', desc: 'Phone support 6 AM–10 PM daily. We stay with you before, during and after your trip.', color: 'bg-forest/10 text-forest' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="text-center p-6 rounded-2xl bg-ivory border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-ink mb-2">{title}</h3>
                  <p className="text-muted text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fleet */}
        <section className="py-16 bg-ivory">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="section-title">Our Fleet</h2>
              <p className="section-subtitle mx-auto max-w-lg">Three covered boats, each equipped with life jackets and staffed by experienced Godavari crew.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'MV Aswini', cap: 120, features: ['Flagship vessel', 'AC cabin', 'On-board restaurant', 'Safety equipment'] },
                { name: 'MV Sri Godavari', cap: 150, features: ['Largest boat', 'Dining hall', 'Upper deck', 'Luxury seating'] },
                { name: 'MV Srilaxmi', cap: 100, features: ['Photography deck', 'Open view areas', 'Refreshments', 'Comfort seating'] },
              ].map(b => (
                <div key={b.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <Anchor className="w-8 h-8 text-river mb-3" />
                  <h3 className="font-display font-bold text-xl text-ink">{b.name}</h3>
                  <p className="text-muted text-sm mb-3">Capacity: {b.cap} passengers</p>
                  <ul className="space-y-1.5">
                    {b.features.map(f => (
                      <li key={f} className="text-sm text-muted flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="section-title">Our Journey</h2>
            </div>
            <div className="relative">
              <div className="absolute left-16 sm:left-24 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 sm:w-20 text-right flex-shrink-0">
                      <span className="font-display font-bold text-river text-sm">{m.year}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[1.15rem] top-1 w-3 h-3 rounded-full border-2 border-teal bg-white" />
                    </div>
                    <div className="pb-4 pl-2">
                      <p className="text-muted text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 bg-river text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold mb-3">Ready to Experience the Godavari?</h2>
            <p className="text-white/70 mb-6">Call us or browse our packages — we&apos;re available 6 AM to 10 PM every day.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/packages" className="btn-primary"><ArrowRight className="w-4 h-4" /> Browse Packages</Link>
              <a href="tel:+919848323488" className="btn-outline-white"><Phone className="w-4 h-4" /> +91 98483 23488</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
