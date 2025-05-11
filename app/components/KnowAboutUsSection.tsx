// components/KnowAboutUsSection.tsx
import React from 'react';
import Image from 'next/image'; // Using Next.js Image component for optimization

const KnowAboutUsSection: React.FC = () => {
  // Placeholder image URL for the textured background.
  // Replace '/images/light-speckled-texture.jpg' with the actual path to your texture image in the /public folder.

  return (
    <section
      className="py-16 md:py-24 lg:py-28 bg-no-repeat bg-cover bg-[#f5f0e9] bg-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          {/* Text Content Column (Left) */}
          <div className="mb-12 md:mb-0 text-gray-800"> {/* Text color slightly darker for better contrast on light texture */}
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-2 tracking-wide">
              KNOW ABOUT
            </h2>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase mb-6 tracking-wide">
              WHO WE ARE
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-4">
              We are a group of highly qualified and experienced hairdressers,
              stylists & colour experts.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-8">
              Having worked in the UK and abroad we can provide a very high
              standard of services covering- hair cut, colouring and treatments.
              We will be delighted to see you at our salon. Lorem ipsum dolor site
              amet, consecteturjusto adipiscing elit, sed does eiusmod tempor
              incididunt ut labore magna.
            </p>

            <a
              href="#" // Replace with your actual link (e.g., /about-us)
              className="inline-block px-6 py-3 border border-gray-600 text-gray-700
                         uppercase text-xs sm:text-sm font-semibold tracking-wider
                         hover:bg-gray-700 hover:text-white transition-colors duration-300"
            >
              More About Us
            </a>
          </div>

          {/* Image Column (Right) */}
          <div>
            {/*
              Replace with your actual image for this section.
              Dimensions are examples; adjust based on your image's aspect ratio.
            */}
            <Image
              src="/images/barber-cutting-hair.webp" // Replace with your image path in the /public folder
              alt="Barber giving a haircut"
              width={600} // Example width, adjust as needed
              height={400} // Example height, adjust to maintain aspect ratio
              className="w-full h-auto object-cover" // Ensures the image is responsive
              // Optional: add rounded corners if desired, e.g., rounded-md or rounded-lg
            />
            {/* Fallback for local dev or simple img tag:
            <img
              src="https://via.placeholder.com/600x400/cccccc/969696?text=Haircut+Scene"
              alt="Barber giving a haircut"
              className="w-full h-auto object-cover"
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowAboutUsSection;