'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Reset failed.')
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="text-red-500 text-5xl mb-4">✕</div>
        <h1 className="font-display text-2xl font-bold text-ink mb-2">Invalid Link</h1>
        <p className="text-muted text-sm mb-6">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="btn-primary w-full justify-center">Request a new link</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-14 h-14 text-teal mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-ink mb-2">Password Reset!</h1>
        <p className="text-muted text-sm mb-6">Your password has been updated. Redirecting you to login…</p>
        <Link href="/login" className="btn-primary w-full justify-center">Go to Login</Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-1">Set New Password</h1>
        <p className="text-muted text-sm">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field pl-10 pr-10"
              placeholder="Min. 8 characters"
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="input-field pl-10"
              placeholder="Repeat your password"
            />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{error}</div>}

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-50">
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_900,h_1200,q_auto,f_auto/v1755980790/Papikondalu_03_zyuwnr.jpg"
          alt="Papikondalu" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-br from-river/80 to-ink/60 flex flex-col justify-end p-12">
          <div className="text-white">
            <div className="font-display text-3xl font-bold mb-2">Reset Password</div>
            <p className="text-white/70">Enter your new password to regain access.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-ivory">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-muted text-sm mb-8 hover:text-teal transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
          <Suspense fallback={<div className="text-muted text-sm">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
