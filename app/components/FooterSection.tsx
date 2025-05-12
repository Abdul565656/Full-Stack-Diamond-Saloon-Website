import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Facebook,
  Youtube,
  Linkedin
} from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-[#121212] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 border-b border-gray-700 pb-10">
        {/* Logo */}
        <div className="md:col-span-1 flex items-start">
          <Image
            src="/images/diamond.png" // Make sure this is in your public/images folder
            alt="SilverClip Store"
            width={160}
            height={60}
            className='text-white'
          />
        </div>

        {/* OUR SALONS */}
        <div>
          <h4 className="font-semibold text-sm mb-4">OUR SALONS</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="uppercase">Daimond LONDON STORE</li>
            <li className="uppercase">Daimond YORKSHIRE STORE</li>
          </ul>
        </div>

        {/* SHOP */}
        <div>
          <h4 className="font-semibold text-sm mb-4">SHOP</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <Link href='/BookOnline'><li>Book Online</li></Link>
            <Link href='/MeetOurTeam'><li>MeetOurTeam</li></Link>
            <Link href='/login'><li>Login</li></Link>
            <Link href='/ContactUs'><li>Contact us</li></Link>
          </ul>
        </div>

        {/* HELP & SUPPORT */}
        <div>
          <h4 className="font-semibold text-sm mb-4">HELP & SUPPORT</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <Link href='/AboutUs'></Link><li>About us</li>
            <li>FAQs</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Return Policy</li>
          </ul>
        </div>

        {/* STAY CONNECTED */}
        <div>
          <h4 className="font-semibold text-sm mb-4">STAY CONNECTED</h4>
          <div className="flex items-center text-sm text-gray-300 mb-3 space-x-2">
            <Phone size={16} className="text-white" />
            <span>123 456 7890</span>
          </div>
          <div className="flex items-center text-sm text-gray-300 mb-4 space-x-2">
            <Mail size={16} className="text-white" />
            <a href="mailto:email@SilverclipSalon.com" className="underline">
              email@DaimondSalon.com
            </a>
          </div>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:opacity-80">
              <Facebook size={20} className="text-white" />
            </a>
            <a href="#" className="hover:opacity-80">
              <Youtube size={20} className="text-white" />
            </a>
            <a href="#" className="hover:opacity-80">
              <Linkedin size={20} className="text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-xs mt-6 px-4">
        © 2022 Daimond Salon - All Rights Reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
