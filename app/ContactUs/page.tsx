import React from 'react'
import Navbar from '../components/Navbar'
import ContactForm from '../components/ContactForm'
import StoreCard from '../components/StoreCard'
import FooterSection from '../components/FooterSection'

const page = () => {
  return (
    <div>
      <Navbar />

      <section className="bg-[#1C1C1C] py-16 sm:py-20 md:py-24 lg:py-16">
        <div className="container mx-auto px-4">
          {/* "WHO WE ARE" text: centered, white, bold, uppercase, large, and with wide letter spacing.
              Font size is responsive (text-3xl to text-5xl). */}
          <h1 className="text-white text-center text-3xl sm:text-4xl md:text-5xl mt-8 font-bold uppercase tracking-widest">
            CONTACT US
          </h1>
        </div>
      </section>

      <ContactForm />
      <StoreCard />
      <FooterSection />



    </div>
  )
}

export default page
