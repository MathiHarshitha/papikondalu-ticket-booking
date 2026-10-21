'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronRight, Calendar, Mail, CreditCard, Download, QrCode, ArrowLeft, AlertCircle, Loader2, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

const ALL_PACKAGES = [
  { slug: 'rajahmundry-papikondalu-packages', name: 'Rajahmundry → Papikondalu Day Tour', price: 1500, image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg', duration: '1 Day', departure: 'Rajahmundry' },
  { slug: 'bhadrachalam-papikondalu-packages', name: 'Bhadrachalam Papikondalu Night Stay', price: 2300, image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png', duration: '2 Days 1 Night', departure: 'Bhadrachalam' },
  { slug: 'sirivaka-night-stay-package', name: 'Sirivaka Night Stay Package', price: 5200, image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_400,h_300,q_auto,f_auto/v1755981756/gudisa-hill-station-800x500_gvmccv.jpg', duration: '2 Days 1 Night', departure: 'Rajahmundry' },
]

const STEPS = ['Package', 'Date & Guests', 'Details', 'Review', 'Payment', 'Confirm']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-shrink-0">
          <div className={`flex items-center gap-2 ${i < current ? 'text-teal' : i === current ? 'text-ink' : 'text-muted'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              i < current ? 'bg-teal border-teal text-white' : i === current ? 'border-ink bg-white text-ink' : 'border-muted/30 bg-white text-muted'
            }`}>
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block">{label}</span>
          </div>
          {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted/40 mx-1 flex-shrink-0" />}
        </div>
      ))}
    </div>
  )
}

