'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const STAFF_ROLES = ['ADMIN', 'SUPER_ADMIN', 'BOOKING_MANAGER', 'CHECKIN_STAFF', 'CONTENT_MANAGER']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }
    if (!STAFF_ROLES.includes(user.role)) {
      router.replace('/account')
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-river border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !STAFF_ROLES.includes(user.role)) return null

  return <>{children}</>
}
