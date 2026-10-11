import { Users, Star, Ship, Clock } from 'lucide-react'

const stats = [
  { icon: Users, value: '7 Lakh+', label: 'Happy Travellers', color: 'text-sunset' },
  { icon: Clock, value: '20+ Years', label: 'Trusted Since 2004', color: 'text-teal' },
  { icon: Ship, value: '3 Boats', label: 'Modern Fleet', color: 'text-sunset' },
  { icon: Star, value: '9 Tours', label: 'Curated Packages', color: 'text-teal' },
]

export default function StatsBar() {
  return (
    <section className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="flex items-center gap-3 py-6 px-6">
              <div className={`p-2.5 rounded-xl bg-gray-50 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xl font-bold font-display ${color}`}>{value}</div>
                <div className="text-muted text-xs font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
