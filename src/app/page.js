'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'; 
import { AnimatePresence, motion } from 'framer-motion'; //NOTE Framer Motion Components You must have 'framer-motion' installed: npm install framer-motion

// --- COMPONENT FOR ANIMATED SLOGAN ---
// This handles the smooth cross-fade animation for the slogans.
const SloganAnimator = ({ slogans, currentSlogan }) => {
  const SloganVariants = {
    // Defines the starting state (invisible, slightly down)
    initial: { opacity: 0, y: 10 },
    // Defines the active state (visible, centered)
    animate: { opacity: 1, y: 0 },
    // Defines the exiting state (invisible, slightly up)
    exit: { opacity: 0, y: -10 },
  };

  return (
    // 'mode="wait"' ensures the exiting slogan finishes before the new one starts
    <div className="text-cyan-200 text-lg mt-4 h-8 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentSlogan} // KEY must change to trigger the animation
          variants={SloganVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-full"
        >
          {slogans[currentSlogan]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
// ------------------------------------


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log("fkjhdhfh==============")
    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }

      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SLOGAN ANIMATION LOGIC ---
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  const slogans = [
    "Where Innovation Meets Craftsmanship",
    "Engineered for Precision",
    "Smart Tools for Smarter Projects"
  ];
  
  // Set interval to 4 seconds for smoother readability
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [slogans.length]);
  // ------------------------------

  

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* LEFT PANEL - G&R BRANDING SIDE */}
      {/* 1. Updated Gradient to Cyan/Blue Palette (Structural Look) */}
      <div className="md:w-1/2 bg-gradient-to-br from-cyan-800 to-blue-900 text-white flex flex-col justify-between p-5 md:p-12 relative overflow-hidden">
        
        {/* 2. Added subtle geometric background overlay (Simulated Grid) */}
        {/* NOTE: You must provide your own image for '/geometric-grid.svg' */}
        {/* New CSS Pattern Background */}
         <div className="absolute inset-0 z-0 opacity-10 bg-repeat bg-cross-lines"></div>

        <div className="z-10">
          {/* Logo Section - Styled for G&R Cube Look */}
            
            <div className="relative w-49 h-16 p-28">
               <Image
                 src="/company_logo.png" // Using the path you provided
                 alt="G&R Custom Elevator Cabs Logo"
                 fill
                 className="object-contain"
                 priority
               />
            </div>
          
          
          <div className="max-w-md">
            {/* 3. Updated Main Heading Text */}
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              Welcome to the G&R Control Hub
            </h1>

            <p className="text-lg text-cyan-100/90 mb-8 leading-relaxed">
              Manage elevator cab projects with confidence and clarity. 
              From material selections to design approvals, your entire 
              workflow is centralized in a secure, intuitive system built 
              for performance.
            </p>

            <div className="flex items-center space-x-2 text-cyan-200/70 pt-2 border-t border-cyan-400/50">
               <div className="w-8 h-px bg-cyan-400"></div>
               <span className="tracking-wide">
                 Where Innovation Meets Craftsmanship
               </span>
            </div>
          </div>
          
          {/* 4. Integrated the new Slogan Animator component */}
          <SloganAnimator slogans={slogans} currentSlogan={currentSlogan} />
        </div>

        {/* Footer: Corrected Branding */}
        <div className="z-10 mt-10">
          <p className="text-cyan-300/70 text-sm">
            ©️ {new Date().getFullYear()} G&R Custom Elevator Cabs. All rights reserved.
          </p>
        </div>
        
        {/* Decorative elements - Adjusted colors to match the Cyan/Blue theme */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-600 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
        
      </div>

      {/* RIGHT PANEL - Login form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
            {/* Corrected branding */}
            <p className="text-gray-600">Access your G&R Control Hub</p> 
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  // 5. Sharper corners and Cyan focus ring
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  // 5. Sharper corners and Cyan focus ring
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-cyan-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-cyan-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              // 6. Cyan/Blue Gradient and sharper corners
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in <FiArrowRight className="ml-2" />
                </span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}