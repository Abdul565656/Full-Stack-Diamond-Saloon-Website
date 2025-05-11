// components/BookAServiceSection.tsx

import React from 'react';

const BookAServiceSection: React.FC = () => {
  return (
    <section className="bg-[#282828] py-8">  {/* Background and Padding */}
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">  {/* Centering and Spacing */}

        {/* Left Text */}
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          BOOK A SERVICE
        </h2>

        {/* Right Text and Button */}
        <div className="text-white text-sm flex items-center space-x-4">
          <span>
            To book a service please click the contact us button, or drop us a line to <a href="mailto:email@SilverclipSalon.com" className="underline">email@SilverclipSalon.com</a>
          </span>
          <button className="bg-[#e0c3a3] text-black py-2 px-6 rounded-md font-medium hover:bg-[#d0b08f] transition duration-200">
            CONTACT US
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookAServiceSection;