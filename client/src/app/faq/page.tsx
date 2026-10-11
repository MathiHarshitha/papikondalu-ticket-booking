import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FAQSection from '@/components/home/FAQSection'
import Link from 'next/link'
import { Phone, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Papikondalu boat tours — pricing, safety, cancellations, boarding and more.',
}

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory">
        <div className="bg-river py-14 text-center text-white">
          <h1 className="font-display text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-white/70">Everything you need to know about Papikondalu boat tours</p>
        </div>
        <FAQSection />
        <div className="bg-white py-10 text-center border-t border-gray-100">
          <p className="text-muted text-sm mb-4">Can&apos;t find your answer? We&apos;re here to help.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/919848323488" className="btn-primary"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
            <a href="tel:+919848323488" className="btn-secondary"><Phone className="w-4 h-4" /> Call Us</a>
            <Link href="/contact" className="btn-secondary">Send Enquiry</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
