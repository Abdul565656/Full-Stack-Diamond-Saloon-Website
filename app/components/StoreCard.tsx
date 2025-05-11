// app/components/StoreSection.tsx
import React from 'react';
import Image from 'next/image';
import { IconType } from 'react-icons'; // For icon types
import { BsTelephoneFill } from 'react-icons/bs'; // Example icon
import { MdEmail } from 'react-icons/md';       // Example icon

// --- Type Definitions (kept within this file) ---
interface OpeningHour {
  day: string;
  time: string;
}

interface ContactInfo {
  icon: IconType;
  text: string;
  href: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  openingHours: OpeningHour[];
  outOfHoursNote?: string;
  bookingTitle: string;
  contactDetails: ContactInfo[];
  bookNowLink: string;
  viewSalonLink: string;
}

// --- Store Data (defined directly in this file) ---
const storesData: Store[] = [
  {
    id: 'london',
    name: 'SILVERCLIP LONDON STORE',
    address: '220 Brompton Rd, Kensington, London SW3 2BB',
    imageUrl: '/images/saloon 5.jpg', // Make sure this image exists in public/images/
    openingHours: [
      { day: 'Monday-Friday', time: '10.00 am - 8.00 pm' },
      { day: 'Saturday', time: '9.00 am - 7.00 pm' },
      { day: 'Sunday', time: '10.00 am - 6.00 pm' },
    ],
    outOfHoursNote: '*Out of hours appointments can be arranged through reception.',
    bookingTitle: 'Book London Store',
    contactDetails: [
      { icon: BsTelephoneFill, text: '123 456 7890', href: 'tel:1234567890' },
      { icon: MdEmail, text: 'email@silverclipsalon.com', href: 'mailto:email@silverclipsalon.com' },
    ],
    bookNowLink: '#book-london',
    viewSalonLink: '#view-london',
  },
  {
    id: 'yorkshire',
    name: 'SILVERCLIP YORKSHIRE STORE',
    address: '109 Carlton St, Castleford, Yorkshire WF10 1EE',
    imageUrl: '/images/saloon 6.jpg', // Make sure this image exists in public/images/
    openingHours: [
      { day: 'Monday-Friday', time: '10.00 am - 8.00 pm' },
      { day: 'Saturday', time: '9.00 am - 7.00 pm' },
      { day: 'Sunday', time: '10.00 am - 6.00 pm' },
    ],
    outOfHoursNote: '*Out of hours appointments can be arranged through reception.',
    bookingTitle: 'Book Yorkshire Store',
    contactDetails: [
      { icon: BsTelephoneFill, text: '123 456 7890', href: 'tel:1234567890' },
      { icon: MdEmail, text: 'email@silverclipsalon.com', href: 'mailto:email@silverclipsalon.com' },
    ],
    bookNowLink: '#book-yorkshire',
    viewSalonLink: '#view-yorkshire',
  },
];


// --- Individual Store Card Logic (as an inner function or directly in map) ---
// For clarity, we can keep it as an inner functional component if preferred,
// or inline the JSX directly in the .map()
interface StoreCardProps {
  store: Store;
}

const StoreCardDisplay: React.FC<StoreCardProps> = ({ store }) => {
  // Button Colors
  const primaryButtonBgColor = '#D8D0C5';
  const primaryButtonTextColor = '#6B6A68';
  const secondaryButtonBorderColor = '#D1CFCB';
  const secondaryButtonTextColor = '#82807D';

  // Basic check for store existence, though the parent component should handle empty data
  if (!store || !store.imageUrl || !store.name) {
      console.error("StoreCardDisplay: Store object is missing or incomplete.", store);
      return <div className="p-4 bg-red-100 text-red-700">Incomplete store data for card.</div>;
  }

  return (
    <div className="bg-white w-full shadow-lg rounded-md overflow-hidden">
      <div className="relative w-full h-60 sm:h-72 md:h-64">
        <Image
          src={store.imageUrl}
          alt={store.name}
          layout="fill"
          objectFit="cover"
          priority={store.id === 'london'}
        />
      </div>
      <div className="p-6 text-neutral-800">
        <h2 className="text-xl font-semibold tracking-wider mb-1">{store.name}</h2>
        <p className="text-sm text-neutral-600 mb-5">{store.address}</p>

        <div className="space-y-1 mb-3">
          {store.openingHours?.map((item: OpeningHour) => (
            <div key={item.day} className="flex justify-between text-sm">
              <span className="font-medium text-neutral-700">{item.day}</span>
              <span className="text-neutral-600">{item.time}</span>
            </div>
          ))}
        </div>

        {store.outOfHoursNote && (
          <p className="text-xs text-neutral-500 italic mb-6">{store.outOfHoursNote}</p>
        )}

        <h3 className="text-lg font-semibold mb-3">{store.bookingTitle}</h3>
        <div className="space-y-2 mb-6">
          {store.contactDetails?.map((contact: ContactInfo, index: number) => (
            <a
              key={index}
              href={contact.href}
              className="flex items-center text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              <contact.icon className="mr-3 text-lg" />
              <span>{contact.text}</span>
            </a>
          ))}
        </div>

        <div className="flex space-x-3">
          <a
            href={store.bookNowLink}
            className="flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryButtonBgColor, color: primaryButtonTextColor }}
          >
            BOOK NOW
          </a>
          <a
            href={store.viewSalonLink}
            className="flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-sm border transition-colors hover:bg-gray-50"
            style={{ borderColor: secondaryButtonBorderColor, color: secondaryButtonTextColor }}
          >
            VIEW SALON
          </a>
        </div>
      </div>
    </div>
  );
};


// --- Main StoreSection Component (to be exported and used) ---
const StoreSection: React.FC = () => {
  console.log("StoreSection rendering with storesData:", storesData);

  if (!storesData || storesData.length === 0) {
    console.warn("StoreSection: storesData is empty or undefined.");
    return <div className="text-center py-10">No store locations available at the moment.</div>;
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {storesData.map((store, index) => {
            // Critical check for the store object before passing it
            if (!store || !store.id) {
              console.error(`StoreSection: Invalid store data at index ${index}:`, store);
              return <div key={`error-${index}`} className="p-4 bg-red-100 text-red-700">Error loading store card data.</div>;
            }
            // Using the inner StoreCardDisplay component
            return <StoreCardDisplay key={store.id} store={store} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default StoreSection;