'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_900,h_1200,q_auto,f_auto/v1755980790/Papikondalu_03_zyuwnr.jpg"
          alt="Papikondalu" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-br from-river/80 to-ink/60 flex flex-col justify-end p-12">
          <div className="text-white">
            <div className="font-display text-3xl font-bold mb-2">Recover Access</div>
            <p className="text-white/70">We'll send a password reset link to your email.</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-ivory">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-muted text-sm mb-8 hover:text-teal transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          {submitted ? (
            <div className="text-center">
              <CheckCircle2 className="w-14 h-14 text-teal mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold text-ink mb-2">Check your email</h1>
              <p className="text-muted text-sm leading-relaxed mb-6">
                If <strong>{email}</strong> is registered with us, you'll receive a password reset link within a few minutes.
                Check your spam folder if you don't see it.
              </p>
              <Link href="/login" className="btn-primary w-full justify-center">Return to login</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-ink mb-1">Forgot Password?</h1>
                <p className="text-muted text-sm">Enter your account email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="input-field pl-10" placeholder="you@email.com" />
                  </div>
                </div>

                {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{error}</div>}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-50">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-muted text-sm mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-teal font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
