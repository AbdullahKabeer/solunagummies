'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductPurchase() {
  const [purchaseType, setPurchaseType] = useState<'subscribe' | 'onetime'>('subscribe');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <section id="purchase" className="py-32 bg-transparent relative overflow-hidden">

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left Column: Product Image */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="sticky top-32"
            >
              <div className="aspect-4/5 rounded-[3rem] bg-[#F5F5F0] relative overflow-hidden flex items-center justify-center group">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-200/20 rounded-full blur-3xl group-hover:bg-orange-300/30 transition-colors duration-700"></div>
                
                {/* Product Render Placeholder */}
                <div className="relative z-10 w-64 h-96 bg-linear-to-b from-gray-200 to-gray-300 rounded-2xl shadow-2xl flex flex-col items-center justify-between p-6 border border-white/40 backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-500">
                   <div className="w-full text-center mt-4">
                     <div className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-2">SOLUNA</div>
                     <div className="text-3xl font-serif font-bold text-gray-800">Focus</div>
                   </div>
                   <div className="w-24 h-24 rounded-full bg-orange-500/20 blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                   <div className="text-center mb-4">
                     <div className="text-xs text-gray-500 font-mono">30 GUMMIES</div>
                     <div className="text-xs text-gray-500 font-mono">BLOOD ORANGE</div>
                   </div>
                </div>

                {/* Floating Badge */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest border border-white shadow-lg"
                >
                  CLINICALLY DOSED
                </motion.div>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-4 mt-8 justify-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 rounded-2xl bg-[#F5F5F0] border border-transparent hover:border-orange-500/50 cursor-pointer transition-colors"></div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Details & Purchase */}
          <div className="w-full lg:w-1/2 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">Focus & Mood</span>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">|</span>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Blood Orange</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-2 leading-none">
                Soluna Focus & Mood Gummies
              </h1>
              <p className="text-lg text-gray-500 font-light italic mb-6">
                Calm focus, smooth energy, and brighter mood in a daily blood orange gummy.*
              </p>
              
              <div className="flex items-center gap-2 mb-8">
                <div className="flex text-orange-500 text-sm">★★★★★</div>
                <span className="text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4">4.9/5 from 120+ reviews</span>
              </div>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
                Soluna is a daily nootropic gummy that combines Cognizin® citicoline, L-theanine, natural caffeine from green tea, saffron extract, and B12 into a pectin-based blood orange gummy. Designed to support focus, calm energy, and emotional balance without the harsh coffee crash.*
              </p>

              <div className="text-4xl font-serif font-bold text-gray-900 mb-10">
                $59.95
              </div>

              {/* Purchase Options */}
              <div className="border border-gray-200 rounded-3xl p-2 mb-8 bg-white shadow-sm">
                <div 
                  onClick={() => setPurchaseType('subscribe')}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 relative overflow-hidden ${purchaseType === 'subscribe' ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseType === 'subscribe' ? 'border-orange-500' : 'border-gray-300'}`}>
                        {purchaseType === 'subscribe' && <div className="w-3 h-3 rounded-full bg-orange-500"></div>}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Subscribe & Save</div>
                        <div className="text-sm text-gray-500">Ships every month. Cancel anytime.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">$59.95</div>
                      <div className="text-xs text-gray-400 line-through">$74.95</div>
                    </div>
                  </div>
                  {purchaseType === 'subscribe' && (
                    <motion.div 
                      layoutId="highlight"
                      className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl"
                    >
                      SAVE 20%
                    </motion.div>
                  )}
                </div>

                <div 
                  onClick={() => setPurchaseType('onetime')}
                  className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 mt-2 ${purchaseType === 'onetime' ? 'bg-gray-50 border-gray-200 ring-1 ring-gray-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseType === 'onetime' ? 'border-gray-900' : 'border-gray-300'}`}>
                        {purchaseType === 'onetime' && <div className="w-3 h-3 rounded-full bg-gray-900"></div>}
                      </div>
                      <div className="font-bold text-gray-900">One-time Purchase</div>
                    </div>
                    <div className="font-bold text-gray-900">$74.95</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-[#FF4D00] text-white py-6 rounded-full text-xl font-bold hover:bg-[#ff6a2b] transition-all transform hover:scale-[1.01] shadow-xl shadow-orange-500/20 mb-8">
                Add to Cart — {purchaseType === 'subscribe' ? '$59.95' : '$74.95'}
              </button>

              {/* Hero Bullet Points */}
              <ul className="space-y-3 mb-12">
                <li className="flex items-start gap-3 text-gray-600 font-light">
                  <span className="text-orange-500 mt-1">✓</span>
                  Supports focus & mental clarity*
                </li>
                <li className="flex items-start gap-3 text-gray-600 font-light">
                  <span className="text-orange-500 mt-1">✓</span>
                  Calm, non-jittery energy*
                </li>
                <li className="flex items-start gap-3 text-gray-600 font-light">
                  <span className="text-orange-500 mt-1">✓</span>
                  Mood & emotional balance support*
                </li>
                <li className="flex items-start gap-3 text-gray-600 font-light">
                  <span className="text-orange-500 mt-1">✓</span>
                  Pectin-based, sweetened with allulose + monk fruit
                </li>
              </ul>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-12">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  30-Day Guarantee
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Free Shipping
                </span>
              </div>

              {/* Inventory Progress */}
              <div className="bg-gray-100 rounded-xl p-6 mb-12">
                <div className="flex justify-between text-xs font-bold tracking-widest mb-2">
                  <span className="text-orange-600">LIMITED INVENTORY! ORDER SOON.</span>
                  <span className="text-gray-400">⏱</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Due to high demand, limited inventory is available. 2368+ ordered in the last month.</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-[83%] h-full bg-orange-500 rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                  <span>83% RESERVED</span>
                  <span>17% AVAILABLE</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-gray-200">
                {[
                  {
                    title: 'Supplement Facts',
                    content: (
                      <div className="text-sm space-y-4">
                        <p><strong>Serving Size:</strong> 2 Gummies<br /><strong>Servings Per Container:</strong> 30 (60 gummies)</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-gray-100 pt-2">
                          <span>Calories</span><span className="text-right">5</span>
                          <span>Total Carbohydrate</span><span className="text-right">5 g (2%*)</span>
                          <span>Dietary Fiber</span><span className="text-right">2 g (7%*)</span>
                          <span>Total Sugars</span><span className="text-right">0 g</span>
                          <span className="pl-4">Includes 0 g Added Sugars</span><span className="text-right">0%*</span>
                          <div className="col-span-2 h-px bg-gray-100 my-1"></div>
                          <span>Vitamin B12 (as methylcobalamin)</span><span className="text-right">300 mcg (12,500%*)</span>
                          <span>Citicoline (as Cognizin®)</span><span className="text-right">125 mg (†)</span>
                          <span>L-Theanine</span><span className="text-right">100 mg (†)</span>
                          <span>Caffeine (from green tea)</span><span className="text-right">50 mg (†)</span>
                          <span>Saffron extract (standardized)</span><span className="text-right">20 mg (†)</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">*Percent Daily Values (DV) are based on a 2,000 calorie diet.<br />†Daily Value not established.<br />Contains allulose and other non-nutritive sweeteners.</p>
                      </div>
                    )
                  },
                  {
                    title: 'Other Ingredients',
                    content: 'Allulose, tapioca fiber syrup, distilled water, pectin (amidated low methoxyl), sodium citrate, natural flavors (blood orange, tangerine), malic acid, citric acid, calcium lactate, saffron extract, monk fruit extract, bitter flavor modifier, medium-chain triglycerides (MCT oil), carnauba wax (polish). Contains: Tree nuts (coconut) from MCT oil.'
                  },
                  {
                    title: 'How to Use',
                    content: 'Serving Size: Chew 2 gummies. Ideal in the morning or early afternoon. Once daily for best results. Do not exceed 4 gummies per day. Start with 2 gummies and see how you feel.'
                  },
                  {
                    title: 'Taste & Format',
                    content: 'Flavor: Blood Orange with a hint of tangerine. Texture: Soft, chewy pectin gummy (not gelatin). Sweetness: Sweetened with allulose + monk fruit instead of heavy sugar or high-fructose corn syrup. No artificial colors.'
                  },
                  {
                    title: 'Safety & Warnings',
                    content: 'Contains 50 mg caffeine per serving. Not recommended for children, pregnant or nursing women, or individuals sensitive to caffeine. Consult your healthcare provider before use if you take prescription medications or have a medical condition.'
                  }
                ].map((item, i) => (
                  <div key={i} className="border-b border-gray-200">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                      className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                    >
                      <span className="font-serif font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors">{item.title}</span>
                      <span className={`text-2xl text-gray-400 group-hover:text-orange-600 transition-colors duration-300 ${openAccordion === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    <AnimatePresence>
                      {openAccordion === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 text-gray-600 leading-relaxed font-light">
                            {item.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
