'use client'

import { Phone, Mail, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
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
      <div className="bg-white py-3 px-4 md:px-8 flex items-center justify-between border-b border-gray-200">  {/* Corrected: flex items-center */}
        {/* Logo */}
        <div className="flex items-center">  {/* Logo is now centered with other elements*/}
          <Image
            src="/images/diamond 1.png" // Replace with your actual logo file
            alt="SilverClip Logo"
            width={80}
            height={50}
            className="object-contain bg-white"
          />
        </div>

        {/* Navigation Links, Search, and Auth Buttons */}
<div className="flex items-center space-x-4 md:space-x-8">
  {/* Navigation Links */}
  <nav className="hidden md:flex space-x-6 text-sm font-light uppercase tracking-wide text-gray-800">
    <Link href="/"><span  className="text-pink-500">Home</span></Link>
    <Link href="/AboutUs"><span className="hover:text-pink-500 cursor-pointer">About Us</span></Link>
    <Link href="/BookOnline"><span className="hover:text-pink-500 cursor-pointer">Book Online</span></Link>
    <Link href="/MeetOurTeam"><span className="hover:text-pink-500 cursor-pointer">Meet Our Team</span></Link>
    <Link href="/ContactUs"><span className="hover:text-pink-500 cursor-pointer">Contact Us</span></Link>
  </nav>

  {/* Search Icon */}
  <Search className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />

  {/* Login / Sign Up Buttons */}
  <div className="hidden md:flex space-x-2">
    <a
      href="/login"
      className="text-sm px-4 py-1 border border-pink-500 text-pink-500 rounded hover:bg-pink-500 hover:text-white transition"
    >
      Login
    </a>
    <a
      href="/register"
      className="text-sm px-4 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
    >
      Sign Up
    </a>
  </div>
</div>

         {/* Mobile Menu Icon (Optional, for smaller screens) - will need to implement functionality */}
        <div className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>


      </div>
    </header>
  )
}