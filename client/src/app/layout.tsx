import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Papikondalu Tourism | Godavari Boat Tours & River Cruises',
    template: '%s | Papikondalu Tourism',
  },
  description:
    'Explore Papikondalu hills and Godavari river with Aswini Godavari Travel. Book boat tours from Rajahmundry & Bhadrachalam. 20+ years of trusted tourism since 2004.',
  keywords: [
    'Papikondalu boat tour', 'Godavari river cruise', 'Rajahmundry boat trip',
    'Bhadrachalam tour', 'Papikondalu package', 'East Godavari tourism',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.bhadradripapikondalu.com',
    siteName: 'Papikondalu Tourism',
    images: [{
      url: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755976642/1b45e060-bfee-4be1-85f4-51c2c6430c70_itqkts.jpg',
      width: 1920, height: 1080, alt: 'Papikondalu Godavari River Cruise',
    }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
