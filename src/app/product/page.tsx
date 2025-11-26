'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Star, Check, Plus, Minus, ArrowRight, Clock, Calendar, Leaf, ShieldCheck, AlertCircle, Truck, Lock } from 'lucide-react';
import FlowingBackground from "@/components/FlowingBackground";
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import TimelineSection from '@/components/TimelineSection';
import IngredientsBreakdown from '@/components/IngredientsBreakdown';
import ComparisonSection from '@/components/ComparisonSection';

export default function ProductPage() {
  const [purchaseType, setPurchaseType] = useState<'subscribe' | 'onetime'>('subscribe');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#FDFCF8] selection:bg-orange-200 selection:text-orange-900">
      <FlowingBackground />
      <div className="relative z-10">
        <Header />
        
        <div className="pt-32 pb-20 container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* LEFT COLUMN - VISUALS (Sticky) */}
            <div className="w-full lg:w-1/2 hidden lg:block">
              <div className="sticky top-24 h-[calc(100vh-12rem)] min-h-[500px] rounded-[3rem] overflow-hidden bg-[#F2F0E9] border border-white/60 shadow-2xl group">
                
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" 
                    alt="Texture" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Product Hero - Boxy Look */}
                  <div className="relative w-80 h-[30rem] bg-linear-to-b from-gray-100 to-gray-300 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-8 border border-white/40 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500">
                      <div className="w-full text-center mt-4">
                        <div className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-2">SOLUNA</div>
                        <div className="text-5xl font-serif font-bold text-gray-800">Focus</div>
                      </div>
                      
                      <div className="w-40 h-40 rounded-full bg-orange-500/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                      
                      <div className="text-center mb-4 relative z-10">
                        <div className="text-xs text-gray-500 font-mono mb-1">30 GUMMIES</div>
                        <div className="text-xs text-gray-500 font-mono">BLOOD ORANGE</div>
                      </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-12 right-12 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-white/50"
                  >
                    <span className="text-xs font-bold tracking-widest text-orange-600">CLINICALLY DOSED</span>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-12 left-12 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-white/50"
                  >
                    <span className="text-xs font-bold tracking-widest text-gray-600">VEGAN & GLUTEN FREE</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - DETAILS (Scrollable) */}
            <div className="w-full lg:w-1/2 flex flex-col">
              
              {/* SECTION 1: PURCHASE */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-[80vh] flex flex-col justify-center"
              >
                {/* Breadcrumbs / Badges */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wider uppercase">New Formula</span>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-gray-500 ml-2 tracking-wide">4.9/5 (128 REVIEWS)</span>
                  </div>
                </div>

                <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-[0.9]">
                  Soluna Focus & <br/>
                  <span className="italic text-orange-500">Mood Gummies.</span>
                </h1>

                <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-xl">
                  Calm focus, smooth energy, and brighter mood in a daily blood orange gummy. Powered by Cognizin® citicoline, L-theanine, natural caffeine from green tea, saffron extract, and B12.
                </p>

                {/* Purchase Selector */}
                <div className="bg-white rounded-4xl p-2 shadow-xl shadow-orange-900/5 border border-orange-100 mb-10">
                  {/* Subscribe Option */}
                  <div 
                    onClick={() => setPurchaseType('subscribe')}
                    className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 ${purchaseType === 'subscribe' ? 'bg-orange-50 ring-1 ring-orange-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseType === 'subscribe' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                          {purchaseType === 'subscribe' && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Subscribe & Save 20%</div>
                          <div className="text-sm text-gray-500">Delivered every 30 days. Cancel anytime.</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-bold text-2xl text-gray-900">$49.00</div>
                        <div className="text-sm text-gray-400 line-through">$59.00</div>
                      </div>
                    </div>
                  </div>

                  {/* One-time Option */}
                  <div 
                    onClick={() => setPurchaseType('onetime')}
                    className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 mt-2 ${purchaseType === 'onetime' ? 'bg-orange-50 ring-1 ring-orange-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseType === 'onetime' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                          {purchaseType === 'onetime' && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="font-bold text-gray-900">One-time Purchase</div>
                      </div>
                      <div className="font-serif font-bold text-2xl text-gray-900">$59.00</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-12">
                  <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 h-16">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-orange-600 transition-colors">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-orange-600 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="flex-1 bg-gray-900 text-white h-16 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20">
                    Add to Cart — ${(purchaseType === 'subscribe' ? 49 : 59) * quantity}.00
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex justify-between items-center mb-12 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                    <span>30-Day Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <span>Secure Checkout</span>
                  </div>
                </div>

                {/* Details Accordions */}
                <div className="border-t border-gray-200 pt-8">
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

              {/* SECTION 2: RITUAL (New) */}
              {/* Removed Ritual Section to match Zest layout */}

            </div>
          </div>
        </div>

        <IngredientsBreakdown />
        <TimelineSection />
        <ComparisonSection />
        <FAQ />

        <Footer />
      </div>
    </main>
  );
}
