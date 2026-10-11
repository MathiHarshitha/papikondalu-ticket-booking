'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, QrCode, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type CheckinResult = {
  success: boolean; message: string; ticket?: {
    ticketId: string; bookingRef: string; packageName: string
    departureDate: string; passengers: number; contactName: string
    alreadyCheckedIn: boolean
  }
}

export default function AdminCheckinPage() {
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckinResult | null>(null)

  async function checkIn(e: React.FormEvent) {
    e.preventDefault()
    if (!ticketId.trim()) return
    setLoading(true); setResult(null)
    try {
      const r = await fetch(`${API}/tickets/checkin`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticketId.trim() }),
      })
      const d = await r.json()
      setResult({ success: r.ok, message: d.message ?? (r.ok ? 'Check-in successful' : 'Check-in failed'), ticket: d.ticket })
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  function reset() { setResult(null); setTicketId('') }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">Passenger Check-in</h1>
        </div>

        {!result ? (
          <div className="card p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-teal/10 rounded-full p-5 mb-3">
                <QrCode className="w-12 h-12 text-teal" />
              </div>
              <h2 className="font-display font-bold text-ink text-lg">Scan or Enter Ticket ID</h2>
              <p className="text-muted text-sm mt-1">Scan the passenger's QR code or type the ticket ID manually.</p>
            </div>

            <form onSubmit={checkIn} className="space-y-4">
              <input
                className="input-field text-center font-mono text-sm"
                placeholder="TKT-XXXXXXXX or scan QR"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={loading || !ticketId.trim()}
                className="btn-primary w-full justify-center disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Check In Passenger'}
              </button>
            </form>
          </div>
        ) : result.success && result.ticket ? (
          <div className="card p-6">
            {result.ticket.alreadyCheckedIn ? (
              <div className="flex flex-col items-center text-center mb-4">
                <AlertCircle className="w-14 h-14 text-amber-500 mb-3" />
                <h2 className="font-display font-bold text-ink text-xl mb-1">Already Checked In</h2>
                <p className="text-muted text-sm">This ticket was already used for check-in.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mb-4">
                <CheckCircle2 className="w-14 h-14 text-green-600 mb-3" />
                <h2 className="font-display font-bold text-ink text-xl mb-1">Check-in Successful</h2>
                <p className="text-green-700 text-sm font-medium">{result.message}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-5">
              {[
                ['Ticket ID', result.ticket.ticketId],
                ['Booking Ref', result.ticket.bookingRef],
                ['Package', result.ticket.packageName],
                ['Departure', new Date(result.ticket.departureDate).toLocaleDateString('en-IN')],
                ['Passengers', String(result.ticket.passengers)],
                ['Lead Name', result.ticket.contactName],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-muted">{k}</span>
                  <span className="font-medium text-ink text-right font-mono text-xs">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={reset} className="btn-primary w-full justify-center">Check In Next Passenger</button>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-3" />
            <h2 className="font-display font-bold text-ink text-xl mb-2">Check-in Failed</h2>
            <p className="text-muted text-sm mb-5">{result.message}</p>
            <button onClick={reset} className="btn-primary w-full justify-center">Try Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
