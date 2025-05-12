"use client";

import React from "react";
import { IconType } from "react-icons";
import { FaHandScissors, FaTools, FaGift } from "react-icons/fa";
import ServiceItem from "./ServiceItem";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface ServiceItemProps {
  icon: IconType;
  title: string;
  description: string;
  buttonText: string;
  buttonStyle: "primary" | "secondary";
}

const ServicesSection: React.FC = () => {
  // ✅ Explicitly type the services array
  const services: ServiceItemProps[] = [
    {
      icon: FaHandScissors,
      title: "OUR SALON",
      description:
        "Silverclip Salon offers lorem ipsum dolor sit amet, consectetur adipiscing elite eiusmod tempor incides.",
      buttonText: "BOOK APPOINTMENT",
      buttonStyle: "secondary",
    },
    {
      icon: FaTools,
      title: "WE LOVE TO SERVE",
      description:
        "Daimond Salon offers lorem ipsum dolor sit amet, consectetur adipiscing elite eiusmod tempor incides.",
      buttonText: "GET SERVICES",
      buttonStyle: "primary",
    },
    {
      icon: FaGift,
      title: "GIFT VOUCHERS",
      description:
        "Daimond Salon offers lorem ipsum dolor sit amet, consectetur adipiscing elite eiusmod tempor incides.",
      buttonText: "BUY A GIFT VOUCHER",
      buttonStyle: "secondary",
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceItem
                icon={service.icon}
                title={service.title}
                description={service.description}
                buttonText={service.buttonText}
                buttonStyle={service.buttonStyle}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
