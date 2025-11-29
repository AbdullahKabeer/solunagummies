'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-white/30' : 'bg-transparent'}`}>
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
        <Link 
          href="#purchase" 
          className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
