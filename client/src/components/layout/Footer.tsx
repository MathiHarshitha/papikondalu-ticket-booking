import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'

const packages = [
  { label: 'Rajahmundry One Day', href: '/packages/rajahmundry-papikondalu-packages' },
  { label: 'Bhadrachalam Two Day', href: '/packages/bhadrachalam-papikondalu-packages' },
  { label: 'Sirivaka Night Stay', href: '/packages/sirivaka-night-stay-package' },
  { label: 'Maredumilli Waterfalls', href: '/packages/maredumilli-packages' },
  { label: 'Parnasala Temple Tour', href: '/packages/parnasala-packages' },
  { label: 'Perantalapalli Eco Tour', href: '/packages/perantalapalli-packages' },
]

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Attractions', href: '/attractions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
]

const policies = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Cancellation Policy', href: '/cancellation-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
]

export default function Footer() {
  return (
    <footer className="bg-river text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 bg-white rounded-full p-1">
                <Image
                  src="https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png"
                  alt="Aswini Godavari Travel"
                  fill className="object-contain p-1"
                  unoptimized
                />
              </div>
              <div>
                <div className="font-display font-bold text-white leading-tight">Aswini Godavari</div>
                <div className="text-white/60 text-xs">Travel & Tourism</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Trusted Papikondalu boat tour operator since 2004. Serving 7 lakh+ travellers
              with safe, memorable Godavari river cruises from Rajahmundry & Bhadrachalam.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://www.facebook.com/profile.php?id=61579935625167', icon: Facebook },
                { href: 'https://www.instagram.com/aswinigodavari_travel/', icon: Instagram },
                { href: 'https://www.youtube.com/channel/UCzqJxEIGKQyIi9-EkCfR5ng', icon: Youtube },
                { href: 'https://wa.me/919848323488', icon: MessageCircle },
              ].map(({ href, icon: Icon }) => (
                <a
                  key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-sunset flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tour Packages</h3>
            <ul className="space-y-2.5">
              {packages.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/65 hover:text-sunset text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/65 hover:text-sunset text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-white mt-6 mb-4">Policies</h3>
            <ul className="space-y-2">
              {policies.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/65 hover:text-sunset text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-sunset flex-shrink-0 mt-0.5" />
                <span className="text-white/70">Rajahmundry, Andhra Pradesh 533101</span>
              </div>
              <div className="flex gap-3 text-sm">
                <Phone className="w-4 h-4 text-sunset flex-shrink-0" />
                <div>
                  <a href="tel:+919848323488" className="text-white hover:text-sunset block transition-colors">
                    +91 98483 23488
                  </a>
                  <span className="text-white/50 text-xs">Daily 6:00 AM – 10:00 PM</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <Mail className="w-4 h-4 text-sunset flex-shrink-0" />
                <a href="mailto:aswinigodavari@gmail.com" className="text-white/70 hover:text-sunset transition-colors">
                  aswinigodavari@gmail.com
                </a>
              </div>
            </div>
            <a
              href="https://wa.me/919848323488"
              target="_blank" rel="noopener noreferrer"
              className="mt-5 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-fit"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
            <div className="mt-5 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-white/60">
              <div className="font-medium text-white/80 mb-1">Best Season</div>
              October – March for calm river & clear skies
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <div>© {new Date().getFullYear()} Aswini Godavari Travel & Tourism. All rights reserved.</div>
          <div>Operating since 2004 · 7 lakh+ happy travellers</div>
        </div>
      </div>
    </footer>
  )
}
