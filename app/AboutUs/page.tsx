import React from 'react'
import Navbar from '../components/Navbar'
import FooterSection from '../components/FooterSection'
import WhoWeAre from '../components/WhoWeAre'
import WhoWeAreSection from '../components/WhoWeAreSection'
import StoreSection from '../components/StoreSection'
import OurArtistsSection from '../components/ArtistsSection'
import ServicesSection from '../components/ServicesSection'
const page = () => {
  return (
    <div>
      <Navbar />
      <WhoWeAre />
      <WhoWeAreSection />
      <StoreSection />
      <OurArtistsSection />
      <ServicesSection />
      <FooterSection />
    </div>
  )
}

export default page
