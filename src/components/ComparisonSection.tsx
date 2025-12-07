'use client';

import { Check, X } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#FDFCF8] border-b border-black/10">
      <div className="container mx-auto px-6">
        
        <div className="mb-12 text-center">
          <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 text-xs font-mono mb-4 rounded-full">
            Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a1a1a]">
            What to Expect
          </h2>
        </div>

        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          <div className="min-w-[600px] md:min-w-[800px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-gray-500 font-mono text-xs uppercase tracking-wider">
              <div className="p-6">Feature</div>
              <div className="p-6 text-[#FF3300] font-bold">Soluna</div>
              <div className="p-6">Coffee</div>
              <div className="p-6">Energy Drinks</div>
            </div>

            {/* Rows */}
            {[
              { label: "Natural Caffeine Source", soluna: true, coffee: true, energy: false },
              { label: "Sustained Energy Release", soluna: true, coffee: false, energy: false },
              { label: "No Jitters / Anxiety", soluna: true, coffee: false, energy: false },
              { label: "No Crash Effect", soluna: true, coffee: false, energy: false },
              { label: "Digestive Comfort", soluna: true, coffee: "Varies", energy: "Varies" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <div className="p-6 py-8 font-bold text-sm text-[#1a1a1a] flex items-center">
                  {row.label}
                </div>
                <div className="p-6 py-8 flex items-center">
                  {row.soluna === true ? <div className="bg-orange-100 p-1 rounded-full"><Check className="w-5 h-5 text-[#FF3300]" /></div> : <span className="font-mono text-xs">{row.soluna}</span>}
                </div>
                <div className="p-6 py-8 flex items-center">
                  {row.coffee === true ? <Check className="w-5 h-5 text-gray-400" /> : row.coffee === false ? <X className="w-5 h-5 text-gray-300" /> : <span className="font-mono text-xs text-gray-500">{row.coffee}</span>}
                </div>
                <div className="p-6 py-8 flex items-center">
                  {row.energy === true ? <Check className="w-5 h-5 text-gray-400" /> : row.energy === false ? <X className="w-5 h-5 text-gray-300" /> : <span className="font-mono text-xs text-gray-500">{row.energy}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-[10px] font-mono text-gray-400 text-center uppercase tracking-widest">
          *Based on user reported experiences. Individual results may vary.
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="#purchase" 
            className="inline-block bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-[#FF3300] transition-colors shadow-lg"
          >
            Upgrade Your Routine
          </a>
        </div>

      </div>
    </section>
  );
}
