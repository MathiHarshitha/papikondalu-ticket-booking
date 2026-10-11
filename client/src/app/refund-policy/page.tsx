import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy and timeline for Papikondalu boat tour cancellations.',
}

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="bg-river py-12 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Legal</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Refund Policy</h1>
          <p className="text-white/70 mt-2 text-sm">Effective January 2024 · Aswini Godavari Travel & Tourism</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          {/* Overview */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-3">Overview</h2>
            <p className="text-ink/80 leading-relaxed text-sm">
              We aim to make the refund process as simple and transparent as possible. Refunds are issued to the original
              payment method (UPI, card, or net banking) and processed by Razorpay. The time it takes for funds to appear
              in your account depends on your bank's processing time, which is outside our control.
            </p>
          </div>

          {/* Timeline */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-5">Refund Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-ink">Refund initiated within 2 business days</div>
                  <div className="text-muted text-sm">After your cancellation is confirmed, we raise the refund with Razorpay within 2 working days.</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-ink">Credit to your account: 5–7 business days</div>
                  <div className="text-muted text-sm">UPI refunds typically arrive in 1–3 days. Card or net banking refunds take 5–7 business days depending on your bank.</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <AlertCircle className="w-5 h-5 text-sunset mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-ink">International cards</div>
                  <div className="text-muted text-sm">Refunds to international cards may take 7–14 business days and may be subject to currency conversion differences.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Amounts */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-4">Refund Amounts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-semibold text-ink">Cancellation Timing</th>
                    <th className="text-left py-2 font-semibold text-ink">Refund Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr><td className="py-3 pr-4 text-muted">More than 48 hours before departure</td><td className="py-3 font-semibold text-green-700">100% of booking amount</td></tr>
                  <tr><td className="py-3 pr-4 text-muted">24–48 hours before departure</td><td className="py-3 font-semibold text-amber-700">50% of booking amount</td></tr>
                  <tr><td className="py-3 pr-4 text-muted">Less than 24 hours before departure</td><td className="py-3 font-semibold text-red-700">No refund</td></tr>
                  <tr><td className="py-3 pr-4 text-muted">Operator-cancelled (weather / force majeure)</td><td className="py-3 font-semibold text-green-700">100% or free reschedule</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted text-xs mt-4">Payment gateway convenience fees (if applicable) are not refundable in any scenario.</p>
          </div>

          {/* Track refund */}
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-3">Track Your Refund</h2>
            <p className="text-ink/80 text-sm leading-relaxed mb-3">
              Once your refund is processed, you will receive an email confirmation with the refund reference number.
              You can also track your refund status in real time at{' '}
              <a href="/account/refunds" className="text-teal underline">My Account → Refunds</a>.
            </p>
            <p className="text-muted text-sm">
              If your refund has not arrived within the stated timeline, contact us at{' '}
              <a href="mailto:aswinigodavari@gmail.com" className="text-teal">aswinigodavari@gmail.com</a>{' '}
              or call <a href="tel:+919848323488" className="text-teal">+91 98483 23488</a> with your booking reference number.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
