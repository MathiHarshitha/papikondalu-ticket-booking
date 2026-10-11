'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { QrCode, Download, ArrowLeft, Loader2, Calendar, MapPin, Users, Ticket } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Ticket = {
  ticketId: string; bookingRef: string; packageName: string; departureDate: string
  passengers: number; departurePoint: string; status: string; qrPayload: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/tickets/my`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setTickets(d.tickets ?? []))
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
          <h1 className="font-display text-3xl font-bold text-ink mb-8">My Tickets</h1>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : tickets.length === 0 ? (
            <div className="card p-10 text-center">
              <Ticket className="w-14 h-14 text-muted/30 mx-auto mb-4" />
              <h2 className="font-display font-bold text-ink text-xl mb-2">No tickets yet</h2>
              <p className="text-muted mb-6">Book a Papikondalu tour to get your digital ticket here.</p>
              <Link href="/packages" className="btn-primary">Browse Packages</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.ticketId} className="card overflow-hidden">
                  <div className="bg-river px-5 py-3 flex items-center justify-between">
                    <span className="text-white font-mono font-bold text-sm">{ticket.bookingRef}</span>
                    <span className={`badge text-xs ${ticket.status === 'CHECKED_IN' ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}>
                      {ticket.status === 'CHECKED_IN' ? '✓ Checked In' : 'Valid'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-5">
                      {/* QR */}
                      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center flex-shrink-0 w-24 h-24">
                        <QrCode className="w-16 h-16 text-ink" />
                      </div>
                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-ink mb-2">{ticket.packageName}</h3>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(ticket.departureDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <MapPin className="w-3.5 h-3.5" />{ticket.departurePoint}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <Users className="w-3.5 h-3.5" />{ticket.passengers} passenger{ticket.passengers !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <p className="text-xs text-muted mt-2 font-mono">{ticket.ticketId}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                      <button className="btn-secondary text-sm flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
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
