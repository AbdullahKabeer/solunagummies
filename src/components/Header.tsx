'use client';

import Link from 'next/link';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black bg-[#F2F0E9]">
      <div className="flex items-stretch h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors group">
          <span className="text-xl font-black tracking-tighter uppercase">SOLUNA</span>
        </Link>

        {/* Ticker Section */}
        <div className="hidden md:flex flex-1 items-center overflow-hidden border-r border-black bg-white">
          <div className="animate-marquee whitespace-nowrap flex gap-8 text-xs font-mono uppercase tracking-widest">
            <span>Free Shipping on All Subscriptions</span>
            <span>30-Day Money-Back Guarantee</span>
            <span>Science-Backed Ingredients</span>
            <span>Focus & Energy</span>
            <span>Free Shipping on All Subscriptions</span>
            <span>30-Day Money-Back Guarantee</span>
            <span>Science-Backed Ingredients</span>
            <span>Focus & Energy</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex">
          {['Benefits', 'Ingredients', 'Science'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="flex items-center px-6 border-r border-black text-sm font-mono uppercase hover:bg-[#FF3300] hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* User & Cart Actions */}
        <div className="flex items-stretch border-r border-black ml-auto md:ml-0">
          {user ? (
            <button 
              onClick={logout}
              className="flex items-center px-4 md:px-6 border-l md:border-l-0 border-black hover:bg-[#FF3300] hover:text-white transition-colors"
              title={`Signed in as ${user.name}`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <Link 
              href="/login"
              className="flex items-center px-4 md:px-6 border-l md:border-l-0 border-black hover:bg-[#FF3300] hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center px-4 md:px-6 border-l border-black hover:bg-[#FF3300] hover:text-white transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-3 right-3 md:right-4 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white group-hover:bg-white group-hover:text-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* CTA */}
        <Link 
          href="#purchase" 
          className="hidden md:flex items-center px-8 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </header>
  );
}
