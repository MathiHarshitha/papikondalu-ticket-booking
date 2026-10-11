'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Loader2, XCircle, Calendar, AlertCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Cancellation = {
  _id: string; bookingRef: string; packageName: string; departureDate: string
  cancelledAt: string; status: string; refundAmount: number; refundStatus: string
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function CancellationsPage() {
  const [items, setItems] = useState<Cancellation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/bookings/my?status=CANCELLED`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setItems(d.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Account
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mb-8">Cancellations</h1>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>Cancellations made more than 48 hours before departure receive a full refund. See our <Link href="/cancellation-policy" className="underline font-medium">Cancellation Policy</Link> for full details.</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : items.length === 0 ? (
            <div className="card p-10 text-center">
              <XCircle className="w-14 h-14 text-muted/30 mx-auto mb-4" />
              <h2 className="font-display font-bold text-ink text-xl mb-2">No cancellations</h2>
              <p className="text-muted mb-6">You haven't cancelled any bookings. To cancel an active booking, go to My Bookings.</p>
              <Link href="/account" className="btn-primary">My Bookings</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-ink mb-1">{item.packageName}</div>
                      <div className="font-mono text-sm text-muted mb-2">{item.bookingRef}</div>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Tour: {new Date(item.departureDate).toLocaleDateString('en-IN')}</span>
                        <span>Cancelled: {new Date(item.cancelledAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 ${STATUS_COLORS[item.refundStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                      Refund: {item.refundStatus}
                    </span>
                  </div>
                  {item.refundAmount > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-muted">
                      Refund amount: <strong className="text-ink">₹{item.refundAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  )}
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
