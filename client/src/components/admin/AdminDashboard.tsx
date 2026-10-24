'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Ship, BookOpen, Users, RefreshCw,
  FileText, QrCode, Settings, TrendingUp, Loader2
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Metrics = {
  totalBookings: number
  todayBookings: number
  monthRevenue: number
  pendingRefunds: number
  upcomingDepartures: number
  cancellations: number
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Package, label: 'Packages', href: '/admin/packages' },
  { icon: Ship, label: 'Boats & Departures', href: '/admin/departures' },
  { icon: BookOpen, label: 'Bookings', href: '/admin/bookings' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: RefreshCw, label: 'Refunds', href: '/admin/refunds' },
  { icon: QrCode, label: 'Check-In', href: '/admin/checkin' },
  { icon: TrendingUp, label: 'Reports', href: '/admin/reports' },
  { icon: FileText, label: 'Content', href: '/admin/content' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminDashboard() {
  const pathname = usePathname()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loadingMetrics, setLoadingMetrics] = useState(true)

  useEffect(() => {
    fetch(`${API}/admin/metrics`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setMetrics(d))
      .catch(() => {})
      .finally(() => setLoadingMetrics(false))
  }, [])

  const metricCards = metrics ? [
    { label: 'Total Bookings', value: metrics.totalBookings.toLocaleString(), sub: 'All time', color: 'text-river', bg: 'bg-river/10' },
    { label: "Today's Bookings", value: metrics.todayBookings.toLocaleString(), sub: 'Last 24h', color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Gross Collections', value: `₹${(metrics.monthRevenue ?? 0).toLocaleString('en-IN')}`, sub: 'This month', color: 'text-sunset', bg: 'bg-sunset/10' },
    { label: 'Pending Refunds', value: metrics.pendingRefunds.toLocaleString(), sub: 'Require action', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Upcoming Departures', value: metrics.upcomingDepartures.toLocaleString(), sub: 'Next 7 days', color: 'text-forest', bg: 'bg-forest/10' },
    { label: 'Cancellations Today', value: metrics.cancellations.toLocaleString(), sub: 'Today', color: 'text-red-600', bg: 'bg-red-50' },
  ] : Array(6).fill(null)

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 shadow-sm hidden lg:block fixed left-0 top-20 bottom-0 overflow-y-auto">
        <div className="p-4">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-3">Menu</div>
          <nav className="space-y-1">
            {navItems.map(({ icon: Icon, label, href }) => {
              const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-river text-white' : 'text-ink/70 hover:bg-gray-100 hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-60 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">Admin Dashboard</h1>
              <p className="text-muted text-sm">Papikondalu Tourism Management</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/bookings" className="btn-secondary text-sm py-2">View Bookings</Link>
              <Link href="/admin/packages" className="btn-primary text-sm py-2">Add Package</Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {metricCards.map((m, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                {loadingMetrics || !m ? (
                  <div className="flex items-center justify-center h-16">
                    <Loader2 className="w-5 h-5 animate-spin text-muted" />
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-muted font-medium mb-1">{m.label}</div>
                    <div className={`font-display text-2xl font-bold ${m.color}`}>{m.value}</div>
                    <div className="text-xs text-muted mt-1">{m.sub}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Manage Packages', href: '/admin/packages', icon: Package, desc: 'Create, edit, publish tours' },
              { label: 'Boats & Departures', href: '/admin/departures', icon: Ship, desc: 'Schedule and manage departures' },
              { label: 'View Bookings', href: '/admin/bookings', icon: BookOpen, desc: 'Search and manage bookings' },
              { label: 'QR Check-In', href: '/admin/checkin', icon: QrCode, desc: 'Scan tickets at boarding' },
            ].map(({ label, href, icon: Icon, desc }) => (
              <Link key={href} href={href}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <Icon className="w-8 h-8 text-teal mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-ink text-sm">{label}</div>
                <div className="text-muted text-xs mt-1">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
