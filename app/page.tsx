import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/Hero'
import WhoWeAreSection from './components/WhoWeAreSection'
import ServicesSection from './components/ServicesSection'
import StoreSection from './components/StoreSection'
import OurArtistsSection from './components/OurArtistsSection'
import BookAServiceSection from './components/BookAServiceSection'
import OurServicesSection from './components/OurServicesSection'
import FooterSection from './components/FooterSection'
const page = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <WhoWeAreSection />
      <ServicesSection />
      <StoreSection />
      <OurArtistsSection />
      <BookAServiceSection />
      <OurServicesSection />
      <FooterSection />
    </div>
  )
}

export default page
