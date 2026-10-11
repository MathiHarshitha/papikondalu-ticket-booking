import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Aswini Godavari Travel & Tourism booking platform.',
}

const sections = [
  {
    title: '1. Information We Collect',
    body: `When you register for an account or book a tour, we collect your name, email address, mobile phone number, and (for booking) passenger details required by the Inland Waterways Authority of India. We also collect technical data such as your IP address, browser type, and pages visited, processed through cookies and server logs.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Your personal data is used to: (a) process and confirm your tour bookings; (b) issue electronic tickets and QR codes for embarkation; (c) send booking confirmations, reminders, and post-trip receipts by email or SMS; (d) comply with statutory passenger manifest requirements for riverine tourism; (e) respond to customer service enquiries; and (f) improve our website experience using aggregated, anonymised analytics.`,
  },
  {
    title: '3. Payment Data',
    body: `We do not store your card numbers or bank account details on our servers. All payment processing is handled by PayU Payments Pvt. Ltd., which is PCI-DSS Level 1 certified. We retain only the payment reference ID and amount to reconcile bookings and process refunds. PayU's own privacy policy governs how they handle payment data.`,
  },
  {
    title: '4. Cookies',
    body: `We use strictly necessary cookies to maintain your login session and shopping cart. We use analytics cookies (Google Analytics) to understand aggregate visitor behaviour — these cookies do not identify you personally. You can disable analytics cookies in your browser settings; this will not affect your ability to book.`,
  },
  {
    title: '5. Data Sharing',
    body: `We do not sell, rent, or broker your personal data. We share data only with: (a) PayU, for payment processing; (b) government authorities when required by law (e.g., Inland Waterways Authority passenger manifests); (c) SMS/email gateway providers solely to deliver booking notifications to you. All third-party processors are contractually bound to protect your data.`,
  },
  {
    title: '6. Data Retention',
    body: `Booking records and associated personal data are retained for 7 years as required by Indian tax law (GST Act). Account data is retained while your account is active; you may request deletion at any time, after which we will anonymise your data within 30 days, subject to legal hold requirements.`,
  },
  {
    title: '7. Your Rights',
    body: `Under the Information Technology (Amendment) Act 2008 and the Digital Personal Data Protection Act 2023, you have the right to access, correct, or request deletion of your personal data. To exercise any of these rights, email us at aswinigodavari@gmail.com with your registered email and the specific request. We will respond within 30 days.`,
  },
  {
    title: '8. Security',
    body: `Passwords are hashed using Argon2id and are never stored in plain text. API sessions use short-lived JSON Web Tokens stored in HTTP-only, Secure, SameSite=Strict cookies — inaccessible to JavaScript. All data in transit is encrypted via TLS 1.2 or higher. We conduct periodic security reviews of our infrastructure.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this policy from time to time. Material changes will be notified by email to registered users at least 14 days before they take effect. Continued use of our platform after a policy change constitutes acceptance of the updated terms.`,
  },
  {
    title: '10. Contact',
    body: `For privacy-related queries, contact Aswini Godavari Travel & Tourism: Email — aswinigodavari@gmail.com · Phone — +91 98483 23488 · Address — Kadali Ghat, Rajahmundry, Andhra Pradesh 533 101.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="bg-river py-12 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Legal</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/70 mt-2 text-sm">Effective January 2024 · Aswini Godavari Travel & Tourism</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="card p-6 sm:p-10 space-y-8">
            <p className="text-muted leading-relaxed text-sm">
              Aswini Godavari Travel & Tourism ("we", "us", "our") operates the bhadradripapikondalu.com booking platform.
              This Privacy Policy explains what personal data we collect, how we use it, and your rights in relation to it.
              By creating an account or making a booking, you agree to the practices described below.
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
