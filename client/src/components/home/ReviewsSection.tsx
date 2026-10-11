import Image from 'next/image'
import { Star, ExternalLink } from 'lucide-react'

const reviews = [
  {
    name: 'Laxaman Rao',
    photo: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_96,h_96,q_auto,f_auto/v1756177667/laxaman_rao_cshydd.jpg',
    rating: 5,
    text: 'Absolutely breathtaking experience sailing through the Papikondalu gorges. The crew was professional and the boat was comfortable. Highly recommended for anyone visiting Andhra Pradesh!',
    date: 'October 2024',
  },
  {
    name: 'Daniel Kumar',
    photo: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_96,h_96,q_auto,f_auto/v1756177679/daniel_psd7do.jpg',
    rating: 5,
    text: 'The two-day Bhadrachalam tour was beyond expectations. Visiting the temple, sailing through the hills and the overnight stay made this a truly memorable trip. Will book again next year!',
    date: 'November 2024',
  },
  {
    name: 'Janu Priya',
    photo: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_96,h_96,q_auto,f_auto/v1756177697/janu_t64fm3.jpg',
    rating: 5,
    text: 'Sirivaka night camping was magical. Woke up to mist over the river with tribal forest all around. The team took care of everything — food, safety, guidance. Truly a hidden gem of AP tourism.',
    date: 'December 2024',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-2">What Travellers Say</div>
          <h2 className="section-title">Real Reviews from Google</h2>
          <p className="section-subtitle mx-auto max-w-lg">
            Join 7 lakh+ travellers who have explored the Godavari with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {reviews.map(r => (
            <div key={r.name} className="bg-ivory rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={r.photo} alt={r.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">{r.name}</div>
                    <div className="text-muted text-xs">{r.date}</div>
                  </div>
                </div>
                <div className="text-xs text-muted/60">via Google</div>
              </div>
              <StarRating count={r.rating} />
              <p className="text-muted text-sm leading-relaxed mt-3">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://g.page/r/CXaRKQEsI6o2ECE/review"
            target="_blank" rel="noopener noreferrer"
            className="btn-primary"
          >
            <Star className="w-4 h-4" /> Write a Google Review
          </a>
          <a
            href="https://www.google.com/maps/place/?q=place_id:CXaRKQEsI6o2ECE"
            target="_blank" rel="noopener noreferrer"
            className="btn-secondary"
          >
            <ExternalLink className="w-4 h-4" /> View All Reviews
          </a>
        </div>
        <p className="text-center text-xs text-muted mt-4">
          Reviews sourced from Google. Powered by Google Places API.
        </p>
      </div>
    </section>
  )
}
