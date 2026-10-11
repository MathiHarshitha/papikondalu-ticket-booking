import { Anchor, Users, Utensils, Camera } from 'lucide-react'

const boats = [
  {
    name: 'MV Aswini',
    capacity: 120,
    features: ['AC Cabin', 'On-board Restaurant', 'Safety Equipment', 'Trained Crew'],
    icon: Anchor,
    color: 'border-river bg-river/5',
    badge: 'Flagship',
    badgeColor: 'bg-river text-white',
  },
  {
    name: 'MV Sri Godavari',
    capacity: 150,
    features: ['Dining Hall', 'Upper Deck', 'Luxury Seating', 'Entertainment'],
    icon: Utensils,
    color: 'border-teal bg-teal/5',
    badge: 'Largest',
    badgeColor: 'bg-teal text-white',
  },
  {
    name: 'MV Srilaxmi',
    capacity: 100,
    features: ['Photography Deck', 'Open View Areas', 'Refreshments', 'Comfort Seating'],
    icon: Camera,
    color: 'border-sunset bg-sunset/5',
    badge: 'Photographer\'s Choice',
    badgeColor: 'bg-sunset text-white',
  },
]

export default function FleetSection() {
  return (
    <section className="py-20 bg-river text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Our Fleet</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Three Dedicated Boats
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Every vessel is fully covered, equipped with life jackets for all passengers,
            and staffed by an experienced Godavari crew.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {boats.map(({ name, capacity, features, icon: Icon, color, badge, badgeColor }) => (
            <div key={name} className={`border-2 rounded-2xl p-6 ${color} relative`}>
              <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
                {badge}
              </span>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-1">{name}</h3>
              <div className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
                <Users className="w-4 h-4" />
                Up to {capacity} passengers
              </div>
              <ul className="space-y-2">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-sunset flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-white/50 text-sm mt-8">
          Life jackets provided for every passenger · Safety equipment on all vessels · Experienced crew
        </p>
      </div>
    </section>
  )
}
