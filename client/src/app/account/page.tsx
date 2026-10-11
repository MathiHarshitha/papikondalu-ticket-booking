import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { User, BookOpen, Ticket, XCircle, RefreshCw, Settings, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'My Account' }

const dashboardLinks = [
  { icon: BookOpen, label: 'My Bookings', desc: 'View all past and upcoming trips', href: '/account/bookings', color: 'text-river bg-river/10' },
  { icon: Ticket, label: 'My Tickets', desc: 'Download and view digital tickets', href: '/account/tickets', color: 'text-teal bg-teal/10' },
  { icon: XCircle, label: 'Cancellations', desc: 'Manage cancellation requests', href: '/account/cancellations', color: 'text-amber-600 bg-amber-50' },
  { icon: RefreshCw, label: 'Refunds', desc: 'Track refund status', href: '/account/refunds', color: 'text-green-600 bg-green-50' },
  { icon: User, label: 'Profile', desc: 'Update your personal details', href: '/account/profile', color: 'text-purple-600 bg-purple-50' },
  { icon: Settings, label: 'Settings', desc: 'Account and notification settings', href: '/account/settings', color: 'text-muted bg-gray-100' },
]

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="bg-river text-white rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                U
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">Welcome back!</h1>
                <p className="text-white/70 text-sm">Manage your bookings, tickets and account</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardLinks.map(({ icon: Icon, label, desc, href, color }) => (
              <Link key={href} href={href}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink text-sm group-hover:text-teal transition-colors">{label}</div>
                  <div className="text-muted text-xs mt-0.5">{desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted/40 group-hover:text-teal transition-colors flex-shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <h2 className="font-display font-semibold text-ink text-lg mb-2">Ready for your next adventure?</h2>
            <p className="text-muted text-sm mb-4">Browse our 9 curated Godavari boat tours and book your next trip.</p>
            <Link href="/packages" className="btn-primary">Browse Packages <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
