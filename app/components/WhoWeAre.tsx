// components/WhoWeAreSection.tsx
import React from 'react';
const WhoWeAreSection: React.FC = () => {
  return (
    <>
      {/* Main dark "WHO WE ARE" banner */}
      {/* Using a custom hex color close to the image (#1C1C1C).
          Responsive vertical padding (py-*) to adjust height on different screen sizes. */}
      <section className="bg-[#1C1C1C] py-16 sm:py-20 md:py-24 lg:py-16">
        <div className="container mx-auto px-4">
          {/* "WHO WE ARE" text: centered, white, bold, uppercase, large, and with wide letter spacing.
              Font size is responsive (text-3xl to text-5xl). */}
          <h1 className="text-white text-center text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-widest">
            WHO WE ARE
          </h1>
        </div>
      </section>
    </>
  );
};

export default WhoWeAreSection;