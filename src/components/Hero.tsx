'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Zap, Clock, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen pt-8 md:pt-20 flex flex-col justify-center border-b border-black/10 bg-[#FDFCF8] relative overflow-hidden">
      
      {/* Right Split Background */}
      <div className="absolute top-0 right-0 w-full lg:w-[38%] h-full bg-[#F5F5F0] hidden lg:block"></div>

      <div className="container mx-auto px-6 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
          {/* Left: Main Content */}
          <div className="lg:col-span-7">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-mono mb-6 rounded-full">
              New Formula 2.0
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-4 text-[#1a1a1a]">
              Natural Support for<br/>
              <span className="text-[#FF3300]">Focus & Flow.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#1a1a1a]/80 max-w-xl leading-relaxed mb-6 font-light">
              A daily gummy for calm, clear energy. No jitters, no crash. Just steady mental performance when you need it most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="#purchase" className="bg-[#FF3300] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e62e00] transition-colors text-center shadow-lg shadow-orange-500/20">
                Start Your Focus Routine
              </Link>
              <Link href="#science" className="px-8 py-4 font-bold text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-center">
                How It Works
              </Link>
            </div>

            {/* Validation Stats - Above the Fold */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-[#1a1a1a] font-bold text-lg md:text-xl">
                        <Zap className="w-5 h-5 text-[#FF3300]" />
                        <span>Steady</span>
                    </div>
                    <div className="text-sm text-[#1a1a1a]/60 font-medium">Sustained Energy</div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1 text-[#1a1a1a] font-bold text-lg md:text-xl">
                        <Clock className="w-5 h-5 text-[#FF3300]" />
                        <span>30m</span>
                    </div>
                    <div className="text-sm text-[#1a1a1a]/60 font-medium">Fast Onset</div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1 text-[#1a1a1a] font-bold text-lg md:text-xl">
                        <Star className="w-5 h-5 text-[#FF3300]" />
                        <span>4.9/5</span>
                    </div>
                    <div className="text-sm text-[#1a1a1a]/60 font-medium">Customer Rating</div>
                </div>
            </div>
            
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#1a1a1a]/50 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                30-Day Satisfaction Guarantee
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ships in 24 Hours
              </div>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end pt-8 lg:pt-0">
             <div className="relative z-10 transform transition-transform duration-700 hover:scale-105">
                <div className="w-72 h-96 md:w-80 md:h-[450px] bg-white rounded-3xl shadow-2xl shadow-orange-500/10 flex items-center justify-center relative border border-gray-100">
                    <div className="absolute inset-2 border border-gray-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                        <span className="font-bold text-4xl tracking-tight text-[#1a1a1a]">Soluna</span>
                        <span className="font-mono text-xs mt-3 text-[#FF3300] bg-orange-50 px-3 py-1 rounded-full">Daily Focus</span>
                    </div>
                </div>
             </div>
             {/* Background Blur */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-200/40 rounded-full blur-[80px] -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
