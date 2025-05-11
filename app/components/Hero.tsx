// components/HeroSection.tsx
"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,  // Animation duration
        delay: 0.2,     // Delay before animation starts
        staggerChildren: 0.2, // Stagger children's animation
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative bg-cover bg-center min-h-[600px] overflow-hidden"
      style={{
        backgroundImage: `url("https://t3.ftcdn.net/jpg/06/30/49/76/360_F_630497639_VRLJPdZ4EfTvD7qYmXpWBfYKwHF8TAcx.jpg")`, // Replace with your image URL
      }}
      variants={heroVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Area - Center Vertically and Horizontally */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        {/* Heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          variants={textVariants}
        >
          CREATE YOUR OWN
          <br className="hidden md:block" />
          UNIQUE HAIR STORY
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-sm md:text-base text-gray-200 mb-8"
          variants={textVariants}
        >
          AWARD WINNING HAIR SALON BASED IN UK.
        </motion.p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <motion.button
            className="bg-white text-gray-800 font-medium py-2 px-6 rounded-md hover:bg-gray-200 transition duration-200"
            variants={textVariants}
          ><Link href="tel:+923332858292">
            CALL NOW
            </Link></motion.button>
          <motion.button
            className="bg-transparent border border-white text-white font-medium py-2 px-6 rounded-md hover:bg-white/20 transition duration-200"
            variants={textVariants}
          ><Link href="/BookOnline">
            BOOK ONLINE</Link>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;