'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black bg-[#F2F0E9]">
      <div className="flex items-stretch h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors group">
          <span className="text-xl font-black tracking-tighter uppercase">Soluna_Sys</span>
        </Link>

        {/* Ticker Section */}
        <div className="hidden md:flex flex-1 items-center overflow-hidden border-r border-black bg-white">
          <div className="animate-marquee whitespace-nowrap flex gap-8 text-xs font-mono uppercase tracking-widest">
            <span>/// System Status: Optimal</span>
            <span>/// Batch: 004-A</span>
            <span>/// Next Restock: 24H</span>
            <span>/// Focus Protocol: Active</span>
            <span>/// System Status: Optimal</span>
            <span>/// Batch: 004-A</span>
            <span>/// Next Restock: 24H</span>
            <span>/// Focus Protocol: Active</span>
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

        {/* CTA */}
        <Link 
          href="#purchase" 
          className="flex items-center px-8 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors ml-auto md:ml-0"
        >
          Initialize
        </Link>
      </div>
    </header>
  );
}
