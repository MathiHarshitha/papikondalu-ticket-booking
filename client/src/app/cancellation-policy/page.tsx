import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { CheckCircle2, XCircle, AlertCircle, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description: 'Aswini Godavari Travel cancellation and refund policy for Papikondalu boat tour packages.',
}

const tiers = [
  { timing: 'More than 48 hours before departure', refund: '100% Full Refund', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  { timing: '24 to 48 hours before departure', refund: '50% Partial Refund', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { timing: 'Less than 24 hours before departure', refund: 'No Refund', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
]

export default function CancellationPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="bg-river py-12 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Legal</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Cancellation Policy</h1>
          <p className="text-white/70 mt-2 text-sm">Effective January 2024 · Aswini Godavari Travel & Tourism</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          {/* Refund table */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-6">Cancellation Tiers</h2>
            <div className="space-y-4">
              {tiers.map(t => {
                const Icon = t.icon
                return (
                  <div key={t.timing} className={`flex items-start gap-4 rounded-xl p-4 ${t.bg}`}>
                    <Icon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${t.color}`} />
                    <div>
                      <div className="font-semibold text-ink">{t.timing}</div>
                      <div className={`font-bold text-lg ${t.color}`}>{t.refund}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Weather & operator cancellations */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Weather & Operator Cancellations</h2>
            <p className="text-muted leading-relaxed mb-3">
              If a tour is cancelled by Aswini Godavari Travel due to adverse weather conditions, high river water levels,
              government orders, force majeure, or any other factor beyond our control, customers will receive:
            </p>
            <ul className="space-y-2 text-ink/80">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /><span><strong>Full refund</strong> of the amount paid, or</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /><span><strong>Free reschedule</strong> to the next available departure of the same package</span></li>
            </ul>
            <p className="text-muted text-sm mt-3">The customer's choice between refund and reschedule will be honoured within 2 business days of notification.</p>
          </section>

          {/* How to cancel */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-4">How to Cancel</h2>
            <ol className="space-y-3 text-ink/80">
              <li className="flex gap-3"><span className="bg-teal text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span><span>Log in to your account and go to <Link href="/account/bookings" className="text-teal underline">My Bookings</Link>.</span></li>
              <li className="flex gap-3"><span className="bg-teal text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span><span>Find the booking you wish to cancel and click <strong>Cancel Booking</strong>.</span></li>
              <li className="flex gap-3"><span className="bg-teal text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span><span>Confirm the cancellation — a cancellation request number will be sent to your registered email.</span></li>
              <li className="flex gap-3"><span className="bg-teal text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span><span>Refunds are processed to the original payment method within <strong>5–7 business days</strong>.</span></li>
            </ol>
            <p className="text-muted text-sm mt-4">
              For urgent cancellations, call us directly at{' '}
              <a href="tel:+919848323488" className="text-teal font-medium">+91 98483 23488</a>.
            </p>
          </section>

          {/* Non-refundable */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Non-Refundable Items</h2>
            <ul className="space-y-2 text-ink/80 text-sm">
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />Payment gateway convenience fees (if any) charged at the time of booking</li>
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />Any third-party expenses (hotel bookings, transport arranged separately)</li>
              <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />No-shows (no notification before the departure time)</li>
            </ul>
          </section>

          {/* Contact */}
          <div className="bg-river rounded-2xl p-6 text-white text-center">
            <Phone className="w-8 h-8 mx-auto mb-3 text-sunset" />
            <h3 className="font-display font-bold text-lg mb-1">Questions about your cancellation?</h3>
            <p className="text-white/70 text-sm mb-4">Our team is available 9 AM – 7 PM, 7 days a week.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="tel:+919848323488" className="btn-primary text-sm">Call +91 98483 23488</a>
              <a href="mailto:aswinigodavari@gmail.com" className="btn-outline-white text-sm">Email Us</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
