'use client';

import { motion } from 'framer-motion';

export default function ComparisonSection() {
  return (
    <section className="py-32 bg-[#FDFCF8] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-900">
            You know this can.
          </h2>
          <p className="text-2xl md:text-3xl text-gray-500 font-light">
            You also know how it feels after.
          </p>
        </div>

        <div className="flex flex-col items-center mb-24">
          <div className="relative w-48 h-96 md:w-64 md:h-[30rem]">
            {/* Pixelated Can Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-800 via-gray-300 to-blue-900 opacity-80 blur-md scale-95 transform rotate-1"></div>
            
            {/* Pixel Grid Overlay to simulate censorship */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-12 gap-1">
              {Array.from({ length: 96 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-gray-800/20 backdrop-blur-sm"
                  style={{
                    opacity: Math.random() * 0.5 + 0.2
                  }}
                ></div>
              ))}
            </div>

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Outdated Energy</p>
              <p className="text-[10px] text-gray-400">Looks like this.</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Stop chugging synthetic caffeine and sugar bombs.</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-8 border-t-2 border-gray-900 pt-8">
            {/* Headers */}
            <div className="font-bold text-gray-900 text-sm md:text-base">What You're Really Getting</div>
            <div className="font-bold text-gray-400 text-sm md:text-base">Energy Drinks</div>
            <div className="font-bold text-orange-600 text-sm md:text-base">Soluna</div>

            {/* Row 1 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">Caffeine Dose</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">160mg - 300mg (Synthetic)</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">50mg (Natural Green Tea)</div>

            {/* Row 2 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">Support Ingredients</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">Taurine, B-Vitamins (Cheap forms)</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">L-Theanine + Cognizin®</div>

            {/* Row 3 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">Sugar</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">20g - 60g (or Sucralose)</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">1g (Allulose + Monk Fruit)</div>

            {/* Row 4 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">The Feeling</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">Jitters, Anxiety, Crash</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">Calm, Clear, Sustained</div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-lg font-serif italic text-gray-600 mb-8">
              Soluna isn't an upgrade. It's a whole different category.
            </p>
            <a 
              href="#purchase" 
              className="inline-block bg-[#FF4D00] text-white px-10 py-4 rounded-full font-bold hover:bg-[#ff6a2b] transition-all shadow-lg shadow-orange-500/20"
            >
              Make The Switch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}