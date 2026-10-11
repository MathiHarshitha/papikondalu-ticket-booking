'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        {/* Banner */}
        <div className="bg-river py-16 text-center text-white">
          <div className="text-sunset font-semibold text-sm uppercase tracking-wider mb-2">Get In Touch</div>
          <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/70 text-lg">We&apos;re available 6:00 AM – 10:00 PM daily</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-semibold text-ink mb-4">Contact Information</h2>
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: 'Phone / WhatsApp', value: '+91 98483 23488', href: 'tel:+919848323488', sub: 'Daily 6:00 AM – 10:00 PM' },
                    { icon: Mail, label: 'Email', value: 'aswinigodavari@gmail.com', href: 'mailto:aswinigodavari@gmail.com', sub: null },
                    { icon: MapPin, label: 'Location', value: 'Rajahmundry, Andhra Pradesh 533101', href: null, sub: null },
                    { icon: Clock, label: 'Support Hours', value: 'Every day, 6:00 AM to 10:00 PM', href: null, sub: null },
                  ].map(({ icon: Icon, label, value, href, sub }) => (
                    <div key={label} className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-teal" />
                      </div>
                      <div>
                        <div className="text-xs text-muted font-medium">{label}</div>
                        {href ? (
                          <a href={href} className="text-sm text-ink font-medium hover:text-teal transition-colors">{value}</a>
                        ) : (
                          <div className="text-sm text-ink font-medium">{value}</div>
                        )}
                        {sub && <div className="text-xs text-muted">{sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://wa.me/919848323488"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">WhatsApp Us</div>
                  <div className="text-xs text-green-100">Quick response guaranteed</div>
                </div>
              </a>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-sm text-muted leading-relaxed">
                <div className="font-medium text-ink mb-2">Booking Tip</div>
                Send your preferred travel date, number of passengers and departure point (Rajahmundry or Bhadrachalam) and we&apos;ll confirm availability and pricing right away.
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold text-ink mb-2">Message Received!</h3>
                    <p className="text-muted">We&apos;ll get back to you within a few hours. For urgent enquiries, call us directly on +91 98483 23488.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }) }}
                      className="mt-5 btn-secondary text-sm">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display font-semibold text-xl text-ink mb-6">Send an Enquiry</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted font-medium block mb-1.5">Full Name *</label>
                          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="Your name" className="input-field" />
                        </div>
                        <div>
                          <label className="text-xs text-muted font-medium block mb-1.5">Phone Number *</label>
                          <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                            placeholder="+91 98765 43210" className="input-field" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted font-medium block mb-1.5">Email Address *</label>
                        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="your@email.com" className="input-field" />
                      </div>
                      <div>
                        <label className="text-xs text-muted font-medium block mb-1.5">Subject</label>
                        <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input-field">
                          <option value="">Select a subject</option>
                          <option>Booking Enquiry</option>
                          <option>Package Information</option>
                          <option>Group Booking</option>
                          <option>Cancellation / Refund</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted font-medium block mb-1.5">Message *</label>
                        <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                          placeholder="Tell us your travel date, number of passengers, preferred departure point and any questions..."
                          className="input-field resize-none" />
                      </div>
                      <button type="submit" disabled={loading}
                        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
