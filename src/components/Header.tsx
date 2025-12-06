'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show/Hide logic
          // Hide if scrolling down AND past 500px (approx hero height)
          if (currentScrollY > lastScrollY.current && currentScrollY > 500) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current || currentScrollY < 500) {
            // Show if scrolling up OR near top
            setIsVisible(true);
          }

          setIsScrolled(currentScrollY > 10);
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'backdrop-blur-md bg-white/30' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold tracking-tighter text-gray-900 font-serif italic">
          Soluna
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <Link href="#benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">Benefits</Link>
          <Link href="#ingredients" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">Ingredients</Link>
          <Link href="#science" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">Science</Link>
          <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-wide">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/search" className="hidden md:block text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
          <Link 
            href="#purchase" 
            className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
