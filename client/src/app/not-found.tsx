import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Page Not Found | Aswini Godavari Travel & Tourism' }

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 text-center pt-20">
        <div className="max-w-md w-full">
          <div className="text-8xl font-display font-bold text-teal/20 mb-4">404</div>
          <h1 className="font-display text-2xl font-bold text-ink mb-3">Page Not Found</h1>
          <p className="text-muted mb-8">
            The page you&#39;re looking for doesn&#39;t exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="btn-primary">Back to Home</Link>
            <Link href="/packages" className="btn-secondary">View Packages</Link>
          </div>
          <p className="text-muted text-sm mt-8">
            Need help?{' '}
            <a href="tel:+919848323488" className="text-teal font-medium">+91 98483 23488</a>
            {' · '}
            <Link href="/contact" className="text-teal font-medium">Contact Us</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
