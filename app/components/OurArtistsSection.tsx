// components/OurArtistsSection.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OurArtistsSection: React.FC = () => {
  return (
    <section className="bg-[#f5f0e9] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center">

          {/* Text Content (Left side) */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              OUR ARTISTS
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
            <Link href='/MeetOurTeam'><button className="bg-[#e0c3a3] text-black py-2 px-6 rounded-md font-medium hover:bg-[#d0b08f] transition duration-200">
              MEET THE TEAM
            </button></Link>
          </div>

          {/* Image (Right side) */}
          <div className="md:w-1/2 mt-8 md:mt-0 md:ml-8">
            <Image
              src="/images/ladies artists.jpg" // Replace with your image
              alt="Our Artists"
              width={600} // Adjust width as needed
              height={400} // Adjust height as needed  (or whatever your aspect ratio requires)
              className="rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurArtistsSection;