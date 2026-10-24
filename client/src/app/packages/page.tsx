import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PackagesList from '@/components/packages/PackagesList'

export const metadata: Metadata = {
  title: 'Tour Packages',
  description:
    'Browse Papikondalu tour packages — one-day boat rides, two-day temple tours, night camping and waterfall adventures from Rajahmundry and Bhadrachalam.',
}

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Banner */}
        <div className="relative bg-river pt-28 pb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-teal to-river" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-3">Curated For You</div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              All Tour Packages
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Hand-crafted Godavari boat tours — from peaceful one-day cruises
              to adventurous multi-day wilderness stays.
            </p>
          </div>
        </div>
        <PackagesList />
      </main>
      <Footer />
    </>
  )
}
