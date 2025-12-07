'use client';

import { Zap, Brain, Smile } from 'lucide-react';

export default function TimelineSection() {
  return (
    <section className="py-16 bg-white border-b border-black/10">
      <div className="container mx-auto px-6">
        
        <div className="mb-12 text-center">
          <div className="inline-block bg-black text-white px-3 py-1 text-xs font-mono mb-4 rounded-full">
            Timeline
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a]">
            How It Starts Working
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-8 left-0 w-full h-px bg-gray-200 hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Step 1 */}
            <div className="relative bg-white pt-8 md:pt-0">
              <div className="w-4 h-4 bg-white border-4 border-gray-200 rounded-full absolute top-6 left-1/2 -translate-x-1/2 hidden md:block z-10"></div>
              <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group bg-gray-50/50 pt-6 pb-4">
                <div className="font-mono text-xs mb-4 text-gray-400 uppercase tracking-wider">30-45 Minutes</div>
                <div className="mb-6">
                  <Zap className="w-8 h-8 text-[#FF3300]" />
                </div>
                <h3 className="text-base font-bold mb-2 text-[#1a1a1a]">Calm Lift</h3>
                <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">
                  L-Theanine helps smooth out the caffeine, creating a state of "relaxed alertness" without the jitters.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white pt-8 md:pt-0">
              <div className="w-4 h-4 bg-white border-4 border-gray-200 rounded-full absolute top-6 left-1/2 -translate-x-1/2 hidden md:block z-10"></div>
              <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group bg-gray-50/50 pt-6 pb-4">
                <div className="font-mono text-xs mb-4 text-gray-400 uppercase tracking-wider">Day 7</div>
                <div className="mb-6">
                  <Brain className="w-8 h-8 text-[#FF3300]" />
                </div>
                <h3 className="text-base font-bold mb-2 text-[#1a1a1a]">Steady Focus</h3>
                <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">
                  Consistent use helps support clearer mornings and better focus endurance throughout your workday.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white pt-8 md:pt-0">
              <div className="w-4 h-4 bg-white border-4 border-gray-200 rounded-full absolute top-6 left-1/2 -translate-x-1/2 hidden md:block z-10"></div>
              <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group bg-gray-50/50 pt-6 pb-4">
                <div className="font-mono text-xs mb-4 text-gray-400 uppercase tracking-wider">Day 30+</div>
                <div className="mb-6">
                  <Smile className="w-8 h-8 text-[#FF3300]" />
                </div>
                <h3 className="text-base font-bold mb-2 text-[#1a1a1a]">Optimized Mind</h3>
                <p className="text-sm text-[#1a1a1a]/80 leading-relaxed">
                  Saffron extract supports a balanced mood and stress resilience, helping you handle pressure with ease.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
