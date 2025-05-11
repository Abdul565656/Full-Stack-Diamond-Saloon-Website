// components/StoreSection.tsx

import React from 'react';
import Image from 'next/image';

interface StoreItemProps {
  imageSrc: string;
  altText: string;
  storeName: string;
  buttonText: string;
}

const StoreItem: React.FC<StoreItemProps> = ({ imageSrc, altText, storeName, buttonText }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full md:w-96">  {/*  Removed aspect-square/auto, using fixed width, and using object-cover */}
        <Image
          src={imageSrc}
          alt={altText}
          width={400} // Adjust width as needed
          height={300} // Adjust height as needed (adjust the values to match the aspect ratio of the images.
          className="rounded-md object-cover"
        />
      </div>
      <h3 className="text-lg font-medium mt-4">{storeName}</h3>
      <button className="bg-[#e0c3a3] text-black py-2 px-6 rounded-md mt-2 font-medium hover:bg-[#d0b08f] transition duration-200">
        {buttonText}
      </button>
    </div>
  );
};

const StoreSection: React.FC = () => {
  const stores = [
    {
      imageSrc: '/images/store section.png', // Replace with your images
      altText: 'Silverclip London Store',
      storeName: 'SILVERCLIP LONDON STORE',
      buttonText: 'CLICK HERE',
    },
    {
      imageSrc: '/images/store sction 2.png', // Replace with your images
      altText: 'Silverclip Yorkshire Store',
      storeName: 'SILVERCLIP YORKSHIRE STORE',
      buttonText: 'CLICK HERE',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#f9f7f4]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store, index) => (
            <StoreItem key={index} {...store} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSection;