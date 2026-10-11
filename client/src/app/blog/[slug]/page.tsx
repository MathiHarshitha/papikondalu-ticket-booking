import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Share2 } from 'lucide-react'

const POSTS: Record<string, {
  slug: string; title: string; date: string; readTime: string; category: string
  image: string; content: { h: string; p: string }[]
}> = {
  'papikondalu-bhadradri-magical-beauty': {
    slug: 'papikondalu-bhadradri-magical-beauty',
    title: 'Discover the Magical Beauty of Papikondalu Hills and Bhadradri Temples',
    date: 'December 2024',
    readTime: '8 min read',
    category: 'Travel Guide',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
    content: [
      {
        h: 'Where the Godavari Meets the Hills',
        p: `Papikondalu — literally "the hills of Papi" — is a 40-km gorge carved through the Eastern Ghats by the Godavari River. The gorge rises 600 to 900 metres on either side and shelters one of the last pristine sections of tropical forest on the river. Tribal communities of the Koya, Kondareddy and Valmiki peoples have inhabited these forests for centuries, and their settlements dot the steep hillsides. The experience of entering the gorge by boat from Rajahmundry or Bhadrachalam is unlike anything else in South India: the water turns dark green between the cliffs, and the forest reaches down to the waterline on both banks.`,
      },
      {
        h: 'Best Time to Visit Papikondalu',
        p: `October through February is ideal: the monsoon has ended, the river is full but calm, and the hills are draped in lush green. Temperatures range from 18°C to 28°C during this period. Summer (March–May) is hot but still enjoyable on the water; the river turns a deeper blue and boat capacity is unrestricted. Avoid the core monsoon (June–September): the Godavari can flood dangerously, and boat services are curtailed or suspended. If you want the waterfalls of Maredumilli at their most dramatic, visit in August–September when they run full — combine it with the tail of the monsoon if you are comfortable with unpredictable weather.`,
      },
      {
        h: 'Bhadrachalam: Sacred Shrine on the Godavari',
        p: `Bhadrachalam is a 2-hour boat ride from the Papikondalu gorge entrance. The Sri Sita Ramachandra Swamy temple here is one of the 108 Divya Desams of Vaishnava Hinduism, and the town is inseparable from the legend of the saint-composer Bhadrachala Ramadasu (1620–1688), who sold the Mughal governor's tax revenue to fund the temple's renovation and was imprisoned for it. The temple sits directly above the Godavari and is most spectacular when seen from the water at dawn, the gopuram catching the first light. Combine a Papikondalu cruise with a Bhadrachalam temple visit on a 2-day itinerary departing from Rajahmundry.`,
      },
      {
        h: 'The Boat Journey: What to Expect',
        p: `Aswini Godavari Travel operates double-deck tourist boats from Rajahmundry (Kadali Ghat) and from Bhadrachalam. The full Rajahmundry round-trip covers roughly 300 km and takes two days with a night halt on the Godavari bank. Meals are served on board or at the riverside camp. Along the way the boat stops at Perantalapalli (gateway to the gorge), Kolluru, and the Papikondalu village itself. You will pass through the narrow gorge at Papi Kondalu, where the boat slows to half speed, engines nearly silent, the cliffs rising on both sides. Tribal villagers paddle out in wooden dugouts to sell honey, tamarind and forest produce — this is an opportunity to buy directly and support the community.`,
      },
      {
        h: 'Parnasala: The Mythological Heart of the Forest',
        p: `A short detour from the main Papikondalu route brings you to Parnasala — the place where, according to the Ramayana, Sita was abducted by Ravana. The site has a lotus-shaped shrine, idols of Rama, Sita and Lakshmana in a forest clearing, and ancient stone markings. Whether or not you follow the mythology, the location itself is arresting: deep in the forest with no road access, reached only by river, the clearing feels genuinely remote. Many operators offer Parnasala as a half-day add-on to the main Papikondalu cruise.`,
      },
      {
        h: 'Booking Tips and Practical Information',
        p: `Book at least 3 days in advance, especially during Diwali, Sankranti and school holiday periods (May–June) when boats fill up completely. The Rajahmundry–Papikondalu–Rajahmundry day tour costs ₹1,500 per person; the overnight package starts at ₹2,300. Carry motion-sickness tablets if you are sensitive — the first 2 hours on the open river can be choppy. Life jackets are provided on all boats. Photography is unrestricted but drone permits require coordination with the forest department — your operator can arrange this. The nearest ATM is in Rajahmundry; carry cash for purchases at the riverside stops. Mobile coverage drops to zero inside the gorge, so download your maps offline before departure.`,
      },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return { title: 'Post Not Found' }
  return { title: post.title, description: post.content[0]?.p.slice(0, 160) }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        {/* Hero */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <Image src={post.image} alt={post.title} fill className="object-cover" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
            <span className="badge bg-sunset text-white mb-3">{post.category}</span>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <article className="prose prose-lg max-w-none">
            {post.content.map((sec, i) => (
              <div key={i} className="mb-8">
                <h2 className="font-display text-xl font-bold text-ink mb-3">{sec.h}</h2>
                <p className="text-ink/80 leading-relaxed">{sec.p}</p>
              </div>
            ))}
          </article>

          {/* CTA */}
          <div className="mt-12 bg-river rounded-2xl p-8 text-center text-white">
            <h3 className="font-display text-xl font-bold mb-2">Ready to Experience the Godavari?</h3>
            <p className="text-white/70 mb-5">Browse our Papikondalu packages and book your boat tour today.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/packages" className="btn-primary">View Packages <ArrowRight className="w-4 h-4" /></Link>
              <Link href="/contact" className="btn-outline-white">Contact Us</Link>
            </div>
          </div>

          {/* Back */}
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-teal hover:text-teal/80 text-sm font-medium">← Back to Blog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
