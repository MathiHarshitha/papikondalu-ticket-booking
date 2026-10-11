import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, ArrowRight, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Attractions & Destinations',
  description: 'Explore Papikondalu hills, Bhadrachalam temple, Maredumilli waterfalls, Parnasala and more destinations along the Godavari river in Andhra Pradesh.',
}

const attractions = [
  {
    id: 'papikondalu',
    name: 'Papikondalu Hills',
    tagline: 'Ancient gorges carved by the Godavari',
    duration: '4–6 hours by boat',
    location: 'Godavari River, East Godavari',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
    description: 'The Papikondalu hills are a dramatic gorge system where the Godavari river cuts through ancient granite rocks for over 100 kilometres. Towering walls rise 300 metres on either side, with tribal villages, sacred ghats and dense forest clinging to the slopes. This is the centrepiece of every Godavari boat tour.',
    howToReach: 'Accessible only by boat from Rajahmundry or Bhadrachalam. Our tours take you directly through the gorges.',
    highlights: ['300-metre granite gorges', 'Tribal villages on the riverbank', 'Sacred ghats and small temples', 'Diverse birdlife', 'Scenic photography opportunities'],
    packageLink: '/packages/rajahmundry-papikondalu-packages',
    packageName: 'One Day Tour from Rajahmundry',
  },
  {
    id: 'bhadrachalam',
    name: 'Bhadrachalam Temple',
    tagline: 'Sacred Ramayana temple above the Godavari',
    duration: '2–3 hours',
    location: 'Bhadrachalam, Telangana/AP border',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png',
    description: 'The Bhadrachalam temple is one of the most revered Vaishnava shrines in South India, dedicated to Lord Rama. Built in the 17th century, it stands on the banks of the Godavari and attracts pilgrims year-round. Our two-day tour begins with a guided visit here before setting out on the river.',
    howToReach: 'Bhadrachalam town is accessible by road from Hyderabad (~7 hours) and Vijayawada (~5 hours). Our boat tour departs from here.',
    highlights: ['17th-century temple architecture', 'Lord Rama shrine', 'Godavari riverside setting', 'Annual Sita Ramula Kalyanam festival', 'Night prayer ceremonies'],
    packageLink: '/packages/bhadrachalam-papikondalu-packages',
    packageName: 'Two Day Tour from Bhadrachalam',
  },
  {
    id: 'maredumilli',
    name: 'Maredumilli Waterfalls',
    tagline: 'Forest waterfalls of East Godavari',
    duration: '3–4 hours',
    location: 'Maredumilli, East Godavari',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg',
    description: 'Nestled deep in the Eastern Ghats, the Maredumilli forest area is home to pristine waterfalls, ancient trees and remarkable biodiversity. The journey through forest trails to the falls is as rewarding as the destination itself. Best visited during and after monsoon when the waterfalls are at their peak.',
    howToReach: 'Day trip from Rajahmundry by road (~3 hours). Our package includes transport from Rajahmundry.',
    highlights: ['Pristine waterfalls', 'Ancient Eastern Ghats forest', 'Tribal culture nearby', 'Rare flora and fauna', 'Photography and trekking'],
    packageLink: '/packages/maredumilli-packages',
    packageName: 'Maredumilli Waterfalls Adventure',
  },
  {
    id: 'parnasala',
    name: 'Parnasala',
    tagline: 'Ramayana heritage site on the Godavari',
    duration: '2–3 hours',
    location: 'Near Bhadrachalam',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755979312/dev_parnasala_pfvan7.jpg',
    description: 'Parnasala is a peaceful Ramayana heritage site on the banks of the Godavari near Bhadrachalam. Hindu tradition holds that this is where Sita lived during the years of forest exile. The site features shrines, statues of Ram, Lakshmana and Sita, and a serene riverside atmosphere that rewards patient visitors.',
    howToReach: 'Accessible by road from Bhadrachalam (about 1 hour). Combined with our Bhadrachalam temple tour.',
    highlights: ['Ramayana historical significance', 'Sita\'s mythological residence', 'Ram, Sita & Lakshmana statues', 'Peaceful riverside setting', 'Ancient forest trails'],
    packageLink: '/packages/parnasala-packages',
    packageName: 'Parnasala Heritage Temple Tour',
  },
  {
    id: 'perantalapalli',
    name: 'Perantalapalli',
    tagline: 'Riverside Shiva temple and forest village',
    duration: '1–2 hours',
    location: 'Godavari riverside, East Godavari',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1756003757/rajamundry_v2aufm.jpg',
    description: 'Perantalapalli is a key stopover on the Rajahmundry one-day tour — a quiet tribal riverside village with a celebrated Shiva temple, forest trails and a traditional way of life largely unchanged for generations. The boat stop here gives a rare glimpse into the communities that have called the Godavari home for centuries.',
    howToReach: 'Accessible only by boat. Included as a stop on our Rajahmundry One Day Tour.',
    highlights: ['Riverside Shiva temple', 'Tribal village life', 'Forest trail exploration', 'Boat access only', 'Cultural immersion'],
    packageLink: '/packages/rajahmundry-papikondalu-packages',
    packageName: 'Rajahmundry One Day Tour',
  },
  {
    id: 'sirivaka',
    name: 'Sirivaka Camp',
    tagline: 'Wilderness camping deep in Papikondalu forest',
    duration: 'Overnight stay',
    location: 'Papikondalu forest, deep Godavari',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1756003855/sirivaka_fdzsuf.avif',
    description: 'Sirivaka is a remote riverbank clearing accessible only by boat, deep within the Papikondalu forest. One of the most extraordinary places to spend a night in Andhra Pradesh — tents beside the river, a campfire under an open sky, the calls of forest birds at dawn and complete silence interrupted only by the Godavari.',
    howToReach: 'Accessible only by boat from Rajahmundry (approximately 8 hours). Our overnight package includes all transport.',
    highlights: ['Remote forest riverside', 'Campfire and stargazing', 'Dawn nature walk', 'Complete wilderness', 'Boat access only'],
    packageLink: '/packages/sirivaka-night-stay-package',
    packageName: 'Sirivaka Night Stay & Camping',
  },
]

