'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronRight, Calendar, Users, User, Phone, Mail, CreditCard, Download, QrCode, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'

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

function BookingWizardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initSlug = searchParams.get('package') ?? ''

  const [step, setStep] = useState(initSlug ? 1 : 0)
  const [pkg, setPkg] = useState(ALL_PACKAGES.find(p => p.slug === initSlug) ?? null)
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [passengers, setPassengers] = useState<{ name: string; age: string; id: string }[]>([])
  const [contact, setContact] = useState({ name: '', phone: '', email: '' })
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [ticketId, setTicketId] = useState('')

  const totalGuests = adults + children
  const subtotal = pkg ? pkg.price * totalGuests : 0
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst

  useEffect(() => {
    const count = adults + children
    setPassengers(Array.from({ length: count }, (_, i) => passengers[i] ?? { name: '', age: '', id: '' }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adults, children])

  // Step 0: Choose package
  if (step === 0) return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink mb-5">Select a Package</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_PACKAGES.filter(p => p.price).map(p => (
          <button key={p.slug} onClick={() => { setPkg(p); setStep(1) }}
            className="card text-left group hover:border-teal hover:shadow-md transition-all border-2 border-transparent">
            <div className="relative h-40 overflow-hidden">
              <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
            </div>
            <div className="p-4">
              <div className="font-semibold text-ink text-sm mb-1 leading-snug">{p.name}</div>
              <div className="text-muted text-xs mb-2">{p.duration} · From {p.departure}</div>
              <div className="font-display font-bold text-teal text-lg">₹{p.price.toLocaleString('en-IN')}<span className="text-xs text-muted font-normal">/person</span></div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-muted text-sm mt-6">Want a custom group booking? <Link href="/contact" className="text-teal font-medium">Contact us</Link></p>
    </div>
  )

  // Step 1: Date & guests
  if (step === 1) return (
    <div>
      <button onClick={() => setStep(0)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Change package</button>
      <div className="card p-4 flex items-center gap-4 mb-6">
        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={pkg!.image} alt={pkg!.name} fill className="object-cover" unoptimized />
        </div>
        <div>
          <div className="font-semibold text-ink text-sm">{pkg!.name}</div>
          <div className="text-teal font-bold">₹{pkg!.price.toLocaleString('en-IN')}/person</div>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-ink mb-5">Choose Date & Guests</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5"><Calendar className="inline w-4 h-4 mr-1" />Departure Date</label>
          <input type="date" value={date} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)} className="input-field" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5"><Users className="inline w-4 h-4 mr-1" />Adults</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">−</button>
              <span className="w-8 text-center font-bold text-ink">{adults}</span>
              <button onClick={() => setAdults(Math.min(50, adults + 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Children <span className="text-muted font-normal">(under 12)</span></label>
            <div className="flex items-center gap-3">
              <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">−</button>
              <span className="w-8 text-center font-bold text-ink">{children}</span>
              <button onClick={() => setChildren(Math.min(20, children + 1))} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">+</button>
            </div>
          </div>
        </div>
        <div className="bg-ivory border border-gray-200 rounded-xl p-4 text-sm text-muted">
          <strong>{totalGuests} guests</strong> × ₹{pkg!.price.toLocaleString('en-IN')} = <strong className="text-ink">₹{subtotal.toLocaleString('en-IN')}</strong> <span className="text-xs">(+5% GST)</span>
        </div>
        <button onClick={() => setStep(2)} disabled={!date}
          className="btn-primary w-full justify-center disabled:opacity-50">
          Continue to Passenger Details
        </button>
      </div>
    </div>
  )

  // Step 2: Passenger details
  if (step === 2) return (
    <div>
      <button onClick={() => setStep(1)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="font-display text-xl font-bold text-ink mb-2">Passenger Details</h2>
      <p className="text-muted text-sm mb-5">Required for the passenger manifest. Carry valid government ID for each adult.</p>

      {/* Lead contact */}
      <div className="card p-5 mb-4">
        <h3 className="font-semibold text-ink mb-4 flex items-center gap-2"><User className="w-4 h-4 text-teal" />Lead Contact</h3>
        <div className="space-y-3">
          <input className="input-field" placeholder="Full name" value={contact.name}
            onChange={e => setContact(c => ({ ...c, name: e.target.value }))} />
          <input className="input-field" placeholder="Mobile number (+91)" type="tel" value={contact.phone}
            onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} />
          <input className="input-field" placeholder="Email address" type="email" value={contact.email}
            onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
        </div>
      </div>

      {/* Per-passenger */}
      <div className="space-y-3 mb-5">
        {passengers.map((p, i) => (
          <div key={i} className="card p-4">
            <h3 className="font-medium text-ink text-sm mb-3">
              Passenger {i + 1} {i < adults ? '(Adult)' : '(Child)'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input className="input-field col-span-2" placeholder="Full name" value={p.name}
                onChange={e => { const arr = [...passengers]; arr[i] = { ...arr[i], name: e.target.value }; setPassengers(arr) }} />
              <input className="input-field" placeholder="Age" type="number" min="1" max="100" value={p.age}
                onChange={e => { const arr = [...passengers]; arr[i] = { ...arr[i], age: e.target.value }; setPassengers(arr) }} />
              <input className="input-field" placeholder="ID number (Aadhaar/Passport)" value={p.id}
                onChange={e => { const arr = [...passengers]; arr[i] = { ...arr[i], id: e.target.value }; setPassengers(arr) }} />
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setStep(3)}
        disabled={!contact.name || !contact.phone || !contact.email || passengers.some(p => !p.name)}
        className="btn-primary w-full justify-center disabled:opacity-50">
        Review & Pay
      </button>
    </div>
  )

  // Step 3: Review
  if (step === 3) return (
    <div>
      <button onClick={() => setStep(2)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="font-display text-xl font-bold text-ink mb-5">Booking Summary</h2>

      <div className="card p-5 mb-4 space-y-3">
        <div className="flex justify-between text-sm"><span className="text-muted">Package</span><span className="font-medium text-ink text-right">{pkg!.name}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Departure</span><span className="font-medium text-ink">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Guests</span><span className="font-medium text-ink">{adults} adult{adults !== 1 ? 's' : ''}{children > 0 ? ` + ${children} child${children !== 1 ? 'ren' : ''}` : ''}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">Lead contact</span><span className="font-medium text-ink">{contact.name} · {contact.phone}</span></div>
        <hr className="border-gray-100" />
        <div className="flex justify-between text-sm"><span className="text-muted">Fare ({totalGuests} × ₹{pkg!.price.toLocaleString('en-IN')})</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">GST (5%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
        <hr className="border-gray-100" />
        <div className="flex justify-between font-bold text-ink"><span>Total Payable</span><span className="text-teal text-xl">₹{total.toLocaleString('en-IN')}</span></div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-2 mb-5">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>Cancellation is <strong>free up to 48 hours</strong> before departure. After that, a 50% charge applies. No refunds within 24 hours.</div>
      </div>

      <button onClick={() => setStep(4)} className="btn-primary w-full justify-center">
        <CreditCard className="w-4 h-4" /> Proceed to Pay ₹{total.toLocaleString('en-IN')}
      </button>
    </div>
  )

  // Step 4: Payment (Razorpay integration)
  if (step === 4) return (
    <div>
      <button onClick={() => setStep(3)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back to Review</button>
      <h2 className="font-display text-xl font-bold text-ink mb-2">Secure Payment</h2>
      <p className="text-muted text-sm mb-6">Powered by Razorpay — India's trusted payment gateway. Your card details never touch our servers.</p>

      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-muted text-sm">Amount to pay</span>
          <span className="font-display font-bold text-teal text-2xl">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {payError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex gap-2 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{payError}
        </div>
      )}

      <button onClick={async () => {
        setPayLoading(true)
        setPayError('')
        try {
          // 1. Hold seats and create Razorpay order
          const holdRes = await fetch(`${API}/bookings/hold`, {
            method: 'POST',
            credentials: 'include',
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
          if (!holdRes.ok) throw new Error(holdData.message ?? 'Failed to hold seats')

          // 2. Create Razorpay order
          const orderRes = await fetch(`${API}/payments/create-order`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: holdData.bookingId }),
          })
          const orderData = await orderRes.json()
          if (!orderRes.ok) throw new Error(orderData.message ?? 'Payment initialization failed')

          // 3. Open Razorpay checkout
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: 'INR',
            name: 'Aswini Godavari Travel',
            description: pkg!.name,
            image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png',
            order_id: orderData.orderId,
            prefill: { name: contact.name, email: contact.email, contact: contact.phone },
            theme: { color: '#168C8C' },
            handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
              const verRes = await fetch(`${API}/payments/verify`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId: holdData.bookingId,
                }),
              })
              const verData = await verRes.json()
              if (!verRes.ok) throw new Error(verData.message ?? 'Payment verification failed')
              setBookingRef(verData.bookingRef)
              setTicketId(verData.ticketId)
              setStep(5)
            },
          }
          // @ts-ignore
          const rzp = new window.Razorpay(options)
          rzp.on('payment.failed', (resp: any) => setPayError(resp.error?.description ?? 'Payment failed. Please try again.'))
          rzp.open()
        } catch (err: any) {
          setPayError(err.message ?? 'Something went wrong. Please try again.')
        } finally {
          setPayLoading(false)
        }
      }}
        disabled={payLoading}
        className="btn-primary w-full justify-center disabled:opacity-50 text-base py-3">
        {payLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><CreditCard className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')} via Razorpay</>}
      </button>

      <div className="flex items-center justify-center gap-3 mt-4 text-xs text-muted">
        <span>🔒 256-bit SSL</span><span>·</span><span>PCI-DSS Razorpay</span><span>·</span><span>UPI · Cards · NetBanking</span>
      </div>

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  )

  // Step 5: Confirmation
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="font-display text-2xl font-bold text-ink mb-2">Booking Confirmed!</h2>
      <p className="text-muted mb-1">Your ticket has been sent to <strong>{contact.email}</strong></p>
      <p className="text-muted text-sm mb-6">Booking reference: <span className="font-mono font-bold text-ink">{bookingRef || 'PK-XXXXXXXX'}</span></p>

      <div className="card p-6 mb-6 max-w-sm mx-auto">
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center mb-4">
          <QrCode className="w-24 h-24 text-ink" />
        </div>
        <p className="text-sm text-muted">Show this QR code at the boarding gate for check-in.</p>
        {ticketId && <p className="text-xs text-muted mt-1 font-mono">{ticketId}</p>}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <Link href={`/account/tickets`} className="btn-primary"><Download className="w-4 h-4" /> Download Ticket</Link>
        <Link href="/packages" className="btn-secondary">Book Another Tour</Link>
      </div>

      <p className="text-muted text-xs mt-6">Questions? Call <a href="tel:+919848323488" className="text-teal">+91 98483 23488</a> or WhatsApp us.</p>
    </div>
  )
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

function BookingWizardWithSteps() {
  const searchParams = useSearchParams()
  const initSlug = searchParams.get('package') ?? ''
  const [step, setStep] = useState(initSlug ? 1 : 0)

  return (
    <div>
      <StepIndicator current={step} />
      <div className="card p-6 sm:p-8">
        <BookingWizardContent step={step} setStep={setStep} initSlug={initSlug} />
      </div>
    </div>
  )
}

// Extract wizard content to support setStep from parent
function BookingWizardContent({ step, setStep, initSlug }: { step: number; setStep: (s: number) => void; initSlug: string }) {
  const [pkg, setPkg] = useState(ALL_PACKAGES.find(p => p.slug === initSlug) ?? null)
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [passengers, setPassengers] = useState<{ name: string; age: string; id: string }[]>([{ name: '', age: '', id: '' }, { name: '', age: '', id: '' }])
  const [contact, setContact] = useState({ name: '', phone: '', email: '' })
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [ticketId, setTicketId] = useState('')

  const totalGuests = adults + children
  const subtotal = pkg ? pkg.price * totalGuests : 0
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst

  useEffect(() => {
    const count = adults + children
    setPassengers(prev => Array.from({ length: count }, (_, i) => prev[i] ?? { name: '', age: '', id: '' }))
  }, [adults, children])

  if (step === 0) return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink mb-5">Select a Package</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {ALL_PACKAGES.filter(p => p.price).map(p => (
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
  )

  if (step === 1) return (
    <div>
      <button onClick={() => setStep(0)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Change package</button>
      <div className="card p-3 flex items-center gap-3 mb-5">
        <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={pkg!.image} alt={pkg!.name} fill className="object-cover" unoptimized />
        </div>
        <div><div className="font-semibold text-ink text-sm">{pkg!.name}</div><div className="text-teal font-bold text-sm">₹{pkg!.price.toLocaleString('en-IN')}/person</div></div>
      </div>
      <h2 className="font-display text-xl font-bold text-ink mb-4">Date & Guests</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Departure Date</label>
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
  )

  if (step === 2) return (
    <div>
      <button onClick={() => setStep(1)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="font-display text-xl font-bold text-ink mb-4">Passenger Details</h2>
      <div className="card p-4 mb-4">
        <h3 className="font-medium text-ink text-sm mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-teal" />Lead Contact</h3>
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
      <button onClick={() => setStep(3)} disabled={!contact.name || !contact.phone || !contact.email || passengers.some(p => !p.name)}
        className="btn-primary w-full justify-center disabled:opacity-50">Review Booking →</button>
    </div>
  )

  if (step === 3) return (
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
          <div key={k} className="flex justify-between text-sm gap-4"><span className="text-muted flex-shrink-0">{k}</span><span className="font-medium text-ink text-right">{v}</span></div>
        ))}
        <hr className="border-gray-100" />
        <div className="flex justify-between text-sm"><span className="text-muted">Fare ({totalGuests}×₹{pkg!.price.toLocaleString('en-IN')})</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted">GST 5%</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
        <hr className="border-gray-100" />
        <div className="flex justify-between font-bold"><span className="text-ink">Total</span><span className="text-teal text-xl">₹{total.toLocaleString('en-IN')}</span></div>
      </div>
      <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 mb-4">⏰ Free cancellation up to 48 hrs before departure. 50% charge within 24–48 hrs. No refund within 24 hrs.</div>
      <button onClick={() => setStep(4)} className="btn-primary w-full justify-center text-base py-3">
        <CreditCard className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')}
      </button>
    </div>
  )

  if (step === 4) return (
    <div>
      <button onClick={() => setStep(3)} className="flex items-center gap-1 text-muted text-sm mb-5 hover:text-ink"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="font-display text-xl font-bold text-ink mb-2">Secure Payment</h2>
      <p className="text-muted text-sm mb-5">Powered by Razorpay. UPI · Cards · Net Banking · Wallets.</p>
      <div className="card p-4 mb-4 flex justify-between items-center">
        <span className="text-muted text-sm">Amount to pay</span>
        <span className="font-display font-bold text-teal text-2xl">₹{total.toLocaleString('en-IN')}</span>
      </div>
      {payError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm mb-4 flex gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{payError}</div>}
      <button disabled={payLoading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
        onClick={async () => {
          setPayLoading(true); setPayError('')
          try {
            const holdRes = await fetch(`${API}/bookings/hold`, {
              method: 'POST', credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ packageSlug: pkg!.slug, departureDate: date, adults, children, contactName: contact.name, contactPhone: contact.phone, contactEmail: contact.email, passengers }),
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
            const rzp = new window.Razorpay({
              key: orderData.keyId, amount: orderData.amount, currency: 'INR',
              name: 'Aswini Godavari Travel', description: pkg!.name,
              image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png',
              order_id: orderData.orderId,
              prefill: { name: contact.name, email: contact.email, contact: contact.phone },
              theme: { color: '#168C8C' },
              handler: async (response: any) => {
                const vr = await fetch(`${API}/payments/verify`, {
                  method: 'POST', credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...response, bookingId: holdData.bookingId }),
                })
                const vd = await vr.json()
                if (!vr.ok) { setPayError(vd.message ?? 'Payment verification failed.'); return }
                setBookingRef(vd.bookingRef); setTicketId(vd.ticketId); setStep(5)
              },
            })
            rzp.on('payment.failed', (r: any) => { setPayError(r.error?.description ?? 'Payment failed.'); setPayLoading(false) })
            rzp.open()
          } catch (e: any) { setPayError(e.message ?? 'Something went wrong.') }
          finally { setPayLoading(false) }
        }}>
        {payLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><CreditCard className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')} Securely</>}
      </button>
      <div className="text-center text-xs text-muted mt-4">🔒 SSL encrypted · PCI-DSS compliant · Never stored on our servers</div>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  )

  // Step 5
  return (
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
        {ticketId && <p className="text-xs text-muted font-mono mt-1">{ticketId}</p>}
      </div>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/account/tickets" className="btn-primary"><Download className="w-4 h-4" /> My Tickets</Link>
        <Link href="/packages" className="btn-secondary">Book Another</Link>
      </div>
      <p className="text-muted text-xs mt-5">Questions? <a href="tel:+919848323488" className="text-teal">+91 98483 23488</a></p>
    </div>
  )
}
