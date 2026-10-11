'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Refund = {
  _id: string; bookingRef: string; amount: number; status: string
  requestedAt: string; processedAt?: string; utr?: string
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'PROCESSED') return <CheckCircle2 className="w-4 h-4 text-green-600" />
  if (status === 'FAILED') return <XCircle className="w-4 h-4 text-red-500" />
  return <Clock className="w-4 h-4 text-amber-500" />
}

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: 'Requested',
  APPROVED: 'Approved',
  INITIATED: 'Initiated',
  PROCESSING: 'Processing',
  PROCESSED: 'Processed',
  FAILED: 'Failed',
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/refunds/my`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setRefunds(d.refunds ?? []))
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
          <h1 className="font-display text-3xl font-bold text-ink mb-3">My Refunds</h1>
          <p className="text-muted text-sm mb-8">Refunds are processed to your original payment method within 5–7 business days.</p>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : refunds.length === 0 ? (
            <div className="card p-10 text-center">
              <RefreshCw className="w-14 h-14 text-muted/30 mx-auto mb-4" />
              <h2 className="font-display font-bold text-ink text-xl mb-2">No refunds</h2>
              <p className="text-muted">No refunds have been initiated for your account.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {refunds.map(r => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-sm text-muted mb-1">{r.bookingRef}</div>
                      <div className="font-display font-bold text-ink text-xl">₹{r.amount.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-muted mt-1">Requested: {new Date(r.requestedAt).toLocaleDateString('en-IN')}</div>
                      {r.processedAt && <div className="text-xs text-muted">Processed: {new Date(r.processedAt).toLocaleDateString('en-IN')}</div>}
                      {r.utr && <div className="text-xs text-muted font-mono mt-1">UTR: {r.utr}</div>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <StatusIcon status={r.status} />
                      <span className="text-sm font-medium text-ink">{STATUS_LABEL[r.status] ?? r.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center text-sm text-muted">
            Refund not arrived? Contact us at <a href="mailto:aswinigodavari@gmail.com" className="text-teal">aswinigodavari@gmail.com</a> or <a href="tel:+919848323488" className="text-teal">+91 98483 23488</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
