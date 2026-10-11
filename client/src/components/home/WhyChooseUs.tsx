import { Shield, Users, MapPin, Star, Anchor, Clock } from 'lucide-react'

const reasons = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Every passenger receives a life jacket. Our crew is trained in first aid and river safety protocols.',
    color: 'bg-river/10 text-river',
  },
  {
    icon: Users,
    title: 'Local Expertise',
    description: 'Our guides live and breathe this region. They know every gorge, village and story along the Godavari.',
    color: 'bg-teal/10 text-teal',
  },
  {
    icon: Anchor,
    title: 'Modern Fleet',
    description: 'Three well-maintained covered boats — Aswini, Sri Godavari and Srilaxmi — with dining and open decks.',
    color: 'bg-sunset/10 text-sunset',
  },
  {
    icon: Star,
    title: '20+ Years of Trust',
    description: 'Operating since 2004, serving 7 lakh+ travellers. One of Andhra Pradesh\'s most trusted operators.',
    color: 'bg-forest/10 text-forest',
  },
  {
    icon: Clock,
    title: 'Flexible Packages',
    description: 'One-day cruises, two-day tours, night camping — we offer 9 curated packages for every traveller.',
    color: 'bg-river/10 text-river',
  },
  {
    icon: MapPin,
    title: 'Two Departure Points',
    description: 'Board from Rajahmundry or Bhadrachalam — whichever suits your journey best.',
    color: 'bg-teal/10 text-teal',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-2">Why Travel With Us</div>
            <h2 className="section-title mb-4">
              Safety, Experience &<br />
              <span className="text-gradient">Genuine Local Knowledge</span>
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              We&apos;re not a travel agency — we&apos;re a family business that has called the Godavari home
              for over two decades. Every detail of your journey is handled by people who love this river.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-river">7L+</div>
                <div className="text-xs text-muted">Travellers</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-teal">20+</div>
                <div className="text-xs text-muted">Years</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-sunset">9</div>
                <div className="text-xs text-muted">Packages</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-forest">3</div>
                <div className="text-xs text-muted">Boats</div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