export default function AttractionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory">
        {/* Banner */}
        <div className="relative bg-river py-16 text-center text-white">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Destinations Along the Godavari</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Ancient temples, dramatic gorges, forest waterfalls and remote wilderness camps —
            all accessible by Godavari river cruise.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {attractions.map((a, i) => (
            <div key={a.id} id={a.id} className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={`relative rounded-2xl overflow-hidden h-72 lg:h-96 ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <Image src={a.image} alt={a.name} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="badge bg-white/20 backdrop-blur-sm text-white border border-white/20">
                    <Clock className="w-3 h-3" /> {a.duration}
                  </span>
                  <span className="badge bg-white/20 backdrop-blur-sm text-white border border-white/20">
                    <MapPin className="w-3 h-3" /> {a.location}
                  </span>
                </div>
              </div>

              <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-1">{a.tagline}</div>
                <h2 className="font-display text-3xl font-bold text-ink mb-3">{a.name}</h2>
                <p className="text-muted leading-relaxed mb-5">{a.description}</p>

                <div className="bg-white rounded-xl p-4 border border-gray-100 mb-5">
                  <div className="flex gap-2 text-xs text-ink/70 mb-2">
                    <Info className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" />
                    <span className="font-medium">How to get there:</span>
                  </div>
                  <p className="text-sm text-muted pl-5">{a.howToReach}</p>
                </div>

                <ul className="grid grid-cols-2 gap-2 mb-6">
                  {a.highlights.map(h => (
                    <li key={h} className="text-sm text-muted flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0 mt-1.5" />{h}
                    </li>
                  ))}
                </ul>

                <Link href={a.packageLink} className="btn-primary">
                  Book: {a.packageName} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-river text-white py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Plan Your Godavari Journey</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">Browse our 9 curated packages to find the right combination of destinations for your trip.</p>
          <Link href="/packages" className="btn-primary">View All Packages <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
