'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'

function TicketPrintContent() {
  const params = useSearchParams()
  const ref     = params.get('ref')    ?? ''
  const tid     = params.get('tid')    ?? ''
  const pkg     = params.get('pkg')    ?? ''
  const date    = params.get('date')   ?? ''
  const pax     = params.get('pax')    ?? '1'
  const loc     = params.get('loc')    ?? ''
  const qr      = params.get('qr')     ?? ref
  const status  = params.get('status') ?? 'VALID'

  useEffect(() => {
    const t = setTimeout(() => window.print(), 900)
    return () => clearTimeout(t)
  }, [])

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const isCheckedIn = status === 'CHECKED_IN'

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0e8; font-family: 'Georgia', serif; }
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          @page { size: A5 landscape; margin: 10mm; }
        }
      `}</style>

      {/* Print button — hidden on print */}
      <div className="no-print" style={{ textAlign: 'center', padding: '20px', background: '#1a3a4a' }}>
        <button
          onClick={() => window.print()}
          style={{
            background: '#f59e0b', color: '#1a3a4a', border: 'none',
            padding: '10px 28px', borderRadius: '6px', fontWeight: 700,
            fontSize: '15px', cursor: 'pointer', letterSpacing: '0.5px',
          }}
        >
          ⬇ Save as PDF / Print
        </button>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginLeft: '16px' }}>
          In print dialog → choose "Save as PDF"
        </span>
      </div>

      {/* Ticket */}
      <div style={{
        maxWidth: '780px', margin: '30px auto', background: 'white',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f2d3d 0%, #1a4a5a 60%, #1d6070 100%)',
          padding: '24px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Boat SVG logo */}
            <div style={{
              width: '56px', height: '56px', background: 'rgba(245,158,11,0.2)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', border: '2px solid rgba(245,158,11,0.5)',
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M2 20 C5 16, 10 14, 12 14 C14 14, 19 16, 22 20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 17 L12 8 L20 17" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4 L12 8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="3" r="1.5" fill="#f59e0b"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontSize: '22px', fontWeight: 800, letterSpacing: '0.5px', fontFamily: 'Georgia, serif' }}>
                ASWINI GODAVARI TRAVELS
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>
                Papikondalu Tourism · Est. 2010
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>Booking Ref</div>
            <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px', marginTop: '2px' }}>
              {ref}
            </div>
            <div style={{
              display: 'inline-block', marginTop: '6px',
              background: isCheckedIn ? '#22c55e' : 'rgba(245,158,11,0.25)',
              color: isCheckedIn ? 'white' : '#f59e0b',
              border: `1px solid ${isCheckedIn ? '#22c55e' : 'rgba(245,158,11,0.6)'}`,
              padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
            }}>
              {isCheckedIn ? '✓ CHECKED IN' : '✓ VALID'}
            </div>
          </div>
        </div>

        {/* ── Dashed divider ── */}
        <div style={{ position: 'relative', height: '0', overflow: 'visible' }}>
          <div style={{
            position: 'absolute', left: '0', right: '0', top: '0',
            borderTop: '2px dashed #d1d5db', zIndex: 1,
          }} />
          <div style={{ position: 'absolute', left: '-1px', top: '-12px', width: '24px', height: '24px', background: '#f5f0e8', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: '-1px', top: '-12px', width: '24px', height: '24px', background: '#f5f0e8', borderRadius: '50%' }} />
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '28px 32px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

          {/* Left: trip details */}
          <div style={{ flex: 1 }}>
            <div style={{ color: '#9ca3af', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              Tour Package
            </div>
            <div style={{ color: '#0f2d3d', fontSize: '20px', fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: '20px', lineHeight: 1.3 }}>
              {pkg || 'Papikondalu Day Trip'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Departure Date</div>
                <div style={{ color: '#0f2d3d', fontSize: '14px', fontWeight: 600 }}>{formattedDate}</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Boarding Point</div>
                <div style={{ color: '#0f2d3d', fontSize: '14px', fontWeight: 600 }}>{loc || 'Rajahmundry'}</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Passengers</div>
                <div style={{ color: '#0f2d3d', fontSize: '14px', fontWeight: 600 }}>{pax} {Number(pax) === 1 ? 'Passenger' : 'Passengers'}</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Destination</div>
                <div style={{ color: '#0f2d3d', fontSize: '14px', fontWeight: 600 }}>Papikondalu, AP</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ color: '#9ca3af', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Ticket ID</div>
              <div style={{ color: '#374151', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, wordBreak: 'break-all' }}>{tid}</div>
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', background: '#e5e7eb', alignSelf: 'stretch', flexShrink: 0 }} />

          {/* Right: QR code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              padding: '14px', background: 'white', borderRadius: '12px',
              border: '2px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <QRCodeSVG
                value={qr || ref}
                size={130}
                fgColor="#0f2d3d"
                bgColor="white"
                level="H"
              />
            </div>
            <div style={{ color: '#9ca3af', fontSize: '10px', textAlign: 'center', letterSpacing: '0.5px' }}>
              Scan at boarding point
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          background: '#f8fafc', borderTop: '1px solid #e5e7eb',
          padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ color: '#6b7280', fontSize: '11px' }}>
            📞 +91 98483 23488 &nbsp;|&nbsp; ✉ bookings@papikondalutourism.com
          </div>
          <div style={{ color: '#9ca3af', fontSize: '10px', textAlign: 'right' }}>
            Valid only for the date mentioned above. Non-transferable.
          </div>
        </div>

        {/* ── Bottom watermark strip ── */}
        <div style={{
          background: 'linear-gradient(90deg, #0f2d3d, #1a4a5a)',
          padding: '6px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Aswini Godavari Travels · Papikondalu Tourism
          </div>
          <div style={{ color: 'rgba(245,158,11,0.6)', fontSize: '9px', fontFamily: 'monospace' }}>
            {ref}
          </div>
        </div>
      </div>
    </>
  )
}

export default function TicketPrintPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Preparing ticket…</div>}>
      <TicketPrintContent />
    </Suspense>
  )
}
