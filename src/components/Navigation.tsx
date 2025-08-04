'use client'
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [temperatureIntensity, setTemperatureIntensity] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const contactRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!contactRef.current) return;
      
      const contactRect = contactRef.current.getBoundingClientRect();
      const contactCenterX = contactRect.left + contactRect.width / 2;
      const contactCenterY = contactRect.top + contactRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - contactCenterX, 2) + 
        Math.pow(e.clientY - contactCenterY, 2)
      );
      
      const maxDistance = 300;
      const proximity = Math.max(0, (maxDistance - distance) / maxDistance);
      const intensity = Math.pow(proximity, 0.3);
      
      setTemperatureIntensity(intensity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getTemperatureColor = (intensity: number) => {
    const blue = { r: 59, g: 130, b: 246 };
    const red = { r: 239, g: 68, b: 68 };
    
    const r = Math.round(blue.r + (red.r - blue.r) * intensity);
    const g = Math.round(blue.g + (red.g - blue.g) * intensity);
    const b = Math.round(blue.b + (red.b - blue.b) * intensity);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <>
      {/* Temperature Strip */}
      <div 
        className="h-1 w-full transition-all duration-300 ease-out"
        style={{
          backgroundColor: getTemperatureColor(temperatureIntensity),
          boxShadow: `0 0 20px ${getTemperatureColor(temperatureIntensity)}30`
        }}
      />

      {/* Navigation Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-6 sm:px-8 my-4">
        {/* Navigation */}
        <nav className="flex items-center justify-between border border-gray-100 border-dashed rounded-lg px-6 py-6 sm:px-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="bg-gradient-to-tr from-pink-400 via-pink-300 to-fuchsia-500 p-1 rounded-full">
              <Image
                src="/big-mouth_bucklemeshoe_avatar_2.png"
                alt="Jared Buckley profile avatar"
                width={48}
                height={48}
                className="rounded-full object-cover bg-white"
              />
            </div>
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
                Howsit.
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-zinc-800"></div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex bg-white/80 backdrop-blur-md rounded-full shadow px-6 py-2 space-x-1 text-gray-700 text-sm font-medium">
            <Link href="/#about" className="relative px-3 py-2 rounded-full hover:bg-gray-100 hover:text-black transition-all duration-200">
              About
            </Link>
            <Link href="/writing" className="relative px-3 py-2 rounded-full hover:bg-gray-100 hover:text-black transition-all duration-200 hover:mx-2 flex items-center gap-2">
              Writing
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">WIP</span>
            </Link>
            <Link href="/projects" className="relative px-3 py-2 rounded-full hover:bg-gray-100 hover:text-black transition-all duration-200 hover:mx-2">
              Projects
            </Link>
            <Link href="/contact" ref={contactRef} className="relative px-3 py-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:mx-2">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 md:hidden z-50 animate-in slide-in-from-top-2 duration-200 px-6 sm:px-8">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4 space-y-2">
              <Link 
                href="/#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-black rounded-lg transition-all duration-200"
              >
                About
              </Link>
              <Link 
                href="/writing" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-black rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                Writing
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">WIP</span>
              </Link>
              <Link 
                href="/projects" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 hover:text-black rounded-lg transition-all duration-200"
              >
                Projects
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 