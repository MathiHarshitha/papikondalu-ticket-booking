'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/packages', children: [
    { label: 'Rajahmundry One Day', href: '/packages/rajahmundry-papikondalu-packages' },
    { label: 'Bhadrachalam Two Day', href: '/packages/bhadrachalam-papikondalu-packages' },
    { label: 'Sirivaka Night Stay', href: '/packages/sirivaka-night-stay-package' },
    { label: 'Maredumilli Waterfalls', href: '/packages/maredumilli-packages' },
    { label: 'View All Packages', href: '/packages' },
  ]},
  { label: 'Attractions', href: '/attractions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-10 h-10">
            <Image
              src="https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png"
              alt="Aswini Godavari Travel Logo"
              fill className="object-contain"
              unoptimized
            />
          </div>
          <div className="leading-tight">
            <div className={`font-display font-bold text-sm leading-none ${scrolled ? 'text-river' : 'text-white'}`}>
              Aswini Godavari
            </div>
            <div className={`text-xs font-medium ${scrolled ? 'text-teal' : 'text-white/80'}`}>
              Travel & Tourism
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setDropdown(link.href)}
              onMouseLeave={() => setDropdown(null)}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  scrolled
                    ? 'text-ink hover:text-teal hover:bg-teal/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
              </Link>

              {link.children && dropdown === link.href && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {link.children.map(child => (
                    <Link
                      key={child.href} href={child.href}
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-teal/5 hover:text-teal transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+919848323488"
            className={`flex items-center gap-1.5 text-sm font-medium ${scrolled ? 'text-teal' : 'text-white/90'}`}
          >
            <Phone className="w-4 h-4" />
            +91 98483 23488
          </a>
          <Link href="/packages" className="btn-primary text-sm px-4 py-2">
            Book Now
          </Link>
          <Link href="/login" className={`text-sm font-medium ${scrolled ? 'text-ink/70 hover:text-ink' : 'text-white/70 hover:text-white'} transition-colors`}>
            Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-ink' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href} href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-ink hover:bg-teal/5 hover:text-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <a href="tel:+919848323488" className="flex items-center gap-2 px-4 py-2 text-teal font-medium text-sm">
                <Phone className="w-4 h-4" /> +91 98483 23488
              </a>
              <Link href="/packages" onClick={() => setOpen(false)} className="btn-primary w-full justify-center text-sm">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
