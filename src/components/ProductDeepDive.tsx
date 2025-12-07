'use client';

import { Check } from 'lucide-react';

export default function ProductDeepDive() {
  return (
    <section className="py-24 bg-[#F2F0E9] border-b border-black">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 border-b border-black pb-8">
          <div className="inline-block bg-black text-white px-2 py-1 text-xs font-mono mb-4">
            SYSTEM_SPECIFICATIONS
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">
            Core<br />Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black bg-white">
          
          {/* Module 1 */}
          <div className="p-12 border-b md:border-b-0 md:border-r border-black hover:bg-gray-50 transition-colors">
            <div className="font-mono text-xs text-[#FF3300] mb-4">MODULE_01</div>
            <h3 className="text-3xl font-bold uppercase mb-6">Focus & Clarity</h3>
            <p className="font-mono text-sm text-gray-600 leading-relaxed mb-8">
              Citicoline (Cognizin®) supports natural energy production and neuronal communication. Locks in attention. Sharpens output.
            </p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>ENHANCED_SIGNALING</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>ATP_PRODUCTION</span></li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="p-12 border-b border-black md:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="font-mono text-xs text-[#FF3300] mb-4">MODULE_02</div>
            <h3 className="text-3xl font-bold uppercase mb-6">Calm Energy</h3>
            <p className="font-mono text-sm text-gray-600 leading-relaxed mb-8">
              L-Theanine + Natural Caffeine. Promotes smooth, focused alertness. Eliminates the "wired" feeling.
            </p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>ALPHA_WAVE_BOOST</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>NO_CRASH_PROTOCOL</span></li>
            </ul>
          </div>

          {/* Module 3 */}
          <div className="p-12 border-b md:border-b-0 md:border-r border-black hover:bg-gray-50 transition-colors">
            <div className="font-mono text-xs text-[#FF3300] mb-4">MODULE_03</div>
            <h3 className="text-3xl font-bold uppercase mb-6">Mood Support</h3>
            <p className="font-mono text-sm text-gray-600 leading-relaxed mb-8">
              Standardized Saffron extract. Supports positive mood and stress resilience. Emotional balance for high-pressure environments.
            </p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>SEROTONIN_BALANCE</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>STRESS_RESISTANCE</span></li>
            </ul>
          </div>

          {/* Module 4 */}
          <div className="p-12 hover:bg-gray-50 transition-colors">
            <div className="font-mono text-xs text-[#FF3300] mb-4">MODULE_04</div>
            <h3 className="text-3xl font-bold uppercase mb-6">Clean Delivery</h3>
            <p className="font-mono text-sm text-gray-600 leading-relaxed mb-8">
              Pectin-based. Sweetened with Allulose and Monk Fruit. No gelatin. No high-fructose corn syrup.
            </p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>VEGAN_MATRIX</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> <span>LOW_GLYCEMIC</span></li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
