'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Login failed'); return }
      window.location.href = '/account'
    } catch {
      setError('Network error. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left panel — image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_900,h_1200,q_auto,f_auto/v1755976642/1b45e060-bfee-4be1-85f4-51c2c6430c70_itqkts.jpg"
          alt="Papikondalu" fill className="object-cover" unoptimized
        />
        <div className="absolute inset-0 bg-river/60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <Image src="https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png"
            alt="Logo" width={64} height={64} className="mb-6 rounded-full bg-white/10 p-2" unoptimized />
          <h2 className="font-display text-3xl font-bold text-center mb-3">Welcome Back</h2>
          <p className="text-white/70 text-center max-w-xs">
            Sign in to manage your bookings, download tickets and track your Godavari adventure.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link href="/">
              <Image src="https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png"
                alt="Logo" width={52} height={52} className="mx-auto mb-3 rounded-full bg-river/10 p-1" unoptimized />
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-ink mb-1">Sign In</h1>
          <p className="text-muted text-sm mb-8">
            Don&apos;t have an account? <Link href="/register" className="text-teal font-medium hover:underline">Register free</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Email Address</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="your@email.com" className="input-field" autoComplete="email" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-muted font-medium">Password</label>
                <Link href="/forgot-password" className="text-xs text-teal hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input required type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••" className="input-field pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Signing in...' : <><LogIn className="w-4 h-4" /> Sign In</>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-sm text-muted hover:text-ink flex items-center justify-center gap-1">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
