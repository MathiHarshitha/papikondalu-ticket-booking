'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is the best time to visit Papikondalu?',
    a: 'October to March is ideal — the weather is cool, the river is calm and the scenery is at its most beautiful. November to February is the busiest period, so we recommend booking at least a day ahead.',
  },
  {
    q: 'From which locations do your tours depart?',
    a: 'We operate from two departure points: Rajahmundry (for one-day tours) and Bhadrachalam (for temple tours and two-day packages). Your exact boarding point and reporting time will be confirmed when you book.',
  },
  {
    q: 'What is the pricing for Papikondalu tours?',
    a: 'One-day tours from Rajahmundry start at ₹1,500 per person. Two-day tours from Bhadrachalam start at ₹2,300 per person. Sirivaka night camping starts at ₹5,200 per person. Contact us for current pricing on other packages.',
  },
  {
    q: 'Are the boats safe? Do you provide life jackets?',
    a: 'Safety is our top priority. Every passenger is provided a life jacket for the entire duration of the boat journey. Our crew is experienced and trained in river safety. All three boats — Aswini, Sri Godavari and Srilaxmi — are regularly maintained and certified.',
  },
  {
    q: 'What is the cancellation and refund policy?',
    a: 'Cancellations more than 48 hours before departure receive a full refund. Cancellations 24–48 hours before receive a 50% refund. Cancellations within 24 hours are non-refundable. In case of cancellation due to weather or operator, a full refund or a rescheduled date is offered.',
  },
  {
    q: 'Can I book for a group?',
    a: 'Yes! Our boats accommodate up to 150 passengers. We offer group bookings for families, corporate trips and school excursions. Contact us on +91 98483 23488 or WhatsApp for group rates and customised packages.',
  },
  {
    q: 'Is the Bhadrachalam temple included in the tour?',
    a: 'The Bhadrachalam to Papikondalu two-day tour includes a guided visit to the Bhadrachalam temple. The Parnasala Heritage Tour also covers the Parnasala site near Bhadrachalam. Please check the individual package details for exactly what is included.',
  },
  {
    q: 'Are trips possible during monsoon season?',
    a: 'Monsoon tours (June–September) depend on river levels and conditions. Some trips, especially Maredumilli Waterfalls, run during early monsoon when the falls are full. We will notify you and offer a full refund or rescheduling if weather conditions prevent a departure.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-teal font-semibold text-sm uppercase tracking-wider mb-2">Common Questions</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-medium text-ink text-sm sm:text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-teal flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-muted text-sm leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-muted text-sm mb-3">Still have questions?</p>
          <a href="tel:+919848323488" className="btn-primary">
            Call +91 98483 23488
          </a>
        </div>
      </div>
    </section>
  )
}
