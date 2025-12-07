'use client';

import { Clock, Calendar, Zap } from 'lucide-react';

export default function ProductShowcase() {
  return (
    <section id="product" className="py-12 md:py-16 bg-white border-b border-black/10">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <div className="inline-block bg-[#FF3300] text-white px-3 py-1 text-xs font-mono mb-6 rounded-full">
              Daily Ritual
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1a1a1a]">
              Simple Ritual. Daily Impact.
            </h2>
            <p className="text-base sm:text-lg text-[#1a1a1a]/80 leading-relaxed max-w-2xl mx-auto">
              Designed to integrate seamlessly into your morning routine. Minimal friction. Maximum output.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase mb-2">Timing</h4>
                  <p className="font-mono text-xs text-gray-500">Take 2 gummies daily. Morning or early afternoon deployment recommended.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase mb-2">Consistency</h4>
                  <p className="font-mono text-xs text-gray-500">Cumulative benefits. Cognizin® and Saffron efficacy increases with daily saturation.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 border border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold uppercase mb-2">Output</h4>
                  <p className="font-mono text-xs text-gray-500">Sustained focus. No crash. Optimized for deep work sessions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square border border-black bg-gray-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[size:20px_20px]"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl font-black opacity-10">01</div>
                    <div className="font-mono text-xs uppercase tracking-widest mt-4">Visual_Placeholder</div>
                  </div>
               </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FF3300] border border-black z-[-1]"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-black z-[-1]"></div>
          </div>

        </div>

      </div>
    </section>
  );
}
