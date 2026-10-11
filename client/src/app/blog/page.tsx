import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Travel Blog',
  description: 'Papikondalu and Godavari river travel guides, tips, and stories from our team.',
}

const posts = [
  {
    slug: 'papikondalu-bhadradri-magical-beauty',
    title: 'Discover the Magical Beauty of Papikondalu Hills and Bhadradri Temples',
    excerpt: 'A comprehensive guide to combining Papikondalu boat tours with a visit to the sacred Bhadrachalam temple — two of Andhra Pradesh\'s greatest natural and spiritual destinations in one unforgettable trip.',
    date: 'December 2024',
    readTime: '8 min read',
    category: 'Travel Guide',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="bg-river py-14 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Travel Stories</div>
          <h1 className="font-display text-4xl font-bold mb-2">Godavari Travel Blog</h1>
          <p className="text-white/70">Guides, tips and stories from our team on the river</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card group flex flex-col">
                <div className="relative h-52 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-sunset text-white">{post.category}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex gap-3 text-xs text-muted mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h2 className="font-display font-semibold text-ink text-lg leading-snug mb-2 group-hover:text-teal transition-colors line-clamp-3">
                    {post.title}
                  </h2>
                  <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="mt-auto flex items-center gap-1 text-teal text-sm font-medium">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
