'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, TrendingUp, IndianRupee, Users, BookOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#6366f1']

type RevenueMonth = { _id: { year: number; month: number }; revenue: number; count: number }
type StatusCount = { _id: string; count: number }
type TopPackage = { _id: string; revenue: number; count: number }

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [revenueByMonth, setRevenueByMonth] = useState<RevenueMonth[]>([])
  const [bookingsByStatus, setBookingsByStatus] = useState<StatusCount[]>([])
  const [topPackages, setTopPackages] = useState<TopPackage[]>([])
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/reports`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/admin/metrics`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([r, m]) => {
      setRevenueByMonth(r.revenueByMonth ?? [])
      setBookingsByStatus(r.bookingsByStatus ?? [])
      setTopPackages(r.topPackages ?? [])
      setMetrics(m)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const chartData = revenueByMonth.map(m => ({
    month: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
    revenue: m.revenue,
    bookings: m.count,
  }))

  const pieData = bookingsByStatus.map(s => ({ name: s._id, value: s.count }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">Reports</h1>
        </div>

        {/* Summary cards */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: metrics.totalBookings?.toLocaleString(), icon: BookOpen, color: 'text-river' },
              { label: 'This Month Revenue', value: `₹${(metrics.monthRevenue ?? 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-teal' },
              { label: 'Total Customers', value: metrics.totalUsers?.toLocaleString(), icon: Users, color: 'text-forest' },
              { label: 'Pending Refunds', value: metrics.pendingRefunds?.toLocaleString(), icon: TrendingUp, color: 'text-amber-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted font-medium">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue chart */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="font-semibold text-ink mb-4">Revenue (Last 6 Months)</h2>
            {chartData.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">No revenue data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Booking status pie */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink mb-4">Bookings by Status</h2>
            {pieData.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top packages */}
        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-4">Top Packages by Revenue</h2>
          {topPackages.length === 0 ? (
            <p className="text-muted text-sm text-center py-4">No data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {['Package', 'Bookings', 'Revenue'].map(h => (
                      <th key={h} className="pb-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topPackages.map((p, i) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-ink">{p._id || 'Unknown'}</td>
                      <td className="py-3 text-muted">{p.count}</td>
                      <td className="py-3 font-semibold text-teal">₹{p.revenue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
