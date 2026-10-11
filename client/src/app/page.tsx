import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import FeaturedPackages from '@/components/home/FeaturedPackages'
import AttractionsSection from '@/components/home/AttractionsSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import FleetSection from '@/components/home/FleetSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import FAQSection from '@/components/home/FAQSection'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturedPackages />
        <AttractionsSection />
        <WhyChooseUs />
        <FleetSection />
        <ReviewsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
