'use client'
import Link from 'next/link'
import { ArrowLeft, Package, ImageIcon, FileText, Star, MapPin, ExternalLink } from 'lucide-react'

const sections = [
  {
    title: 'Tour Packages',
    icon: Package,
    description: 'Create and manage tour packages — add details, pricing, itinerary, inclusions and images.',
    href: '/admin/packages',
    action: 'Manage Packages',
    color: 'text-teal',
    bg: 'bg-teal/10',
  },
  {
    title: 'Boats & Departures',
    icon: Star,
    description: 'Add boats, schedule departure dates and times, and manage capacity for each tour.',
    href: '/admin/departures',
    action: 'Manage Departures',
    color: 'text-river',
    bg: 'bg-river/10',
  },
  {
    title: 'Departure Locations',
    icon: MapPin,
    description: 'Departure locations are managed as part of each package. Edit a package to update its boarding points.',
    href: '/admin/packages',
    action: 'Edit Packages',
    color: 'text-forest',
    bg: 'bg-forest/10',
  },
  {
    title: 'Site Images',
    icon: ImageIcon,
    description: 'Package images are uploaded via Cloudinary and stored per package. Edit a package to update its gallery.',
    href: '/admin/packages',
    action: 'Edit Packages',
    color: 'text-sunset',
    bg: 'bg-sunset/10',
  },
  {
    title: 'SEO Metadata',
    icon: FileText,
    description: 'SEO title and description are set per package. Edit any package to update its search engine metadata.',
    href: '/admin/packages',
    action: 'Edit Packages',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

export default function AdminContentPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Content</h1>
            <p className="text-sm text-muted">Manage all website content from here</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map(({ title, icon: Icon, description, href, action, color, bg }) => (
            <div key={title} className="card p-6 flex flex-col gap-4">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <h2 className="font-semibold text-ink mb-1">{title}</h2>
                <p className="text-sm text-muted">{description}</p>
              </div>
              <Link href={href} className="mt-auto btn-secondary text-sm py-2 flex items-center justify-center gap-1.5 w-fit">
                {action} <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <strong>Note:</strong> For advanced content like hero banners, FAQs, and testimonials, edit the corresponding
          React component files in <code className="bg-amber-100 px-1 rounded">client/src/components/</code>.
          Image uploads are handled via Cloudinary — set <code className="bg-amber-100 px-1 rounded">CLOUDINARY_URL</code> in your server <code className="bg-amber-100 px-1 rounded">.env</code>.
        </div>
      </div>
    </div>
  )
}
