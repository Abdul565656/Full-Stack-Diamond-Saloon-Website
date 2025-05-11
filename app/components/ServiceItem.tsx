// components/ServiceItem.tsx
"use client"

import React from 'react';
import { IconType } from 'react-icons';

interface ServiceItemProps {
  icon: IconType;
  title: string;
  description: string;
  buttonText: string;
  buttonStyle: 'primary' | 'secondary';
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon: Icon, title, description, buttonText, buttonStyle }) => {
  const buttonClasses = buttonStyle === 'primary'
    ? 'bg-[#e0c3a3] text-black'
    : 'bg-white text-black border border-black';

  return (
    <div className="bg-white rounded-md shadow-md p-6 text-center">
      {/* Icon */}
      <div className="bg-[#e0c3a3] rounded-md w-12 h-12 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 text-sm mb-4">{description}</p>
      <button className={`${buttonClasses} py-2 px-4 rounded-md font-medium transition duration-200`}>
        {buttonText}
      </button>
    </div>
  );
};

export default ServiceItem;