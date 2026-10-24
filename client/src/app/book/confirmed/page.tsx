'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Check, XCircle, Download, Phone } from 'lucide-react'

function ConfirmedContent() {
  const params = useSearchParams()
  const status = params.get('status')
  const ref = params.get('ref')
  const reason = params.get('reason') ?? ''

  const isSuccess = status === 'success'

  const failureMessage = reason === 'tampered'
    ? 'Payment data could not be verified. Please contact support.'
    : reason === 'not_found'
    ? 'Payment record not found. If money was debited, contact support immediately.'
    : reason === 'CANCEL' || reason === 'cancel'
    ? 'You cancelled the payment. You can try again any time.'
    : 'Your payment was not completed. Please try again.'

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
      {isSuccess ? (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Booking Confirmed!</h1>
          <p className="text-muted mb-1">Your seats are reserved. Check your email for your ticket.</p>
          {ref && (
            <p className="font-mono text-lg font-bold text-teal mt-3 mb-8 bg-teal/5 border border-teal/20 rounded-xl py-3 px-6 inline-block">
              {ref}
            </p>
          )}
          <div className="flex gap-3 justify-center flex-wrap mt-6">
            <Link href="/account/tickets" className="btn-primary">
              <Download className="w-4 h-4" /> View My Tickets
            </Link>
            <Link href="/packages" className="btn-secondary">Book Another Trip</Link>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Payment Not Completed</h1>
          <p className="text-muted mb-8">{failureMessage}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/book" className="btn-primary">Try Again</Link>
            <Link href="/packages" className="btn-secondary">Browse Packages</Link>
          </div>
        </>
      )}
      <p className="text-muted text-sm mt-10">
        Need help?{' '}
        <a href="tel:+919848323488" className="text-teal font-medium inline-flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" /> +91 98483 23488
        </a>
      </p>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-ivory">
        <Suspense fallback={<div className="text-center py-24 text-muted">Loading…</div>}>
          <ConfirmedContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
