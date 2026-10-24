'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Search, UserCheck, UserX, Shield } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type User = {
  _id: string; name: string; email: string; phone: string
  role: string; isActive: boolean; emailVerified: boolean; createdAt: string
}

const ROLES = ['CUSTOMER', 'CHECKIN_STAFF', 'BOOKING_MANAGER', 'CONTENT_MANAGER', 'ADMIN', 'SUPER_ADMIN']
const ROLE_STYLE: Record<string, string> = {
  CUSTOMER: 'bg-gray-100 text-gray-600',
  CHECKIN_STAFF: 'bg-blue-100 text-blue-700',
  BOOKING_MANAGER: 'bg-purple-100 text-purple-700',
  CONTENT_MANAGER: 'bg-cyan-100 text-cyan-700',
  ADMIN: 'bg-amber-100 text-amber-700',
  SUPER_ADMIN: 'bg-red-100 text-red-700',
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (search) qs.set('search', search)
    if (roleFilter) qs.set('role', roleFilter)
    fetch(`${API}/admin/users?${qs}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, roleFilter])

  useEffect(() => { load() }, [load])

  const updateRole = async (id: string, role: string) => {
    setUpdatingId(id)
    await fetch(`${API}/admin/users/${id}/role`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    setUpdatingId(null)
    load()
  }

  const toggleActive = async (user: User) => {
    setUpdatingId(user._id)
    await fetch(`${API}/admin/users/${user._id}/status`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !user.isActive }),
    })
    setUpdatingId(null)
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">Customers</h1>
          <span className="text-xs text-muted bg-gray-100 px-2 py-0.5 rounded-full">{users.length}</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="card flex-1 min-w-[200px]">
            <div className="p-3 flex items-center gap-2 border-b border-gray-100">
              <Search className="w-4 h-4 text-muted" />
              <input className="flex-1 bg-transparent outline-none text-sm text-ink placeholder-muted"
                placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <select className="input-field min-w-[160px]" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Role', 'Verified', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted">No users found</td></tr>
                  ) : users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                      <td className="px-4 py-3 text-muted text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-muted">{u.phone}</td>
                      <td className="px-4 py-3">
                        {updatingId === u._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted" />
                        ) : (
                          <select
                            value={u.role}
                            onChange={e => updateRole(u._id, e.target.value)}
                            className={`badge text-xs border-0 cursor-pointer ${ROLE_STYLE[u.role] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${u.emailVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {u.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {u.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(u)} title={u.isActive ? 'Block user' : 'Unblock user'}
                          className={`${u.isActive ? 'text-red-500 hover:text-red-400' : 'text-green-600 hover:text-green-500'}`}>
                          {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
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
