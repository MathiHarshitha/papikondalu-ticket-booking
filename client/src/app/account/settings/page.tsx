'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Bell, Shield, LogOut, Trash2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ email: true, sms: true, promo: false })
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    window.location.href = '/login'
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Account
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mb-8">Settings</h1>

          <div className="space-y-5">
            {/* Notifications */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink text-lg mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-teal" />Notifications</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email notifications', desc: 'Booking confirmations, tickets, and reminders' },
                  { key: 'sms', label: 'SMS notifications', desc: 'Departure reminders and check-in alerts' },
                  { key: 'promo', label: 'Promotional emails', desc: 'Special offers and new package announcements' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-ink text-sm">{label}</div>
                      <div className="text-muted text-xs">{desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key as keyof typeof notifs] ? 'bg-teal' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[key as keyof typeof notifs] ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-teal" />Security</h2>
              <p className="text-muted text-sm mb-4">Manage your password and account security settings.</p>
              <Link href="/account/profile" className="btn-secondary text-sm">Change Password →</Link>
            </div>

            {/* Logout */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-ink text-lg mb-4 flex items-center gap-2"><LogOut className="w-5 h-5 text-teal" />Session</h2>
              <p className="text-muted text-sm mb-4">Sign out of your account on this device.</p>
              <button onClick={logout} className="btn-secondary text-sm flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            {/* Delete account */}
            <div className="card p-6 border-red-200">
              <h2 className="font-display font-bold text-red-700 text-lg mb-2 flex items-center gap-2"><Trash2 className="w-5 h-5" />Delete Account</h2>
              <p className="text-muted text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="text-red-600 border border-red-300 rounded-xl px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors">
                  Delete My Account
                </button>
              ) : (
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-medium mb-3">Are you absolutely sure? All your bookings, tickets and data will be erased.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setConfirmDelete(false)} className="btn-secondary text-sm">Cancel</button>
                    <button className="bg-red-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors">
                      Yes, Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
