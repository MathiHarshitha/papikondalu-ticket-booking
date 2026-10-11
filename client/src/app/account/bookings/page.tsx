'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Loader2, BookOpen, Calendar, Users, MapPin, XCircle, Download } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Booking = {
  _id: string; bookingRef: string; packageSnapshot: { name: string }
  departureDate: string; totalPassengers: number; departurePoint: string
  status: string; totalFare: number; holdExpiresAt?: string
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  PAYMENT_PENDING: 'bg-orange-100 text-orange-700',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/bookings/my`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setBookings(d.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function cancelBooking(id: string) {
    if (!confirm('Cancel this booking? Refund will be processed per our cancellation policy.')) return
    setCancelling(id)
    try {
      const r = await fetch(`${API}/bookings/${id}/cancel`, { method: 'POST', credentials: 'include' })
      if (r.ok) setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'CANCELLED' } : bk))
      else alert((await r.json()).message ?? 'Cancellation failed')
    } catch { alert('Cancellation failed. Please try again.') }
    finally { setCancelling(null) }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Account
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mb-8">My Bookings</h1>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : bookings.length === 0 ? (
            <div className="card p-10 text-center">
              <BookOpen className="w-14 h-14 text-muted/30 mx-auto mb-4" />
              <h2 className="font-display font-bold text-ink text-xl mb-2">No bookings yet</h2>
              <p className="text-muted mb-6">Start your Papikondalu adventure by booking a tour.</p>
              <Link href="/packages" className="btn-primary">Browse Packages</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(bk => (
                <div key={bk._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="font-display font-semibold text-ink mb-0.5">{bk.packageSnapshot?.name}</div>
                      <div className="font-mono text-sm text-muted">{bk.bookingRef}</div>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${STATUS_STYLE[bk.status] ?? 'bg-gray-100 text-gray-700'}`}>{bk.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(bk.departureDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{bk.totalPassengers} passenger{bk.totalPassengers !== 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{bk.departurePoint}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="font-bold text-teal">₹{bk.totalFare?.toLocaleString('en-IN')}</div>
                    <div className="flex gap-2">
                      {bk.status === 'CONFIRMED' && (
                        <>
                          <Link href="/account/tickets" className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                            <Download className="w-3 h-3" /> Ticket
                          </Link>
                          <button onClick={() => cancelBooking(bk._id)} disabled={cancelling === bk._id}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                            {cancelling === bk._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />} Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
