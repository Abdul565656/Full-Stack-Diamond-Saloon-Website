"use client"

// components/OurServicesSection.tsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
  buttonText: string;
  index: number; // Add an index prop
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imageSrc, altText, title, description, buttonText, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 200); // Stagger the animation with a delay based on index
    return () => clearTimeout(timeout); // Cleanup the timeout
  }, [index]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.2 } }, // Added animation
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="flex flex-col items-center"
    >
      <div className="relative w-full">
        <Image
          src={imageSrc}
          alt={altText}
          width={400}
          height={300}
          className="rounded-md object-cover"
        />
      </div>
      <h3 className="text-lg font-medium mt-4">{title}</h3>
      <p className="text-gray-700 text-sm text-center mt-2">{description}</p>
      <button className="bg-[#e0c3a3] text-black py-2 px-6 rounded-md mt-4 font-medium hover:bg-[#d0b08f] transition duration-200">
        {buttonText}
      </button>
    </motion.div>
  );
};

const OurServicesSection: React.FC = () => {
  const services = [
    {
      imageSrc: '/images/saloon 1.jpg',
      altText: 'Ladies',
      title: 'LADIES',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ate labore et dolore magna.',
      buttonText: 'LEARN MORE',
    },
    {
      imageSrc: '/images/salon 2.avif',
      altText: 'Mens Grooming',
      title: 'MENS GROOMING',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ate labore et dolore magna.',
      buttonText: 'LEARN MORE',
    },
    {
      imageSrc: '/images/saloon 3.webp',
      altText: 'Treatments',
      title: 'TREATMENTS',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ate labore et dolore magna.',
      buttonText: 'LEARN MORE',
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">OUR SERVICES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} /> // Pass the index to stagger the animation
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServicesSection;