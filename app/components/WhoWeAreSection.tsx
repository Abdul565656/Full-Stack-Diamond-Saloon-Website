// components/WhoWeAreSection.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WhoWeAreSection: React.FC = () => {
  return (
    <section className="bg-[#f5f0e9] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">

          {/* Images */}
          <div className="flex space-x-4 md:space-x-0 md:flex-col relative">
            <div className="relative">
                <Image
                    src="/images/barbar.jpg" // Replace with your first image
                    alt="Barber"
                    width={300}
                    height={300}
                    className="rounded-md relative z-10"
                />
                <div className="absolute inset-0 rounded-md border-2 border-white/50"></div> {/* White Border for Barber Image */}
            </div>

            <div className="relative mt-4 md:mt-0">  {/* Spacing for hair wash image and its border */}
                <Image
                    src="/images/massage.avif" // Replace with your second image
                    alt="Hair Wash"
                    width={300}
                    height={300}
                    className="rounded-md relative z-10"
                />
                <div className="absolute inset-0 rounded-md border-2 border-white/50"></div> {/* White Border for Hair Wash Image */}
            </div>
          </div>

          {/* Text Content */}
          <div className="text-left md:text-left max-w-xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              WHO WE ARE
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              An award winning Hair Salon based in UK. Silverclip Salon offers a
              haven of calm and indulgent luxury lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua diam volutpat.
              <br /><br />
              Nulla malesuada pellentesque elit eget gravida cum sociis natoque
              penatibus. Consequat semper viverra nam libero justo laoreet sit
              faucibus scelerisque eleifend donec pretium vulputate sapien. Dui
              nunc mattis enim ut tellus elementum suscipit biben.
            </p>
            <Link href='/AboutUs'><button className="bg-white text-gray-800 font-medium py-2 px-6 rounded-md border border-gray-300 hover:bg-gray-100 transition duration-200">
              MORE ABOUT US
            </button></Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;