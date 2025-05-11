// app/login/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import Image from 'next/image'; // Import next/image

// --- SVG Icons ---
// Using react-icons for consistency, but your local SVGs are fine too if preferred.
// If using your local SVGs, ensure they are typed with React.FC
import { FaUserAlt as UserIcon, FaLock as LockIcon, FaArrowRight as LoginArrowIcon } from 'react-icons/fa';

const salonImages = [
  '/images/saloon 1.png', // Ensure these paths are correct relative to the /public folder
  '/images/saloon 2.png',
  '/images/saloon 3.webp',
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'success' | 'error' | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % salonImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setMessage('');
    setLoginStatus(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful! Redirecting to your dashboard...');
        setLoginStatus('success');
        setTimeout(() => {
          router.push('/dashboard'); // Or your desired redirect path
        }, 1500);
      } else {
        setMessage(data.error || 'Login failed. Please check your credentials.');
        setLoginStatus('error');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    } catch (_error) { // Prefixed error with underscore as it's not used
      console.error("Login API error:", _error); // Optional: log the actual error
      setMessage('An unexpected error occurred. Please try again.');
      setLoginStatus('error');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClasses = "w-full p-3.5 pl-12 border rounded-lg focus:outline-none placeholder-transparent peer transition-all duration-150 ease-in-out shadow-sm hover:shadow-md";
  const inputNormalClasses = "bg-white border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500";
  const inputDisabledClasses = "bg-slate-100 border-slate-200 cursor-not-allowed";
  const labelBaseClasses = "absolute left-3 -top-2.5 bg-white px-1.5 text-xs text-slate-500 transition-all duration-150 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-11 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-pink-600";

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row items-stretch justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100">
        <div className="hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center p-8 lg:p-12 relative">
          <div className="relative h-[500px] lg:h-[600px] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl group">
            {salonImages.map((src, index) => (
              <Image // Using next/image
                key={src}
                src={src}
                alt={`Salon Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className={`transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}
                priority={index === 0}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg transform transition-all duration-500 group-hover:scale-105">
              <h3 className="text-2xl font-semibold text-pink-700 mb-2">Diamond Saloon Ladies</h3>
              <p className="text-slate-600 text-sm">✨ Step into your glow, experience luxury and transformation</p>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {salonImages.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-8">
          <form
            onSubmit={handleLogin}
            className={`bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-md p-8 md:p-10 transform transition-all duration-700 ease-out border-t-4 border-pink-500 ${isMounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-5'} ${isShaking ? 'animate-shake' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-pink-700 text-center mb-3 font-serif tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-slate-500 text-center mb-8 text-sm md:text-base">Login to access your Ladoes Lounge account</p>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input type="email" id="email" className={`${inputBaseClasses} ${isLoading ? inputDisabledClasses : inputNormalClasses}`} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              <label htmlFor="email" className={labelBaseClasses}>Email Address</label>
            </div>
            <div className="relative mb-7">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input type="password" id="password" className={`${inputBaseClasses} ${isLoading ? inputDisabledClasses : inputNormalClasses}`} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
              <label htmlFor="password" className={labelBaseClasses}>Password</label>
            </div>
            <button type="submit" disabled={isLoading} className="w-full group relative flex items-center justify-center bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3.5 px-4 rounded-lg text-base font-semibold hover:from-pink-600 hover:to-rose-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed shadow-md">
              {isLoading ? (
                <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Processing... </>
              ) : (
                <> Login <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 ease-in-out"><LoginArrowIcon className="w-5 h-5"/></span> </>
              )}
            </button>
            {message && (
              <p className={`text-sm text-center mt-6 p-3 rounded-md ${ loginStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {message}
              </p>
            )}
            <div className="text-center mt-8">
              <a href="/register" className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline transition-colors duration-150">
                Don&apos;t have an account? Sign Up {/* Corrected unescaped entity */}
              </a>
            </div>
          </form>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}