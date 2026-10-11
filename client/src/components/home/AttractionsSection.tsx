import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'

const attractions = [
  {
    name: 'Papikondalu Hills',
    description: 'Ancient granite gorges rising 300m above the Godavari — the iconic centrepiece of every cruise.',
    duration: '4–6 hours by boat',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_scale,w_600,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
    href: '/attractions#papikondalu',
  },
  {
    name: 'Bhadrachalam Temple',
    description: 'Sacred Ramayana-era temple dedicated to Lord Rama, perched above the Godavari at Bhadrachalam.',
    duration: '2–3 hours',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_scale,w_600,q_auto,f_auto/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png',
    href: '/attractions#bhadrachalam',
  },
  {
    name: 'Maredumilli Waterfalls',
    description: 'Pristine waterfalls nestled in ancient forest trails of East Godavari district.',
    duration: '3–4 hours',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_scale,w_600,q_auto,f_auto/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg',
    href: '/attractions#maredumilli',
  },
  {
    name: 'Parnasala',
    description: 'Peaceful Ramayana heritage site near Bhadrachalam, where Sita is said to have stayed.',
    duration: '2–3 hours',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_scale,w_600,q_auto,f_auto/v1755979312/dev_parnasala_pfvan7.jpg',
    href: '/attractions#parnasala',
  },
  {
    name: 'Perantalapalli',
    description: 'Riverside village with a celebrated Shiva temple, a key stopover on Godavari boat tours.',
    duration: '1–2 hours',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_scale,w_600,q_auto,f_auto/v1756003757/rajamundry_v2aufm.jpg',
    href: '/attractions#perantalapalli',
  },
  {
    name: 'Sirivaka Camp',
    description: 'Remote riverside campsite in the heart of the Papikondalu forest — for overnight wilderness stays.',
    duration: 'Overnight stay',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_scale,w_600,q_auto,f_auto/v1756003855/sirivaka_fdzsuf.avif',
    href: '/attractions#sirivaka',
  },
]

export default function AttractionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-2">Explore the Region</div>
          <h2 className="section-title">8+ Amazing Destinations</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            From sacred temples to ancient river gorges — each destination along the Godavari
            tells a story thousands of years in the making.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map(a => (
            <Link key={a.name} href={a.href} className="group relative rounded-2xl overflow-hidden h-64 block">
              <Image src={a.image} alt={a.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                  <Clock className="w-3 h-3" /> {a.duration}
                </div>
                <h3 className="text-white font-display font-semibold text-xl mb-1">{a.name}</h3>
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{a.description}</p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/attractions" className="btn-secondary">
            Explore All Attractions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
