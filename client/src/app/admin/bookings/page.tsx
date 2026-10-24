'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Calendar, Users, MapPin, Search, Download } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Booking = {
  _id: string; bookingRef: string
  leadPassengerName: string; leadPassengerEmail: string
  packageSnapshot: { title: string; departureDate: string }
  adultCount: number; childCount: number
  fareBreakdown: { total: number }
  bookingStatus: string; paymentStatus: string
  createdAt: string
}

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${API}/admin/bookings`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setBookings(d.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b =>
    b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
    b.leadPassengerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.leadPassengerEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
                    <tr key={bk._id} className="hover:bg-gray-50/50">
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
                      <td className="px-4 py-3"><button className="text-teal text-xs hover:underline">View</button></td>
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
