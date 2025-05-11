// app/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import Image from 'next/image'; // Import next/image if using for background

// --- SVG Icons (using react-icons for consistency) ---
import { FaEnvelope as EmailIcon, FaLock as LockIcon, FaUserPlus as UserPlusIcon } from 'react-icons/fa';

const bgImages = [
  '/images/bg1.jpg', // Ensure these paths are correct relative to the /public folder
  '/images/bg2.jpg',
  '/images/bg3.jpg'
];

const formContainerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'circOut' },
  },
};


export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Registered successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage(data.error || data.message || '❌ Registration failed. Please try again.');
      }
    } catch (_err) { // Prefixed err with underscore
      console.error("Registration API error:", _err); // Optional: log the actual error
      setMessage('❌ An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
            {bgImages.map((img, i) => (
            i === bgIndex && (
                <motion.div
                key={i}
                className="absolute inset-0" // For next/image, parent needs to be relative
                // style={{ backgroundImage: `url(${img})` }} // If using CSS background
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                >
                  {/* If using next/image for background slides (more complex setup for full cover) */}
                  <Image
                    src={img}
                    alt={`Background ${i + 1}`}
                    layout="fill"
                    objectFit="cover"
                    priority={i === 0}
                  />
                </motion.div>
            )
            ))}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
      </div>

      <main className="relative z-10 flex flex-grow items-center justify-center px-4 py-12 md:py-16">
        <motion.form
          onSubmit={handleRegister}
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-slate-900/70 via-black/60 to-slate-900/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl px-8 md:px-12 py-10 md:py-14 w-full max-w-lg space-y-7 text-white"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
              Create Account
            </h2>
            <p className="text-slate-300 text-sm md:text-base">Join us and discover a world of elegance.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="absolute inset-y-0 left-0 top-6 pl-3.5 flex items-center pointer-events-none">
              <EmailIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input id="email" name="email" type="email" className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-150 ease-in-out shadow-sm" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
             <div className="absolute inset-y-0 left-0 top-6 pl-3.5 flex items-center pointer-events-none">
              <LockIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input id="password" name="password" type="password" className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-150 ease-in-out shadow-sm" placeholder="•••••••• (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isLoading} />
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
            <div className="absolute inset-y-0 left-0 top-6 pl-3.5 flex items-center pointer-events-none">
              <LockIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input id="confirmPassword" name="confirmPassword" type="password" className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all duration-150 ease-in-out shadow-sm" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} disabled={isLoading} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <button type="submit" disabled={isLoading} className="w-full group relative flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Creating Account... </>
              ) : (
                <> <UserPlusIcon className="w-5 h-5 mr-2" /> Register </>
              )}
            </button>
          </motion.div>
          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-center text-sm p-3 rounded-md ${ message.includes('successfully') ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.div variants={itemVariants} className="text-center text-sm text-slate-300">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-pink-400 hover:text-pink-300 hover:underline transition-colors duration-150">
              Log In
            </a>
          </motion.div>
        </motion.form>
      </main>
      <FooterSection />
    </div>
  );
}