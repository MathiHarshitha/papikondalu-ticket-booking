'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid or missing verification link.')
      return
    }

    fetch(`${API}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully.')
        } else {
          setStatus('error')
          setMessage(data.message || 'Invalid or expired verification link.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [token])

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Loader2 className="w-14 h-14 text-teal mx-auto mb-4 animate-spin" />
        <h1 className="font-display text-2xl font-bold text-ink mb-2">Verifying your email…</h1>
        <p className="text-muted text-sm">Please wait a moment.</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <CheckCircle2 className="w-14 h-14 text-teal mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-ink mb-2">Email Verified!</h1>
        <p className="text-muted text-sm mb-6">{message} You can now log in to your account.</p>
        <Link href="/login" className="btn-primary w-full justify-center">Go to Login</Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Verification Failed</h1>
      <p className="text-muted text-sm mb-6">{message}</p>
      <Link href="/register" className="btn-primary w-full justify-center">Register again</Link>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_900,h_1200,q_auto,f_auto/v1755980790/Papikondalu_03_zyuwnr.jpg"
          alt="Papikondalu" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-br from-river/80 to-ink/60 flex flex-col justify-end p-12">
          <div className="text-white">
            <div className="font-display text-3xl font-bold mb-2">Email Verification</div>
            <p className="text-white/70">Confirming your account with Aswini Godavari Travel.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-ivory">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-muted text-sm text-center">Loading…</div>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
