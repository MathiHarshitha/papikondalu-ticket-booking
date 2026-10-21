import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for booking Papikondalu boat tours with Aswini Godavari Travel.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing papikondalutourism.com and making a booking, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this platform. These terms are governed by the laws of India.`,
  },
  {
    title: '2. Bookings and Confirmation',
    body: `A booking is confirmed only upon receipt of full payment and issuance of a booking reference number (format: PK-XXXXXXXX). The booking confirmation email and QR-coded digital ticket sent to your registered email constitute your proof of booking. Aswini Godavari Travel reserves the right to refuse a booking at its discretion.`,
  },
  {
    title: '3. Passenger Eligibility',
    body: `All passengers must carry valid government-issued photo ID (Aadhaar, Passport, Voter ID, or Driving Licence) at the time of embarkation. Passengers under 12 years of age must be accompanied by a parent or guardian at all times. Passengers with serious cardiovascular conditions, recent surgery, or conditions that may be aggravated by extended boat travel are advised to consult a doctor before booking. Aswini Godavari Travel may refuse boarding if a passenger's health appears to pose a risk to themselves or others.`,
  },
  {
    title: '4. Safety Rules',
    body: `Life jackets must be worn at all times when instructed by boat crew. Passengers must not stand on the railings, throw objects overboard, or enter restricted areas of the vessel. Swimming in the Godavari during the tour is strictly prohibited. Consumption of alcohol is not permitted on board. The boat captain's decisions regarding safety and navigation are final and binding on all passengers.`,
  },
  {
    title: '5. Cancellation and Refunds',
    body: `Please refer to our Cancellation Policy for full details of the refund schedule. In summary: cancellations more than 48 hours before departure receive a full refund; 24–48 hours, a 50% refund; less than 24 hours, no refund. Operator cancellations due to weather or force majeure entitle the customer to a full refund or free reschedule.`,
  },
  {
    title: '6. Limitation of Liability',
    body: `Aswini Godavari Travel's total liability to any customer for any claim arising from a booking shall not exceed the amount paid for that booking. We are not liable for indirect, consequential, or punitive damages. We are not responsible for loss of personal property, delays caused by weather or river conditions, or any expenses incurred as a result of a tour modification or cancellation.`,
  },
  {
    title: '7. Force Majeure',
    body: `We are not liable for failure to perform our obligations if such failure results from circumstances beyond our reasonable control, including but not limited to floods, cyclones, civil disturbance, government orders, or closure of waterways by the Inland Waterways Authority of India.`,
  },
  {
    title: '8. Photography and Content',
    body: `Passengers may photograph and film on board for personal, non-commercial use. Commercial photography or drone operation requires prior written consent from Aswini Godavari Travel and applicable forest/waterway permits. By sharing photographs or reviews of our services on social media, you grant us the right to reshare such content with attribution.`,
  },
  {
    title: '9. Grievance Redressal',
    body: `For complaints or disputes, contact us first at aswinigodavari@gmail.com or +91 98483 23488. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the courts in Rajahmundry, Andhra Pradesh.`,
  },
]

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="bg-river py-12 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Legal</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Terms and Conditions</h1>
          <p className="text-white/70 mt-2 text-sm">Effective January 2024 · Aswini Godavari Travel & Tourism</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="card p-6 sm:p-10 space-y-8">
            <p className="text-muted leading-relaxed text-sm">
              These Terms and Conditions govern your use of the Aswini Godavari Travel & Tourism booking platform and the
              boat tour services we provide. Please read them carefully before making a booking.
            </p>
            {sections.map(s => (
              <div key={s.title}>
                <h2 className="font-display font-bold text-ink text-lg mb-2">{s.title}</h2>
                <p className="text-ink/80 leading-relaxed text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
