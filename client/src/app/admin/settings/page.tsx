'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Check, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) {
      setMsg({ type: 'err', text: 'New passwords do not match' })
      return
    }
    if (pwForm.next.length < 8) {
      setMsg({ type: 'err', text: 'Password must be at least 8 characters' })
      return
    }
    setSaving(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/auth/change-password`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      })
      const d = await r.json()
      if (r.ok) {
        setMsg({ type: 'ok', text: 'Password changed successfully' })
        setPwForm({ current: '', next: '', confirm: '' })
      } else {
        setMsg({ type: 'err', text: d.message ?? 'Failed to change password' })
      }
    } catch {
      setMsg({ type: 'err', text: 'Network error' })
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
        </div>

        {/* Admin profile */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-ink mb-4">Admin Profile</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-river/10 flex items-center justify-center text-river font-bold text-xl">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div>
              <div className="font-semibold text-ink">{user?.name ?? '—'}</div>
              <div className="text-sm text-muted">{user?.email}</div>
              <span className="badge text-xs bg-red-100 text-red-700 mt-1">{user?.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted font-medium mb-0.5">Email</div>
              <div className="text-ink">{user?.email ?? '—'}</div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-0.5">Phone</div>
              <div className="text-ink">{(user as any)?.phone ?? '—'}</div>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-ink mb-4">Change Password</h2>
          {msg && (
            <div className={`text-sm px-3 py-2 rounded-lg mb-4 ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.text}
            </div>
          )}
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Current Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-10" value={pwForm.current}
                  onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} required />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">New Password</label>
              <input type={showPw ? 'text' : 'password'} className="input-field" value={pwForm.next}
                onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} required minLength={8} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Confirm New Password</label>
              <input type={showPw ? 'text' : 'password'} className="input-field" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required minLength={8} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Change Password
            </button>
          </form>
        </div>

        {/* Environment info */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'API URL', value: API },
              { label: 'Environment', value: process.env.NODE_ENV ?? 'production' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-muted">{label}</span>
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-ink">{value}</code>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted">
            To update site settings like PayU keys, Cloudinary config and email credentials,
            edit the <code className="bg-gray-100 px-1 rounded">server/.env</code> file and restart the server.
          </div>
        </div>
      </div>
    </div>
  )
}
