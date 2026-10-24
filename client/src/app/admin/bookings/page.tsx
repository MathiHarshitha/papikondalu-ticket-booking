'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Search, X, ChevronDown } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Booking = {
  _id: string; bookingRef: string
  leadPassengerName: string; leadPassengerEmail: string; leadPassengerPhone: string
  packageSnapshot: { title: string; departureDate: string; boardingLocation: string; duration: string }
  adultCount: number; childCount: number
  passengers: { name: string; ageCategory: string }[]
  fareBreakdown: { adultPrice: number; childPrice: number; adultTotal: number; childTotal: number; tax: number; total: number }
  bookingStatus: string; paymentStatus: string
  specialRequests: string; cancellationReason: string
  createdAt: string
}

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
}

const PAYMENT_STYLE: Record<string, string> = {
  CAPTURED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REFUNDED: 'bg-blue-100 text-blue-700',
  PARTIALLY_REFUNDED: 'bg-purple-100 text-purple-700',
}

const ALLOWED_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

function BookingPanel({ booking, onClose, onUpdated }: { booking: Booking; onClose: () => void; onUpdated: (b: Booking) => void }) {
  const [newStatus, setNewStatus] = useState(booking.bookingStatus)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const changed = newStatus !== booking.bookingStatus

  async function applyStatus() {
    if (!changed) return
    setSaving(true); setError('')
    try {
      const r = await fetch(`${API}/admin/bookings/${booking._id}/status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason: reason || undefined }),
      })
      const d = await r.json()
      if (!r.ok) { setError(d.message ?? 'Failed to update'); return }
      onUpdated(d.booking)
    } catch { setError('Network error') } finally { setSaving(false) }
  }

  const fmt = (n?: number) => n != null ? `₹${n.toLocaleString('en-IN')}` : '—'
  const date = (s?: string) => s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono text-xs text-muted">{booking.bookingRef}</p>
            <h2 className="font-display text-lg font-bold text-ink">{booking.leadPassengerName}</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`badge text-xs font-semibold ${STATUS_STYLE[booking.bookingStatus] ?? 'bg-gray-100 text-gray-600'}`}>
              Booking: {booking.bookingStatus}
            </span>
            <span className={`badge text-xs font-semibold ${PAYMENT_STYLE[booking.paymentStatus] ?? 'bg-gray-100 text-gray-600'}`}>
              Payment: {booking.paymentStatus}
            </span>
          </div>

          {/* Customer */}
          <section>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Customer</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
              <p className="text-ink font-medium">{booking.leadPassengerName}</p>
              <p className="text-muted">{booking.leadPassengerEmail}</p>
              <p className="text-muted">{booking.leadPassengerPhone}</p>
            </div>
          </section>

          {/* Trip */}
          <section>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Trip Details</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
              <p className="text-ink font-medium">{booking.packageSnapshot?.title}</p>
              <p className="text-muted">Departure: {date(booking.packageSnapshot?.departureDate)}</p>
              <p className="text-muted">Boarding: {booking.packageSnapshot?.boardingLocation || '—'}</p>
              <p className="text-muted">Duration: {booking.packageSnapshot?.duration || '—'}</p>
              <p className="text-muted">Adults: {booking.adultCount} · Children: {booking.childCount}</p>
            </div>
          </section>

          {/* Passengers */}
          {(booking.passengers ?? []).length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Passengers</h3>
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-100">
                {booking.passengers.map((p, i) => (
                  <div key={i} className="px-3 py-2 flex justify-between text-sm">
                    <span className="text-ink">{p.name || `Passenger ${i + 1}`}</span>
                    <span className="text-muted capitalize">{p.ageCategory}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fare */}
          <section>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Fare Breakdown</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
              {booking.fareBreakdown?.adultTotal > 0 && (
                <div className="flex justify-between text-muted">
                  <span>{booking.adultCount} adult{booking.adultCount !== 1 ? 's' : ''} × {fmt(booking.fareBreakdown.adultPrice)}</span>
                  <span>{fmt(booking.fareBreakdown.adultTotal)}</span>
                </div>
              )}
              {(booking.fareBreakdown?.childTotal ?? 0) > 0 && (
                <div className="flex justify-between text-muted">
                  <span>{booking.childCount} child{booking.childCount !== 1 ? 'ren' : ''} × {fmt(booking.fareBreakdown.childPrice)}</span>
                  <span>{fmt(booking.fareBreakdown.childTotal)}</span>
                </div>
              )}
              {(booking.fareBreakdown?.tax ?? 0) > 0 && (
                <div className="flex justify-between text-muted"><span>Tax</span><span>{fmt(booking.fareBreakdown.tax)}</span></div>
              )}
              <div className="flex justify-between font-semibold text-ink pt-1 border-t border-gray-200">
                <span>Total</span><span>{fmt(booking.fareBreakdown?.total)}</span>
              </div>
            </div>
          </section>

          {/* Special requests */}
          {booking.specialRequests && (
            <section>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Special Requests</h3>
              <p className="text-sm text-ink bg-gray-50 rounded-lg p-3">{booking.specialRequests}</p>
            </section>
          )}

          {/* Cancellation reason */}
          {booking.cancellationReason && (
            <section>
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Cancellation Reason</h3>
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{booking.cancellationReason}</p>
            </section>
          )}

          {/* Booked on */}
          <p className="text-xs text-muted">Booked on {date(booking.createdAt)}</p>
        </div>

        {/* Status change */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Change Status</h3>
          <div className="relative">
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="input-field w-full appearance-none pr-8"
            >
              {ALLOWED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          </div>
          {newStatus === 'CANCELLED' && (
            <input
              className="input-field w-full"
              placeholder="Cancellation reason (optional)"
              value={reason} onChange={e => setReason(e.target.value)}
            />
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            onClick={applyStatus}
            disabled={!changed || saving}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving…' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)

  useEffect(() => {
    fetch(`${API}/admin/bookings`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setBookings(d.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleUpdated(updated: Booking) {
    setBookings(prev => prev.map(b => b._id === updated._id ? { ...b, ...updated } : b))
    setSelected(prev => prev?._id === updated._id ? { ...prev, ...updated } : prev)
  }

  const filtered = bookings.filter(b =>
    b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
    b.leadPassengerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.leadPassengerEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {selected && (
        <BookingPanel
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">All Bookings</h1>
        </div>

        <div className="card mb-4">
          <div className="p-4 flex items-center gap-3 border-b border-gray-100">
            <Search className="w-4 h-4 text-muted" />
            <input className="flex-1 bg-transparent outline-none text-sm text-ink placeholder-muted"
              placeholder="Search by booking ref, name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Ref', 'Customer', 'Package', 'Date', 'Passengers', 'Fare', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted">No bookings found</td></tr>
                  ) : filtered.map(bk => (
                    <tr key={bk._id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(bk)}>
                      <td className="px-4 py-3 font-mono text-xs text-ink">{bk.bookingRef}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink">{bk.leadPassengerName}</div>
                        <div className="text-muted text-xs">{bk.leadPassengerEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-ink max-w-[180px]"><div className="truncate">{bk.packageSnapshot?.title}</div></td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">{bk.packageSnapshot?.departureDate ? new Date(bk.packageSnapshot.departureDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-4 py-3 text-center text-ink">{(bk.adultCount ?? 0) + (bk.childCount ?? 0)}</td>
                      <td className="px-4 py-3 font-semibold text-ink">₹{bk.fareBreakdown?.total?.toLocaleString('en-IN') ?? '—'}</td>
                      <td className="px-4 py-3"><span className={`badge text-xs ${STATUS_STYLE[bk.bookingStatus] ?? 'bg-gray-100 text-gray-700'}`}>{bk.bookingStatus?.replace('_', ' ') ?? '—'}</span></td>
                      <td className="px-4 py-3">
                        <button
                          className="text-teal text-xs font-medium hover:underline"
                          onClick={e => { e.stopPropagation(); setSelected(bk) }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
