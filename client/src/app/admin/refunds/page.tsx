'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Refund = {
  _id: string; bookingRef: string; contactName: string; amount: number
  status: string; requestedAt: string; packageName: string
}

const STATUS_STYLE: Record<string, string> = {
  REQUESTED: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  PROCESSED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
}

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/admin/refunds`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setRefunds(d.refunds ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function approveRefund(id: string) {
    setProcessing(id)
    try {
      const r = await fetch(`${API}/admin/refunds/${id}/approve`, { method: 'POST', credentials: 'include' })
      if (r.ok) setRefunds(arr => arr.map(rf => rf._id === id ? { ...rf, status: 'APPROVED' } : rf))
      else alert((await r.json()).message ?? 'Failed')
    } catch { alert('Failed to approve refund') }
    finally { setProcessing(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">Refund Management</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Booking Ref', 'Customer', 'Package', 'Amount', 'Requested', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {refunds.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">No pending refunds</td></tr>
                  ) : refunds.map(rf => (
                    <tr key={rf._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-xs">{rf.bookingRef}</td>
                      <td className="px-4 py-3 font-medium text-ink">{rf.contactName}</td>
                      <td className="px-4 py-3 text-muted text-xs max-w-[160px]"><div className="truncate">{rf.packageName}</div></td>
                      <td className="px-4 py-3 font-bold text-ink">₹{rf.amount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-muted text-xs">{new Date(rf.requestedAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3"><span className={`badge text-xs ${STATUS_STYLE[rf.status] ?? 'bg-gray-100 text-gray-600'}`}>{rf.status}</span></td>
                      <td className="px-4 py-3">
                        {rf.status === 'REQUESTED' && (
                          <button onClick={() => approveRefund(rf._id)} disabled={processing === rf._id}
                            className="flex items-center gap-1 text-xs bg-teal text-white px-3 py-1.5 rounded-lg hover:bg-teal/90 disabled:opacity-50">
                            {processing === rf._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
