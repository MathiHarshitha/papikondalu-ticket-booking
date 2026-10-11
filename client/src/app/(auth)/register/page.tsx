'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed'); return }
      setSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-sm border border-gray-100">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-ink mb-2">Account Created!</h2>
        <p className="text-muted mb-6">We&apos;ve sent a verification email to <strong>{form.email}</strong>. Please verify your email to activate your account.</p>
        <Link href="/login" className="btn-primary w-full justify-center">Sign In Now</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ivory flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_900,h_1200,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg"
          alt="Papikondalu" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-teal/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h2 className="font-display text-3xl font-bold text-center mb-3">Join 7 Lakh+ Travellers</h2>
          <p className="text-white/70 text-center max-w-xs">Create a free account to book Papikondalu boat tours, download tickets and manage your trips.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-center w-full max-w-xs">
            {['Instant digital tickets', 'Booking history', 'Easy cancellations', 'Email confirmations'].map(f => (
              <div key={f} className="bg-white/10 rounded-lg p-3 text-xs">{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <h1 className="font-display text-2xl font-bold text-ink mb-1">Create Account</h1>
          <p className="text-muted text-sm mb-8">
            Already have one? <Link href="/login" className="text-teal font-medium hover:underline">Sign in</Link>
          </p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Full Name *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Your full name" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Email Address *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="your@email.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Mobile Number *</label>
              <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="+91 98765 43210" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Password *</label>
              <div className="relative">
                <input required type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Min. 8 characters" className="input-field pr-10" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Confirm Password *</label>
              <input required type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}
                placeholder="Re-enter password" className="input-field" />
            </div>
            <p className="text-xs text-muted">
              By creating an account you agree to our{' '}
              <Link href="/terms-and-conditions" className="text-teal hover:underline">Terms</Link> and{' '}
              <Link href="/privacy-policy" className="text-teal hover:underline">Privacy Policy</Link>.
            </p>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Creating account...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted hover:text-ink">← Back to homepage</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
