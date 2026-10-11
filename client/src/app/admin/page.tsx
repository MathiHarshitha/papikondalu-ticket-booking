import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <AdminDashboard />
    </>
  )
}
