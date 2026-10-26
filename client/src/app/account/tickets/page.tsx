'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Download, ArrowLeft, Loader2, Calendar, MapPin, Users, Ticket, FileDown } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'
const LOGO = 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png'

type TicketData = {
  ticketId: string; bookingRef: string; packageName: string; departureDate: string
  passengers: number; departurePoint: string; status: string; qrPayload: string
}

/* ── Load script from CDN once ── */
function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src; s.crossOrigin = 'anonymous'
    s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

/* ── Ticket card (shown in page UI) ── */
function TicketCard({ ticket, onDownload, downloading }: {
  ticket: TicketData; onDownload: () => void; downloading: boolean
}) {
  const isCheckedIn = ticket.status === 'CHECKED_IN'
  return (
    <div className="card overflow-hidden">
      {/* Top bar */}
      <div className="bg-river px-5 py-3 flex items-center justify-between">
        <span className="text-white font-mono font-bold text-sm">{ticket.bookingRef}</span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500 text-white">
          {isCheckedIn ? '✓ Checked In' : '✓ Valid'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex gap-5 items-start">
          {/* Live QR */}
          <div className="bg-gray-50 rounded-xl p-3 flex-shrink-0 border border-gray-100">
            <QRCodeSVG value={ticket.qrPayload || ticket.bookingRef} size={88} fgColor="#0f2d3d" bgColor="white" level="H" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-ink text-base mb-2 leading-snug">{ticket.packageName}</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                {new Date(ticket.departureDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />{ticket.departurePoint}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Users className="w-3.5 h-3.5 flex-shrink-0" />{ticket.passengers} passenger{ticket.passengers !== 1 ? 's' : ''}
              </div>
            </div>
            <p className="text-xs text-muted/70 mt-2 font-mono truncate">{ticket.ticketId}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onDownload}
            disabled={downloading}
            className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {downloading
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF…</>
              : <><FileDown className="w-3.5 h-3.5" /> Download Ticket PDF</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Printable ticket (captured by html2canvas) ── */
function PrintableTicket({ ticket }: { ticket: TicketData }) {
  const isCheckedIn = ticket.status === 'CHECKED_IN'
  const formattedDate = ticket.departureDate
    ? new Date(ticket.departureDate).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  return (
    <div style={{
      width: '760px', background: 'white', borderRadius: '16px',
      overflow: 'hidden', fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#0f2d3d 0%,#1a4a5a 55%,#1d6070 100%)',
        padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="logo" style={{ width: '56px', height: '56px', objectFit: 'contain' }} crossOrigin="anonymous" />
          <div>
            <div style={{ color: '#f59e0b', fontSize: '21px', fontWeight: 800, letterSpacing: '0.3px' }}>
              ASWINI GODAVARI TRAVELS
            </div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '3px' }}>
              Papikondalu Tourism · Est. 2010
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase' }}>Booking Ref</div>
          <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px', marginTop: '3px' }}>
            {ticket.bookingRef}
          </div>
          <div style={{
            display: 'inline-block', marginTop: '6px',
            background: '#22c55e', color: 'white',
            border: '1px solid #22c55e',
            padding: '2px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
          }}>
            {isCheckedIn ? '✓ CHECKED IN' : '✓ VALID'}
          </div>
        </div>
      </div>

      {/* Tear line */}
      <div style={{ position: 'relative', margin: '0 20px' }}>
        <div style={{ borderTop: '2px dashed #d1d5db' }} />
        <div style={{ position: 'absolute', left: '-20px', top: '-10px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '-20px', top: '-10px', width: '20px', height: '20px', background: 'white', borderRadius: '50%' }} />
      </div>

      {/* Body */}
      <div style={{ padding: '24px 28px', display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
        {/* Details */}
        <div style={{ flex: 1 }}>
          <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>Tour Package</div>
          <div style={{ color: '#0f2d3d', fontSize: '19px', fontWeight: 700, marginBottom: '20px', lineHeight: 1.3 }}>
            {ticket.packageName || 'Papikondalu Day Trip'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            {([
              ['Departure Date', formattedDate],
              ['Boarding Point', ticket.departurePoint || 'Rajahmundry'],
              ['Passengers', `${ticket.passengers} ${ticket.passengers === 1 ? 'Passenger' : 'Passengers'}`],
              ['Destination', 'Papikondalu, AP'],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label}>
                <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</div>
                <div style={{ color: '#0f2d3d', fontSize: '13px', fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
            <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>Ticket ID</div>
            <div style={{ color: '#374151', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, wordBreak: 'break-all' }}>{ticket.ticketId}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', background: '#e5e7eb', alignSelf: 'stretch', flexShrink: 0 }} />

        {/* QR */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ padding: '12px', background: 'white', borderRadius: '10px', border: '2px solid #e5e7eb' }}>
            <QRCodeSVG value={ticket.qrPayload || ticket.bookingRef} size={124} fgColor="#0f2d3d" bgColor="white" level="H" />
          </div>
          <div style={{ color: '#9ca3af', fontSize: '10px', textAlign: 'center' }}>Scan at boarding point</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#f8fafc', borderTop: '1px solid #e5e7eb',
        padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ color: '#6b7280', fontSize: '11px', lineHeight: 1.7 }}>
          <div>📞 +91 98483 23488</div>
          <div>✉ aswinigodavari@gmail.com</div>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '10px', textAlign: 'right' }}>
          Valid only for the date mentioned above.<br />Non-transferable. Present at boarding.
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        background: 'linear-gradient(90deg,#0f2d3d,#1a4a5a)',
        padding: '7px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Aswini Godavari Travels · Papikondalu Tourism
        </div>
        <div style={{ color: 'rgba(245,158,11,0.6)', fontSize: '9px', fontFamily: 'monospace' }}>{ticket.bookingRef}</div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
  const [renderTicket, setRenderTicket] = useState<TicketData | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API}/tickets/my`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setTickets(d.tickets ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Once renderTicket is set and DOM is ready, capture + download
  useEffect(() => {
    if (!renderTicket || !ticketRef.current) return

    let cancelled = false
    const run = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')

        if (cancelled || !ticketRef.current) return

        const canvas = await (window as any).html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
        })

        if (cancelled) return

        const { jsPDF } = (window as any).jspdf
        const imgW = canvas.width / 2
        const imgH = canvas.height / 2
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [imgW, imgH] })
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgW, imgH)
        pdf.save(`Ticket-${renderTicket.bookingRef}.pdf`)
      } catch (e) {
        console.error('PDF generation failed', e)
      } finally {
        if (!cancelled) {
          setRenderTicket(null)
          setDownloadingId(null)
        }
      }
    }

    // Small delay to let DOM + images settle
    const t = setTimeout(run, 700)
    return () => { cancelled = true; clearTimeout(t) }
  }, [renderTicket])

  const handleDownload = (ticket: TicketData) => {
    if (downloadingId) return
    setDownloadingId(ticket.ticketId)
    setRenderTicket(ticket)
  }

  return (
    <>
      {/* Off-screen element captured by html2canvas */}
      {renderTicket && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1, pointerEvents: 'none' }}>
          <div ref={ticketRef}>
            <PrintableTicket ticket={renderTicket} />
          </div>
        </div>
      )}

      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Account
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mb-8">My Tickets</h1>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
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
                <TicketCard
                  key={ticket.ticketId}
                  ticket={ticket}
                  onDownload={() => handleDownload(ticket)}
                  downloading={downloadingId === ticket.ticketId}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
