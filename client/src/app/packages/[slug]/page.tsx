import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PackageDetail from '@/components/packages/PackageDetail'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

async function fetchPackage(slug: string) {
  try {
    const res = await fetch(`${API}/packages/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    const p = data.package
    if (!p) return null
    return {
      name: p.title ?? '',
      subtitle: p.subtitle ?? '',
      duration: p.duration ?? '',
      from: (p.departureLocations ?? [])[0] ?? '',
      capacity: p.maxCapacity ?? 0,
      price: p.adultPrice ?? null,
      season: p.bestSeason ?? '',
      description: p.description ?? '',
      image: p.coverImage || (p.images ?? [])[0] || '',
      highlights: p.highlights ?? [],
      itinerary: p.itinerary ?? [],
      inclusions: p.inclusions ?? [],
      exclusions: p.exclusions ?? [],
      policy: p.cancellationPolicy ?? '',
    }
  } catch {
    return null
  }
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const pkg = await fetchPackage(slug)
  if (!pkg) return { title: 'Package Not Found' }
  return {
    title: pkg.name,
    description: pkg.description.slice(0, 160),
  }
}

export default async function PackageDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const pkg = await fetchPackage(slug)
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PackageDetail slug={slug} pkg={pkg} />
      </main>
      <Footer />
    </>
  )
}