function BookingWizard({ initSlug }: { initSlug: string }) {
  const { user: authUser, loading: authLoading } = useAuth()
  const [step, setStep] = useState(initSlug ? 1 : 0)
  const [pkg, setPkg] = useState(ALL_PACKAGES.find(p => p.slug === initSlug) ?? null)
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [passengers, setPassengers] = useState<{ name: string; age: string; id: string }[]>([])
  const [contact, setContact] = useState({ name: '', phone: '', email: '' })
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')
  const [bookingRef, setBookingRef] = useState('')

  const totalGuests = adults + children
  const subtotal = pkg ? pkg.price * totalGuests : 0
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst

  // Pre-fill contact from logged-in user profile once auth resolves
  useEffect(() => {
    if (authLoading) return
    if (authUser) {
      setContact({ name: authUser.name ?? '', phone: authUser.phone ?? '', email: authUser.email ?? '' })
    }
    setProfileLoaded(true)
  }, [authUser, authLoading])

  // Sync passenger array with guest count
  useEffect(() => {
    const count = adults + children
    setPassengers(prev => Array.from({ length: count }, (_, i) => prev[i] ?? { name: '', age: '', id: '' }))
  }, [adults, children])

  // Load PayU Bolt script once
  useEffect(() => {
    if (document.querySelector('script[src*="bolt.min.js"]')) return
    const s = document.createElement('script')
    s.src = 'https://jssdk.payu.in/bolt/bolt.min.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  const handlePay = async () => {
    setPayLoading(true)
    setPayError('')
    try {
      const holdRes = await fetch(`${API}/bookings/hold`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: pkg!.slug,
          departureDate: date,
          adults,
          children,
          contactName: contact.name,
          contactPhone: contact.phone,
          contactEmail: contact.email,
          passengers,
        }),
      })
      const holdData = await holdRes.json()
      if (!holdRes.ok) throw new Error(holdData.message ?? 'Could not hold seats — please try again.')

      const orderRes = await fetch(`${API}/payments/create-order`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: holdData.bookingId }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.message ?? 'Payment setup failed.')

      // @ts-ignore
      if (typeof window.bolt === 'undefined') throw new Error('Payment gateway not loaded. Please refresh and try again.')

      // @ts-ignore
      window.bolt.launch({
        key: orderData.key,
        txnid: orderData.txnid,
        amount: orderData.amount,
        productinfo: orderData.productinfo,
        firstname: orderData.firstname,
        email: orderData.email,
        phone: orderData.phone,
        surl: window.location.href,
        furl: window.location.href,
        hash: orderData.hash,
        udf1: '', udf2: '', udf3: '', udf4: '', udf5: '',
      }, {
        responseHandler: async (BOLT: any) => {
          if (BOLT.response.txnStatus === 'SUCCESS') {
            const vr = await fetch(`${API}/payments/verify`, {
              method: 'POST', credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                txnid: BOLT.response.txnid,
                mihpayid: BOLT.response.mihpayid,
                txnStatus: BOLT.response.txnStatus,
                hash: BOLT.response.hash,
                bookingId: holdData.bookingId,
              }),
            })
            const vd = await vr.json()
            if (!vr.ok) { setPayError(vd.message ?? 'Payment verification failed.'); setPayLoading(false); return }
            setBookingRef(vd.bookingRef)
            setStep(5)
          } else {
            setPayError(BOLT.response.txnStatus === 'CANCEL' ? 'Payment cancelled.' : 'Payment failed. Please try again.')
            setPayLoading(false)
          }
        },
        catchException: (BOLT: any) => {
          setPayError(BOLT.message ?? 'Something went wrong. Please try again.')
          setPayLoading(false)
        },
      })
    } catch (e: any) {
      setPayError(e.message ?? 'Something went wrong.')
      setPayLoading(false)
    }
  }

  return (
    <>
      <StepIndicator current={step} />
      <div className="card p-6 sm:p-8">

        {/* Step 0: Select package */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-ink mb-5">Select a Package</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {ALL_PACKAGES.map(p => (
                <button key={p.slug} onClick={() => { setPkg(p); setStep(1) }}
                  className="card text-left group hover:ring-2 hover:ring-teal transition-all">
                  <div className="relative h-36 overflow-hidden">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-ink text-sm mb-1 leading-snug">{p.name}</div>
                    <div className="text-muted text-xs mb-2">{p.duration} · From {p.departure}</div>
                    <div className="font-display font-bold text-teal">₹{p.price.toLocaleString('en-IN')}<span className="text-xs text-muted font-normal">/person</span></div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-muted text-sm mt-5">Need a group booking? <Link href="/contact" className="text-teal font-medium">Contact us</Link></p>
          </div>
        )}

        {/* Step 1: Date & Guests */}
        {step === 1 && (
          <div>
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Change package</button>
            <div className="card p-3 flex items-center gap-3 mb-5">
              <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={pkg!.image} alt={pkg!.name} fill className="object-cover" unoptimized />
              </div>
              <div>
                <div className="font-semibold text-ink text-sm">{pkg!.name}</div>
                <div className="text-teal font-bold text-sm">₹{pkg!.price.toLocaleString('en-IN')}/person</div>
              </div>
            </div>
            <h2 className="font-display text-xl font-bold text-ink mb-4">Date & Guests</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5"><Calendar className="inline w-4 h-4 mr-1" />Departure Date</label>
                <input type="date" value={date} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Adults', val: adults, set: setAdults, min: 1 }, { label: 'Children (under 12)', val: children, set: setChildren, min: 0 }].map(({ label, val, set, min }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => set(Math.max(min, val - 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold">−</button>
                      <span className="w-8 text-center font-bold text-ink text-lg">{val}</span>
                      <button onClick={() => set(Math.min(50, val + 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-teal/5 border border-teal/20 rounded-xl p-3 text-sm">
                {totalGuests} guests × ₹{pkg!.price.toLocaleString('en-IN')} = <strong className="text-ink">₹{subtotal.toLocaleString('en-IN')}</strong> + ₹{gst} GST = <strong className="text-teal">₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <button onClick={() => setStep(2)} disabled={!date} className="btn-primary w-full justify-center disabled:opacity-50">Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Passenger Details */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back</button>
            <h2 className="font-display text-xl font-bold text-ink mb-4">Passenger Details</h2>
            <div className="card p-4 mb-4">
              <h3 className="font-medium text-ink text-sm mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-teal" />Lead Contact</h3>
              {!profileLoaded && <p className="text-xs text-muted mb-2">Loading your profile…</p>}
              <div className="space-y-3">
                <input className="input-field" placeholder="Full name" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} />
                <input className="input-field" placeholder="Mobile (+91)" type="tel" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
                <input className="input-field" placeholder="Email" type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {passengers.map((p, i) => (
                <div key={i} className="card p-4">
                  <h3 className="font-medium text-ink text-sm mb-3">Passenger {i + 1} {i < adults ? '(Adult)' : '(Child)'}</h3>
                  <div className="space-y-2">
                    <input className="input-field" placeholder="Full name" value={p.name} onChange={e => { const a = [...passengers]; a[i] = { ...a[i], name: e.target.value }; setPassengers(a) }} />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input-field" placeholder="Age" type="number" min="1" value={p.age} onChange={e => { const a = [...passengers]; a[i] = { ...a[i], age: e.target.value }; setPassengers(a) }} />
                      <input className="input-field" placeholder="ID no. (Aadhaar/Passport)" value={p.id} onChange={e => { const a = [...passengers]; a[i] = { ...a[i], id: e.target.value }; setPassengers(a) }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)}
              disabled={!contact.name || !contact.phone || !contact.email || passengers.some(p => !p.name)}
              className="btn-primary w-full justify-center disabled:opacity-50">Review Booking →</button>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Edit Details</button>
            <h2 className="font-display text-xl font-bold text-ink mb-4">Booking Summary</h2>
            <div className="card p-5 space-y-3 mb-4">
              {[
                ['Package', pkg!.name],
                ['Departure', new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })],
                ['Guests', `${adults} adult${adults !== 1 ? 's' : ''}${children ? ` + ${children} child${children !== 1 ? 'ren' : ''}` : ''}`],
                ['Contact', `${contact.name} · ${contact.phone}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm gap-4">
                  <span className="text-muted flex-shrink-0">{k}</span>
                  <span className="font-medium text-ink text-right">{v}</span>
                </div>
              ))}
              <hr className="border-gray-100" />
              <div className="flex justify-between text-sm"><span className="text-muted">Fare ({totalGuests}×₹{pkg!.price.toLocaleString('en-IN')})</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">GST 5%</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-bold"><span className="text-ink">Total</span><span className="text-teal text-xl">₹{total.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 mb-4">
              ⏰ Free cancellation up to 48 hrs before departure. 50% charge within 24–48 hrs. No refund within 24 hrs.
            </div>
            {authLoading ? (
              <div className="btn-primary w-full justify-center text-base py-3 opacity-60 cursor-not-allowed">
                <Loader2 className="w-4 h-4 animate-spin" /> Checking session…
              </div>
            ) : authUser ? (
              <button
                onClick={() => setStep(4)}
                className="btn-primary w-full justify-center text-base py-3">
                <CreditCard className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')}
              </button>
            ) : (
              <button
                onClick={() => { window.location.href = `/login?redirect=${encodeURIComponent('/book' + window.location.search)}` }}
                className="btn-primary w-full justify-center text-base py-3">
                <LogIn className="w-5 h-5" /> Sign in to Continue
              </button>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back</button>
            <h2 className="font-display text-xl font-bold text-ink mb-2">Secure Payment</h2>
            <p className="text-muted text-sm mb-5">Powered by PayU. UPI · Cards · Net Banking · Wallets.</p>
            <div className="card p-4 mb-4 flex justify-between items-center">
              <span className="text-muted text-sm">Amount to pay</span>
              <span className="font-display font-bold text-teal text-2xl">₹{total.toLocaleString('en-IN')}</span>
            </div>
            {payError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm mb-4 flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{payError}
              </div>
            )}
            <button disabled={payLoading} onClick={handlePay}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50">
              {payLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                : <><CreditCard className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')} Securely</>}
            </button>
            <div className="text-center text-xs text-muted mt-4">🔒 SSL encrypted · PCI-DSS compliant · Never stored on our servers</div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink mb-2">Booking Confirmed!</h2>
            <p className="text-muted mb-1">Ticket sent to <strong>{contact.email}</strong></p>
            <p className="font-mono text-ink font-bold mb-6">{bookingRef || 'PK-XXXXXXXX'}</p>
            <div className="card p-6 mb-6 max-w-xs mx-auto">
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center mb-3">
                <QrCode className="w-20 h-20 text-ink" />
              </div>
              <p className="text-xs text-muted">Show this QR at the boarding gate</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/account/tickets" className="btn-primary"><Download className="w-4 h-4" /> My Tickets</Link>
              <Link href="/packages" className="btn-secondary">Book Another</Link>
            </div>
            <p className="text-muted text-xs mt-5">Questions? <a href="tel:+919848323488" className="text-teal">+91 98483 23488</a></p>
          </div>
        )}

      </div>
    </>
  )
}

function BookingWizardWithSteps() {
  const searchParams = useSearchParams()
  const initSlug = searchParams.get('package') ?? ''
  return <BookingWizard initSlug={initSlug} />
}

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-ivory">
        <div className="bg-river py-10 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Secure Booking</div>
          <h1 className="font-display text-3xl font-bold">Book Your Tour</h1>
          <p className="text-white/70 text-sm mt-1">Complete in 5 easy steps</p>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Suspense fallback={<div className="text-center py-12 text-muted">Loading…</div>}>
            <BookingWizardWithSteps />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
