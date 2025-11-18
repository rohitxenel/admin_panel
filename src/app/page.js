'use client';

import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'; // Import Next.js Image component




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

  //i am designing the function where i can animate the slogan 
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  //slogan array 
    const slogans = [
  "Where Innovation Meets Craftsmanship",
  "Engineered for Precision",
  "Smart Tools for Smarter Projects"
];
//this effect will run the animation which is currently running 

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlogan((prev) => (prev + 1) % slogans.length);
  }, 3000);

  return () => clearInterval(interval);
}, []);

  

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left section - Branding with Logo */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex flex-col justify-between p-5 md:p-12 relative overflow-hidden">
        <div className="z-10">
          {/* Logo Section */}
          <div className="flex items-center mb-16">
            {/* Replace with your actual logo */}
            <div className="relative w-32 h-32 mr-3">

               <div className="absolute inset-0 bg-indigo-400/30 blur-2xl rounded-full"></div>
              
              <Image
               // src="/Nas-Logo.svg" // Update with your logo path
               //here i am updating my company logo 
               src="/company_logo.png" 
               alt="Company Logo"
                fill
                className="object-contain"
                priority
              />
              
              
            </div>
            {/* <div className="text-2xl font-bold">
              <span className="bg-white text-indigo-800 rounded-lg px-2 py-1 mr-2">Channel Partner</span>
            </div> */}
          </div>
<div className="max-w-md">
  <h1 className="text-4xl font-bold mb-4">
    Welcome to the G&R Control Hub
  </h1>

  <p className="text-lg text-indigo-200 mb-8 leading-relaxed">
    Manage elevator cab projects with confidence and clarity. 
    From material selections to design approvals, your entire 
    workflow is centralized in a secure, intuitive system built 
    for performance.
  </p>

  <div className="flex items-center space-x-2 text-indigo-200">
    <div className="w-8 h-px bg-indigo-400"></div>
    <span className="tracking-wide">
      Where Innovation Meets Craftsmanship
    </span>
  </div>
</div>
<p className="text-indigo-200 text-lg mt-4 h-6 transition-all duration-700 ease-in-out animate-fade">
  {slogans[currentSlogan]}
</p>
        </div>

      {/*  <div className="z-10">
          <p className="text-indigo-300 text-sm">
            © {new Date().getFullYear()} RideXtra. All rights reserved.
          </p>
        </div>
      */}

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          
           {/* This will create the floating shape in the left side  Floating Shape 1 */}
          <div className="floating-shape bg-indigo-500/20"></div>

          {/* Floating Shape 2 */}
          <div className="floating-shape bg-purple-500/20 delay-700"></div>

          {/* Floating Shape 3 */}
          <div className="floating-shape bg-pink-500/20 delay-1500"></div>

          {/* Gradient Rings */}
<div className="absolute -top-40 -left-40 w-96 h-96 rounded-full border border-indigo-400/20"></div>
<div className="absolute top-20 right-10 w-72 h-72 rounded-full border border-purple-400/20"></div>
<div className="absolute bottom-10 left-20 w-64 h-64 rounded-full border border-indigo-300/10"></div>


       </div>
      </div>

      {/* Right section - Login form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
            <p className="text-gray-600">Access your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">  
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                {/* <a
                  href="#"
                  className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Forgot password?
                </a> */}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
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