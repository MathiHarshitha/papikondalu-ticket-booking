'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { User, Phone, Mail, Lock, Save, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [error, setError] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.user) setProfile({ name: d.user.name, email: d.user.email, phone: d.user.phone ?? '' }) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const r = await fetch(`${API}/users/me`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      })
      if (!r.ok) throw new Error((await r.json()).message ?? 'Failed to save')
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault(); setPwError('')
    if (passwords.newPw !== passwords.confirm) { setPwError('New passwords do not match'); return }
    if (passwords.newPw.length < 8) { setPwError('Password must be at least 8 characters'); return }
    setChangingPw(true)
    try {
      const r = await fetch(`${API}/auth/change-password`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPw }),
      })
      if (!r.ok) throw new Error((await r.json()).message ?? 'Failed to change password')
      setPasswords({ current: '', newPw: '', confirm: '' })
      setPwSaved(true); setTimeout(() => setPwSaved(false), 4000)
    } catch (e: any) { setPwError(e.message) }
    finally { setChangingPw(false) }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Account
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mb-8">My Profile</h1>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : (
            <div className="space-y-6">
              {/* Profile form */}
              <form onSubmit={saveProfile} className="card p-6">
                <h2 className="font-display font-bold text-ink text-lg mb-5 flex items-center gap-2"><User className="w-5 h-5 text-teal" />Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
                    <input className="input-field" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email Address</label>
                    <input className="input-field bg-gray-50 cursor-not-allowed" value={profile.email} readOnly title="Email cannot be changed" />
                    <p className="text-xs text-muted mt-1">Email address cannot be changed. Contact support if needed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Mobile Number</label>
                    <input className="input-field" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3 mt-4">{error}</div>}
                <div className="flex items-center gap-3 mt-5">
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                  </button>
                  {saved && <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4" />Saved!</span>}
                </div>
              </form>

              {/* Password form */}
              <form onSubmit={changePassword} className="card p-6">
                <h2 className="font-display font-bold text-ink text-lg mb-5 flex items-center gap-2"><Lock className="w-5 h-5 text-teal" />Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Current Password</label>
                    <input className="input-field" type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="Current password" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">New Password</label>
                    <input className="input-field" type="password" value={passwords.newPw} onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))} placeholder="Min 8 characters" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Confirm New Password</label>
                    <input className="input-field" type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" required />
                  </div>
                </div>
                {pwError && <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3 mt-4">{pwError}</div>}
                <div className="flex items-center gap-3 mt-5">
                  <button type="submit" disabled={changingPw} className="btn-primary disabled:opacity-50">
                    {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Update Password
                  </button>
                  {pwSaved && <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4" />Password updated!</span>}
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
