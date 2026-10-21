'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, UserCircle, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

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
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const { user, setUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Transparent hero only on homepage; solid on all other pages
  const transparent = isHomePage && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
    setProfileOpen(false)
    window.location.href = '/'
  }

  // Close dropdown when route changes
  useEffect(() => { setOpen(false); setDropdown(null) }, [pathname])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent py-4' : 'bg-white shadow-md py-2'
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
            <div className={`font-display font-bold text-sm leading-none ${transparent ? 'text-white' : 'text-river'}`}>
              Aswini Godavari
            </div>
            <div className={`text-xs font-medium ${transparent ? 'text-white/80' : 'text-teal'}`}>
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
                  transparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-ink hover:text-teal hover:bg-teal/5'
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
            className={`flex items-center gap-1.5 text-sm font-medium ${transparent ? 'text-white/90' : 'text-teal'}`}
          >
            <Phone className="w-4 h-4" />
            +91 98483 23488
          </a>
          <Link href="/packages" className="btn-primary text-sm px-4 py-2">
            Book Now
          </Link>
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className={`flex items-center gap-2 text-sm font-medium ${transparent ? 'text-white/90 hover:text-white' : 'text-ink hover:text-teal'} transition-colors`}
              >
                <UserCircle className="w-7 h-7" />
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-semibold text-ink truncate">{user.name}</div>
                    <div className="text-xs text-muted truncate">{user.email}</div>
                  </div>
                  <Link href="/account" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-ink hover:bg-teal/5 hover:text-teal transition-colors">My Bookings</Link>
                  <Link href="/account/tickets" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-ink hover:bg-teal/5 hover:text-teal transition-colors">My Tickets</Link>
                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                    <Link href="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-ink hover:bg-teal/5 hover:text-teal transition-colors">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={`text-sm font-medium ${transparent ? 'text-white/70 hover:text-white' : 'text-ink/70 hover:text-ink'} transition-colors`}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-ink'}`}
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
              {user ? (
                <>
                  <Link href="/account" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-ink hover:text-teal">
                    <UserCircle className="inline w-4 h-4 mr-2" />{user.name}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 font-medium">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-ink hover:text-teal">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
