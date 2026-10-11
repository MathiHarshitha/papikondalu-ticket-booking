'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'

const BASE = 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_600,q_auto,f_auto/'
const BASE2 = 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_800,h_600,q_auto,f_auto/'

const IMAGES = [
  { id:1, cat:'Nature', cap:'Tourist boat cruising through Papikondalu hills on the Godavari', src: BASE+'v1755980788/PAPI-KONDALU_wswdud.jpg' },
  { id:2, cat:'Nature', cap:'Night-stay tents on the Godavari riverbank below Papikondalu hills', src: BASE+'v1755980789/papikondalu-900x500-1_d4f8xn.jpg' },
  { id:3, cat:'Nature', cap:'Double-deck Papikondalu tourist boat on the Godavari', src: BASE+'v1755980789/slide-1_tpykpk.jpg' },
  { id:4, cat:'Nature', cap:'Sunset over Papikondalu hills and the Godavari River', src: BASE+'v1755980790/Papikondalu_03_zyuwnr.jpg' },
  { id:5, cat:'Nature', cap:'Amruthadhara Waterfalls near Maredumilli', src: BASE+'v1755978850/Amruthadhara-Waterfalls_sy5rgq.jpg' },
  { id:6, cat:'Nature', cap:'Waterfall in the Maredumilli forest, East Godavari', src: BASE+'v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg' },
  { id:7, cat:'Nature', cap:'Jalatarangini Waterfalls in the Maredumilli forest', src: BASE+'v1755978851/Jalatarangini-Waterfalls_ev33iz.jpg' },
  { id:8, cat:'Nature', cap:'Jalatharangini Falls, Maredumilli', src: BASE+'v1755978850/Jalatharangini-1024x675_igtvje.jpg' },
  { id:9, cat:'Nature', cap:'Green slopes at Gudisa hill station', src: BASE+'v1755981756/gudisa-hill-station-800x500_gvmccv.jpg' },
  { id:10, cat:'Nature', cap:'Tents at sunrise on the Gudisa hilltop', src: BASE+'v1755981752/gudisa1_nmrhyv.png' },
  { id:11, cat:'Nature', cap:'Godavari with bridge at Rajahmundry at sunset', src: BASE+'v1756007142/Nwgbridge_q3jh6g.jpg' },
  { id:12, cat:'Temple', cap:'Bhadrachalam Sri Rama temple above the Godavari', src: BASE+'v1755980906/BhadrachalamTemple-1068x421_heh1o2.png' },
  { id:13, cat:'Temple', cap:'Sri Rama Navami rituals at Bhadrachalam', src: BASE+'v1755980905/Rama-Navami-1_wapuc1.jpg' },
  { id:14, cat:'Temple', cap:'Godavari Arch Bridge at Rajahmundry', src: BASE+'v1755980906/unnamed_2_uklsqp.jpg' },
  { id:15, cat:'Temple', cap:'Decorated temple chariot by the roadside', src: BASE+'v1755980906/unnamed_1_w8jko9.jpg' },
  { id:16, cat:'Temple', cap:'Bhadrachalam temple towers above the Godavari', src: BASE+'v1755980906/unnamed_lcfpni.jpg' },
  { id:17, cat:'Temple', cap:'Bhadrachalam temple complex among trees', src: BASE+'v1755980907/licensed-image_gwlk90.jpg' },
  { id:18, cat:'Temple', cap:'Bhadrachalam Sri Rama temple on the hill', src: BASE+'v1755980907/Bhadrachalam_Temple_yg8met.jpg' },
  { id:19, cat:'Temple', cap:'Large Shiva statue at Dwarapudi temple', src: BASE+'v1756007134/dwarapudi_temple_rxlvde.jpg' },
  { id:20, cat:'Heritage', cap:'White lotus-shaped shrine at Parnasala', src: BASE+'v1756005704/Parnasala_Picture_cqvutp.jpg' },
  { id:21, cat:'Heritage', cap:'Sacred rock markings at Parnasala', src: BASE+'v1756005700/PXL_20211226_095318467-scaled_vl8cic.jpg' },
  { id:22, cat:'Heritage', cap:'Mythological statue beside the river at Parnasala', src: BASE+'v1756005699/36227843055_4e0449301a_b_repruw.jpg' },
  { id:23, cat:'Heritage', cap:'Rama and Sita statues at Parnasala', src: BASE+'v1756005699/parnasala-bhadrachalam_n6vjpa.jpg' },
  { id:24, cat:'Heritage', cap:'Replica of the Parnasala forest hut', src: BASE+'v1756005699/download_w5sdh7.jpg' },
  { id:25, cat:'Heritage', cap:'Idols of Rama, Sita and Lakshmana at Parnasala', src: BASE+'v1756005698/download_1_tvckad.jpg' },
  { id:26, cat:'Accommodation', cap:'Hanging bridge over forest stream, Jungle Star eco camp', src: BASE+'v1755978850/jungle-star-eco-camp-506x316_ddezyx.jpg' },
  { id:27, cat:'Accommodation', cap:'Tent on a misty hilltop at sunrise', src: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_800,h_600,q_auto,f_auto/v1755981754/Camping_in_Mountains_ytwmvi.avif' },
  { id:28, cat:'Nature', cap:'Wooden cottages on the Godavari hillside in Papikondalu', src: BASE2+'v1756059652/IMG-20250824-WA0095_qvbgh3.jpg' },
  { id:29, cat:'Nature', cap:'Wooden cottage with a Papikondalu hill backdrop', src: BASE2+'v1756059653/IMG-20250824-WA0090_bam34k.jpg' },
  { id:30, cat:'Nature', cap:'Row of wooden cottages along a garden path', src: BASE2+'v1756059653/IMG-20250824-WA0093_xbqlev.jpg' },
  { id:31, cat:'Nature', cap:'Godavari and Papikondalu hills from a cottage porch', src: BASE2+'v1756059654/IMG-20250824-WA0091_bsdafe.jpg' },
  { id:32, cat:'Nature', cap:'Wooden cottages among trees on a Papikondalu hillside', src: BASE2+'v1756059652/IMG-20250824-WA0092_nciyzz.jpg' },
  { id:33, cat:'Nature', cap:'The Godavari winding through the Papikondalu gorge', src: BASE2+'v1756059653/IMG-20250824-WA0094_gs9otn.jpg' },
  { id:34, cat:'Nature', cap:'Two-storey wooden cottage with a garden in the hills', src: BASE2+'v1756059652/IMG-20250824-WA0097_byc1lo.jpg' },
  { id:35, cat:'Nature', cap:'Wooden cottages with Papikondalu hills in the background', src: BASE2+'v1756059652/IMG-20250824-WA0096_nuvajb.jpg' },
  { id:36, cat:'Nature', cap:'Riverside path beside the Godavari below Papikondalu hills', src: BASE2+'v1756059651/IMG-20250824-WA0098_ruqlbn.jpg' },
  { id:37, cat:'Nature', cap:'Godavari sandbanks from a forested hilltop in Papikondalu', src: BASE2+'v1756059651/IMG-20250824-WA0099_wy8ety.jpg' },
]

const CATS = ['All', 'Nature', 'Temple', 'Heritage', 'Accommodation']

export default function GalleryPage() {
  const [cat, setCat] = useState('All')
  const [lightbox, setLightbox] = useState<typeof IMAGES[0] | null>(null)

  const filtered = cat === 'All' ? IMAGES : IMAGES.filter(i => i.cat === cat)

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ink min-h-screen">
        {/* Header */}
        <div className="bg-river py-14 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Photo Gallery</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Papikondalu in Pictures</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            37 photographs of the Godavari gorges, sacred temples, forest waterfalls and riverside camps.
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-16 z-30 bg-ink/95 backdrop-blur-md border-b border-white/10 py-3">
          <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  cat === c ? 'bg-sunset text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}>
                {c} {c === 'All' ? `(${IMAGES.length})` : `(${IMAGES.filter(i=>i.cat===c).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map(img => (
              <div key={img.id}
                className="relative break-inside-avoid cursor-zoom-in group overflow-hidden rounded-xl"
                onClick={() => setLightbox(img)}>
                <Image src={img.src} alt={img.cap}
                  width={800} height={600} className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-3">
                  <p className="text-white text-xs leading-tight opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                    {img.cap}
                  </p>
                </div>
                <span className="absolute top-2 right-2 badge bg-black/50 text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.cat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                <Image src={lightbox.src} alt={lightbox.cap} fill className="object-contain" unoptimized />
              </div>
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm">{lightbox.cap}</p>
                <span className="badge bg-white/10 text-white/60 text-xs mt-2">{lightbox.cat}</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-river py-12 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-3">See It For Yourself</h2>
          <p className="text-white/70 mb-5">Book a Papikondalu boat tour and experience the Godavari in person.</p>
          <Link href="/packages" className="btn-primary">Browse Packages <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
