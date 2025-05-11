// components/OurArtistsSection.tsx
import React from 'react';
import Image from 'next/image'; // Using Next.js Image component for optimization

const OurArtistsSection: React.FC = () => {
  return (
    // The very light textured background above this section would be part of the parent
    // or a preceding section. This component focuses on the dark area.
    <section className="bg-[#1C1C1C] text-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div className="mb-10 md:mb-0">
            {/*
              Replace with your actual image.
              Dimensions are examples; adjust based on your image's aspect ratio.
              The image in the example looks like it might be around 16:9 or 4:3.
              I'm using a placeholder for now.
            */}
            <Image
              src="/images/saloon 4.webp" // Replace with your image path in the /public folder
              alt="Our talented team of hair artists"
              width={700} // Example width, adjust as needed
              height={475} // Example height, adjust to maintain aspect ratio
              className="w-full h-auto object-cover" // Ensures the image is responsive and covers its area
              // Optional: add rounded corners if desired, e.g., rounded-lg
            />
            {/* Fallback for local dev if Next/Image has issues or for simple img tag:
            <img
              src="https://via.placeholder.com/700x475/cccccc/969696?text=Our+Artists"
              alt="Our talented team of hair artists"
              className="w-full h-auto object-cover"
            /> */}
          </div>

          {/* Text Content Column */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-6 tracking-wide">
              Our Artists
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              An award winning Hair Salon based in London. Silverclip salon offers
              a haven of calm and indulgent luxury lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua diam volutpat.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8 text-sm sm:text-base">
              Nulla malesuada pellentesque elit eget gravida cum sociis natoque
              penatibus. Consequat semper viverra nam libero.
            </p>
            <a
              href="#" // Replace with your actual link
              className="inline-block px-8 py-3 border border-gray-400 text-gray-200 
                         uppercase text-xs sm:text-sm font-semibold tracking-wider
                         hover:bg-white hover:text-black transition-colors duration-300"
            >
              Meet The Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurArtistsSection;