import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PackageDetail from '@/components/packages/PackageDetail'

const PACKAGES: Record<string, {
  name: string; subtitle: string; duration: string; from: string; capacity: number;
  price: number | null; season: string; description: string; image: string;
  highlights: string[]; itinerary: { time: string; activity: string }[];
  inclusions: string[]; exclusions: string[]; policy: string;
}> = {
  'rajahmundry-papikondalu-packages': {
    name: 'Rajahmundry to Papikondalu', subtitle: 'One Day Tour',
    duration: '1 Day (Same-day return)', from: 'Rajahmundry', capacity: 100, price: 1500,
    season: 'October – March',
    description: 'Cruise from Rajahmundry through the iconic Papikondalu gorges — 300-metre granite walls rising from the Godavari river, sacred temples and tribal villages lining the banks. Stop at Perantalapalli riverside temple and return by evening.',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1756003757/rajamundry_v2aufm.jpg',
    highlights: ['Perantalapalli Shiva Temple', 'Onboard Lunch', 'Life Jackets', 'Professional Guide', 'Covered Boat'],
    itinerary: [
      { time: '6:00 AM', activity: 'Report to Rajahmundry Boat Ghat' },
      { time: '7:00 AM', activity: 'Departure — cruise begins along the Godavari' },
      { time: '10:00 AM', activity: 'Arrive at Perantalapalli, visit riverside Shiva temple' },
      { time: '12:00 PM', activity: 'Onboard lunch with scenic gorge views' },
      { time: '1:00 PM', activity: 'Continue cruise through Papikondalu hills' },
      { time: '4:00 PM', activity: 'Return journey begins' },
      { time: '7:00 PM', activity: 'Arrive back at Rajahmundry' },
    ],
    inclusions: ['Boat ride (return)', 'Onboard lunch', 'Life jackets', 'Professional guide', 'Entry to Perantalapalli'],
    exclusions: ['Personal expenses', 'Camera charges at certain sites', 'Travel to/from Rajahmundry Ghat'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours. Full refund for weather cancellations.',
  },
  'bhadrachalam-papikondalu-packages': {
    name: 'Bhadrachalam to Papikondalu', subtitle: 'Two Day Boat Tour',
    duration: '2 Days / 1 Night', from: 'Bhadrachalam', capacity: 100, price: 2300,
    season: 'November – February',
    description: 'A two-day journey from the sacred Bhadrachalam temple through the heart of Papikondalu. Visit Lord Rama\'s temple, cruise through spectacular gorges, and spend a night at a riverside camp before completing the journey in Rajahmundry.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755980906/BhadrachalamTemple-1068x421_heh1o2.png',
    highlights: ['Bhadrachalam Temple Visit', 'Overnight Riverside Stay', 'All Meals', 'Professional Guide', 'Perantalapalli Stop'],
    itinerary: [
      { time: 'Day 1 — 7:00 AM', activity: 'Report at Bhadrachalam Ghat' },
      { time: '8:00 AM', activity: 'Visit Bhadrachalam Temple (Lord Rama)' },
      { time: '10:00 AM', activity: 'Depart by boat — begin Godavari cruise' },
      { time: '1:00 PM', activity: 'Onboard lunch; pass through Papikondalu gorges' },
      { time: '5:00 PM', activity: 'Arrive at overnight riverside camp' },
      { time: '7:00 PM', activity: 'Campfire, dinner and evening program' },
      { time: 'Day 2 — 7:00 AM', activity: 'Breakfast; continue cruise downstream' },
      { time: '11:00 AM', activity: 'Stop at Perantalapalli temple' },
      { time: '2:00 PM', activity: 'Onboard lunch' },
      { time: '5:00 PM', activity: 'Arrive at Rajahmundry Ghat' },
    ],
    inclusions: ['Boat (2 days)', 'All meals (5 meals)', 'Overnight accommodation', 'Temple entry', 'Professional guide', 'Life jackets'],
    exclusions: ['Personal expenses', 'Travel to Bhadrachalam / from Rajahmundry', 'Camera fees'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours. Full refund for weather cancellations.',
  },
  'sirivaka-night-stay-package': {
    name: 'Sirivaka Night Stay & Camping', subtitle: 'Overnight Adventure',
    duration: '1 Night', from: 'Rajahmundry', capacity: 40, price: 5200,
    season: 'October – March',
    description: 'One of Andhra Pradesh\'s most extraordinary overnight experiences — camp at the remote Sirivaka riverside clearing deep within the Papikondalu forest. Campfire under a canopy of stars, nature walks at dawn and the sound of the Godavari.',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1756003855/sirivaka_fdzsuf.avif',
    highlights: ['Riverside Camping', 'Campfire', 'Nature Walk', 'Stargazing', 'All Meals', 'Tent Accommodation'],
    itinerary: [
      { time: '7:00 AM', activity: 'Depart from Rajahmundry Ghat' },
      { time: '12:00 PM', activity: 'Onboard lunch while cruising through gorges' },
      { time: '3:00 PM', activity: 'Arrive at Sirivaka camp; settle in' },
      { time: '4:00 PM', activity: 'Nature walk through tribal forest' },
      { time: '7:00 PM', activity: 'Campfire and dinner under the stars' },
      { time: '9:00 PM', activity: 'Stargazing session' },
      { time: 'Next day 6:00 AM', activity: 'Dawn riverside walk and breakfast' },
      { time: '8:00 AM', activity: 'Return cruise to Rajahmundry' },
      { time: '1:00 PM', activity: 'Arrive at Rajahmundry' },
    ],
    inclusions: ['Boat (return)', 'Tent accommodation', 'All meals', 'Campfire', 'Nature walk guide', 'Life jackets'],
    exclusions: ['Personal sleeping bag (can arrange)', 'Personal expenses', 'Travel to/from Rajahmundry Ghat'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours. Full refund for weather cancellations.',
  },
  'papikondalu-packages': {
    name: 'Papikondalu Gorge Cruise', subtitle: 'One Day Scenic Tour',
    duration: '1 Day', from: 'Rajahmundry', capacity: 120, price: 1500,
    season: 'All year (Best Oct – Feb)',
    description: 'Cruise through the spectacular Papikondalu gorge on the Godavari — 40 km of sheer granite walls, tribal villages, and pristine forest. The definitive Godavari river experience departing from Rajahmundry.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755980788/PAPI-KONDALU_wswdud.jpg',
    highlights: ['Papikondalu Gorge', 'Tribal Villages', 'Onboard Lunch', 'Professional Guide', 'Life Jackets'],
    itinerary: [
      { time: '6:00 AM', activity: 'Assemble at Rajahmundry Ghat' },
      { time: '7:00 AM', activity: 'Depart — river cruise begins' },
      { time: '10:30 AM', activity: 'Enter Papikondalu gorge — narrow cliffs, forest' },
      { time: '12:30 PM', activity: 'Onboard lunch' },
      { time: '1:30 PM', activity: 'Tribal village stop (photo op, local honey)' },
      { time: '3:00 PM', activity: 'Return cruise begins' },
      { time: '6:30 PM', activity: 'Arrive back at Rajahmundry' },
    ],
    inclusions: ['Boat ride (return)', 'Onboard lunch', 'Life jackets', 'Professional guide'],
    exclusions: ['Personal expenses', 'Travel to/from Ghat', 'Camera charges'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  'maredumilli-packages': {
    name: 'Maredumilli Forest & Waterfalls', subtitle: 'Eco Day Tour',
    duration: '1 Day', from: 'Rajahmundry', capacity: 80, price: null,
    season: 'July – February (waterfalls best Aug–Sep)',
    description: 'Venture into the Maredumilli forest reserve of East Godavari — one of the last old-growth forest tracts in Andhra Pradesh. Visit Amruthadhara and Jalatarangini waterfalls, walk forest trails and meet the Koya tribal community.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755978851/Jalatarangini-Waterfalls_ev33iz.jpg',
    highlights: ['Amruthadhara Falls', 'Jalatarangini Falls', 'Forest Walk', 'Tribal Village', 'Eco Camp Option'],
    itinerary: [
      { time: '6:00 AM', activity: 'Depart from Rajahmundry by road' },
      { time: '9:00 AM', activity: 'Arrive Maredumilli — entry permit' },
      { time: '10:00 AM', activity: 'Visit Jalatarangini Waterfalls' },
      { time: '12:00 PM', activity: 'Lunch at forest camp' },
      { time: '1:30 PM', activity: 'Visit Amruthadhara Falls' },
      { time: '3:00 PM', activity: 'Tribal village walk' },
      { time: '5:00 PM', activity: 'Depart for Rajahmundry' },
      { time: '8:00 PM', activity: 'Arrive Rajahmundry' },
    ],
    inclusions: ['Transport (AC vehicle)', 'Forest permit', 'Lunch', 'Guide'],
    exclusions: ['Personal expenses', 'Camera fees', 'Accommodation'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  'parnasala-packages': {
    name: 'Parnasala Mythological Trail', subtitle: 'Heritage Boat Tour',
    duration: '1 Day', from: 'Bhadrachalam', capacity: 60, price: null,
    season: 'October – March',
    description: 'Visit Parnasala — the legendary site from the Ramayana where Sita was abducted by Ravana. Accessible only by boat through the Godavari forest, this remote site features a lotus-shaped shrine, ancient stone markings and idols of Rama, Sita and Lakshmana.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1756005704/Parnasala_Picture_cqvutp.jpg',
    highlights: ['Parnasala Shrine', 'Ramayana Heritage Site', 'River Approach Only', 'Bhadrachalam Temple', 'Forest Scenery'],
    itinerary: [
      { time: '7:00 AM', activity: 'Depart from Bhadrachalam Ghat' },
      { time: '8:00 AM', activity: 'Visit Bhadrachalam Sri Rama Temple' },
      { time: '9:30 AM', activity: 'Boat departs downstream toward Parnasala' },
      { time: '11:30 AM', activity: 'Arrive at Parnasala — explore shrine and forest clearing' },
      { time: '1:00 PM', activity: 'Onboard lunch on the river' },
      { time: '2:30 PM', activity: 'Return cruise' },
      { time: '5:00 PM', activity: 'Arrive back at Bhadrachalam' },
    ],
    inclusions: ['Boat (return)', 'Temple entry', 'Onboard lunch', 'Guide', 'Life jackets'],
    exclusions: ['Personal expenses', 'Camera charges', 'Travel to Bhadrachalam'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  'rampachodavaram-waterfalls-tour-package': {
    name: 'Rampachodavaram Waterfalls Tour', subtitle: 'Scenic Day Trip',
    duration: '1 Day', from: 'Rajahmundry', capacity: 80, price: null,
    season: 'July – January',
    description: 'Explore the waterfalls and forest landscapes around Rampachodavaram in the heart of the East Godavari Agency area. A scenic drive through coffee and pepper estates with stops at multiple waterfalls and a tribal art village.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755978851/MAREDUMILLI_-_waterfalls_kmuppt.jpg',
    highlights: ['Multiple Waterfalls', 'Agency Forest Drive', 'Tribal Art Village', 'Coffee Estates', 'Lunch'],
    itinerary: [
      { time: '6:30 AM', activity: 'Depart Rajahmundry by road' },
      { time: '9:30 AM', activity: 'Arrive Rampachodavaram — first waterfall stop' },
      { time: '11:00 AM', activity: 'Drive through coffee and spice estates' },
      { time: '12:30 PM', activity: 'Lunch at tribal camp' },
      { time: '2:00 PM', activity: 'Visit tribal art village' },
      { time: '3:30 PM', activity: 'Second waterfall stop and forest walk' },
      { time: '5:00 PM', activity: 'Return journey' },
      { time: '8:00 PM', activity: 'Arrive Rajahmundry' },
    ],
    inclusions: ['Transport (AC)', 'Lunch', 'Guide', 'Entry permits'],
    exclusions: ['Personal expenses', 'Accommodation'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  'gudisa-packages': {
    name: 'Gudisa Hill Station Camping', subtitle: 'Weekend Hilltop Adventure',
    duration: '2 Days / 1 Night', from: 'Rajahmundry', capacity: 40, price: null,
    season: 'October – February',
    description: 'Trek to the Gudisa hilltop — one of the lesser-known hilltop camping destinations in the Eastern Ghats above the Godavari. A thrilling combination of boat ride, forest trek and overnight tent camping with panoramic sunrise views.',
    image: 'https://res.cloudinary.com/djmcbqzqt/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1755981756/gudisa-hill-station-800x500_gvmccv.jpg',
    highlights: ['Hilltop Camping', 'Sunrise View', 'Forest Trek', 'Boat Ride', 'Campfire'],
    itinerary: [
      { time: 'Day 1 — 7:00 AM', activity: 'Depart Rajahmundry by boat' },
      { time: '11:00 AM', activity: 'Reach Gudisa base; begin trek' },
      { time: '1:30 PM', activity: 'Arrive hilltop camp; set up tents' },
      { time: '3:00 PM', activity: 'Explore hilltop, photography' },
      { time: '7:00 PM', activity: 'Campfire and dinner' },
      { time: 'Day 2 — 5:30 AM', activity: 'Wake for sunrise — panoramic Godavari view' },
      { time: '8:00 AM', activity: 'Breakfast; begin descent' },
      { time: '11:00 AM', activity: 'Return boat to Rajahmundry' },
      { time: '2:00 PM', activity: 'Arrive Rajahmundry' },
    ],
    inclusions: ['Boat ride', 'Tent camping', 'All meals', 'Campfire', 'Trekking guide', 'Life jackets'],
    exclusions: ['Personal sleeping bag', 'Personal expenses', 'Travel to Rajahmundry Ghat'],
    policy: 'Free cancellation 48+ hours before departure. 50% refund 24–48 hours before. No refund within 24 hours.',
  },
  'perantalapalli-packages': {
    name: 'Perantalapalli Village Tour', subtitle: 'Cultural Half-Day Cruise',
    duration: '½ Day', from: 'Rajahmundry', capacity: 120, price: null,
    season: 'All year',
    description: 'A shorter cruise from Rajahmundry to the picturesque Perantalapalli village and its ancient Shiva temple on the Godavari bank. Ideal for families or those short on time who want a taste of the Godavari gorge experience.',
    image: 'https://res.cloudinary.com/dnz1dmnmb/image/upload/c_fill,w_1200,h_600,q_auto,f_auto/v1756003757/rajamundry_v2aufm.jpg',
    highlights: ['Perantalapalli Shiva Temple', 'Godavari Gorge Preview', 'Half-Day Tour', 'Scenic Cruise', 'Tea & Snacks'],
    itinerary: [
      { time: '6:00 AM', activity: 'Depart Rajahmundry Ghat' },
      { time: '8:30 AM', activity: 'Arrive Perantalapalli; visit riverside Shiva temple' },
      { time: '9:30 AM', activity: 'Explore village, local market' },
      { time: '10:00 AM', activity: 'Tea and snacks by the river' },
      { time: '10:30 AM', activity: 'Return cruise' },
      { time: '1:00 PM', activity: 'Arrive back at Rajahmundry' },
    ],
    inclusions: ['Boat (return)', 'Tea & snacks', 'Guide', 'Life jackets'],
    exclusions: ['Lunch', 'Personal expenses'],
    policy: 'Free cancellation 24+ hours before departure. No refund within 24 hours.',
  },
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const pkg = PACKAGES[slug]
  if (!pkg) return { title: 'Package Not Found' }
  return {
    title: pkg.name,
    description: pkg.description.slice(0, 160),
  }
}

export default async function PackageDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const pkg = PACKAGES[slug]
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PackageDetail slug={slug} pkg={pkg || null} />
      </main>
      <Footer />
    </>
  )
}
