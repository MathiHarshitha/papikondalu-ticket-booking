import Link from 'next/link'
import { MessageCircle, Phone, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/djmcbqzqt/image/upload/c_scale,w_1920,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg"
          alt="Papikondalu River" fill className="object-cover" unoptimized
        />
        <div className="absolute inset-0 bg-river/85" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-3">
          Ready to Sail?
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
          Book Your Godavari<br />River Cruise Today
        </h2>
        <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
          From same-day boat rides to multi-day adventures — find the perfect Papikondalu
          experience and book directly with the operator.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/packages" className="btn-primary text-base px-8 py-4 w-full sm:w-auto justify-center">
            Browse All Packages <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://wa.me/919848323488"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors w-full sm:w-auto text-base"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp Us
          </a>
          <a
            href="tel:+919848323488"
            className="btn-outline-white text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
        <p className="text-white/50 text-xs mt-6">
          Support available daily 6:00 AM – 10:00 PM · aswinigodavari@gmail.com
        </p>
      </div>
    </section>
  )
}
