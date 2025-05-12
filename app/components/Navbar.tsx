'use client'

import { Phone, Mail, X } from 'lucide-react' // Added X for close icon
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react' // Import useState

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#f5f0e9] text-black text-sm py-2 px-4 md:px-8 flex justify-end items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-1 md:space-x-2">
          <Phone className="w-4 h-4" />
          <span>123 456 7890</span>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <Mail className="w-4 h-4" />
          <span>email@SilverclipSalon.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white py-3 px-4 md:px-8 flex items-center justify-between border-b border-gray-200">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/"> {/* Make logo clickable */}
            <a> {/* For Next.js Link to correctly style the Image */}
              <Image
                src="/images/diamond 1.png"
                alt="SilverClip Logo"
                width={80}
                height={50}
                className="object-contain cursor-pointer" // Added cursor-pointer
              />
            </a>
          </Link>
        </div>

        {/* Desktop Navigation Links, Search, and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4 md:space-x-8">
          <nav className="flex space-x-6 text-sm font-light uppercase tracking-wide text-gray-800">
            <Link href="/"><span className="text-pink-500 hover:text-pink-600 transition-colors">Home</span></Link>
            <Link href="/AboutUs"><span className="hover:text-pink-500 cursor-pointer transition-colors">About Us</span></Link>
            <Link href="/BookOnline"><span className="hover:text-pink-500 cursor-pointer transition-colors">Book Online</span></Link>
            <Link href="/MeetOurTeam"><span className="hover:text-pink-500 cursor-pointer transition-colors">Meet Our Team</span></Link>
            <Link href="/ContactUs"><span className="hover:text-pink-500 cursor-pointer transition-colors">Contact Us</span></Link>
          </nav>
          <div className="flex space-x-2">
            <Link href="/login">
              <a className="text-sm px-4 py-1 border border-pink-500 text-pink-500 rounded hover:bg-pink-500 hover:text-white transition">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a className="text-sm px-4 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
                Sign Up
              </a>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" /> // Show X icon when menu is open
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Conditional Rendering */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full top-full left-0"> {/* Positioned below navbar */}
          <nav className="flex flex-col space-y-2 p-4 text-sm uppercase tracking-wide text-gray-800">
            <Link href="/"><span onClick={toggleMobileMenu} className="block py-2 text-pink-500 hover:bg-gray-100 rounded px-2">Home</span></Link>
            <Link href="/AboutUs"><span onClick={toggleMobileMenu} className="block py-2 hover:text-pink-500 hover:bg-gray-100 rounded px-2 cursor-pointer">About Us</span></Link>
            <Link href="/BookOnline"><span onClick={toggleMobileMenu} className="block py-2 hover:text-pink-500 hover:bg-gray-100 rounded px-2 cursor-pointer">Book Online</span></Link>
            <Link href="/MeetOurTeam"><span onClick={toggleMobileMenu} className="block py-2 hover:text-pink-500 hover:bg-gray-100 rounded px-2 cursor-pointer">Meet Our Team</span></Link>
            <Link href="/ContactUs"><span onClick={toggleMobileMenu} className="block py-2 hover:text-pink-500 hover:bg-gray-100 rounded px-2 cursor-pointer">Contact Us</span></Link>
          </nav>
          <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
            <Link href="/login">
              <a onClick={toggleMobileMenu} className="block text-center text-sm px-4 py-2 border border-pink-500 text-pink-500 rounded hover:bg-pink-500 hover:text-white transition">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a onClick={toggleMobileMenu} className="block text-center text-sm px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition">
                Sign Up
              </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}