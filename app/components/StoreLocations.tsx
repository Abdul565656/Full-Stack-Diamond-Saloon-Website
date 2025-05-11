// app/components/StoreLocations.tsx
import React from 'react';
import StoreCard from './StoreCard'; // Assuming StoreCard.tsx is in the same directory
import { IconType } from 'react-icons';
import { BsTelephoneFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

// --- Type Definitions ---
export interface OpeningHour {
  day: string;
  time: string;
}

export interface ContactInfo {
  icon: IconType;
  text: string;
  href: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  imageUrl: string; // This is crucial, ensure it's always a string
  openingHours: OpeningHour[];
  outOfHoursNote?: string; // Optional
  bookingTitle: string;
  contactDetails: ContactInfo[];
  bookNowLink: string;
  viewSalonLink: string;
}

// --- Store Data ---
// Ensure every object here is complete and matches the 'Store' interface.
// Especially check 'imageUrl'.
const storesData: Store[] = [
  {
    id: 'london',
    name: 'SILVERCLIP LONDON STORE',
    address: '220 Brompton Rd, Kensington, London SW3 2BB',
    imageUrl: '/images/salon-interior.jpg', // Ensure this image exists in public/images/
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
    imageUrl: '/images/haircut-action.jpg', // Ensure this image exists in public/images/
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

// --- StoreLocations Component ---
const StoreLocations: React.FC = () => {
  // Log the data to ensure it's what we expect before mapping
  console.log("StoreLocations rendering with storesData:", storesData);

  if (!storesData || storesData.length === 0) {
    console.warn("StoreLocations: storesData is empty or undefined.");
    return <div className="text-center py-10">No store locations available at the moment.</div>;
  }

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {storesData.map((store, index) => {
            // Log each store object being passed to StoreCard
            console.log(`StoreLocations: Mapping store at index ${index}:`, store);

            // Critical check: If a store object within the array is somehow undefined or doesn't have an id
            if (!store || !store.id) {
              console.error(`StoreLocations: Invalid store data at index ${index}:`, store);
              return <div key={`error-${index}`} className="p-4 bg-red-100 text-red-700">Error loading store data.</div>;
            }
            return <StoreCard key={store.id} store={store} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default StoreLocations;