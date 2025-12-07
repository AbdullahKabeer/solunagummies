'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero3DProduct from './Hero3DProduct';
import { Check, Star, ShieldCheck, Truck, Clock, RefreshCw, Zap, Info, FlaskConical, Leaf, Flag } from 'lucide-react';

export default function ProductPurchase() {
  const [quantity, setQuantity] = useState<1 | 2 | 3>(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const basePrice = 74.95;
  
  const getPriceDetails = (qty: number) => {
    const totalBase = basePrice * qty;
    let discountPercent = 0;
    
    if (qty === 1) discountPercent = 0.20;
    if (qty === 2) discountPercent = 0.30;
    if (qty === 3) discountPercent = 0.35;
    
    const finalPrice = totalBase * (1 - discountPercent);
    const savings = totalBase - finalPrice;
    const perServing = finalPrice / (30 * qty);
    
    return {
      finalPrice,
      totalBase,
      savings,
      perServing,
      discountPercent
    };
  };

  const { finalPrice, totalBase, savings, perServing, discountPercent } = getPriceDetails(quantity);

  return (
    <section id="purchase" className="py-8 md:py-20 bg-[#FDFCF8] relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-100/60 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Mobile Header */}
        <div className="lg:hidden mb-8 text-center">
           <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex text-[#FF4D00]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-500">4.9/5 from 120+ reviews</span>
           </div>
           <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                Reclaim Your <span className="text-[#FF4D00] italic">Focus</span>.
           </h2>
           <p className="text-base text-gray-600 leading-relaxed font-light">
                The daily nootropic gummy for deep work. Formulated with Cognizin®, L-Theanine, and Saffron to silence the noise and amplify your signal.
           </p>
           
           {/* Mobile Social Proof */}
           <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex text-[#FF4D00] mb-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-2 h-2 fill-current" />)}
                </div>
                <p className="text-xs text-gray-700 italic">"Finally something that actually works without the jitters. My focus has never been better."</p>
                <p className="text-[10px] font-bold text-gray-500 mt-1">- Sarah J., Verified Buyer</p>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          {/* Left Column: Product Visual */}
          <div className="w-full lg:w-1/2 relative lg:sticky lg:top-24">
            <div className="relative w-full aspect-square bg-gray-50 rounded-[2rem] flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
              <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
              
              {/* Reuse Hero Product */}
              <div className="scale-100 md:scale-110 transform-gpu">
                <Hero3DProduct isStatic={true} />
              </div>

              {/* Floating Badges */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/80 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-2 md:gap-3 no-animate-mobile"
              >
                <div className="bg-green-100 p-1 rounded-full">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock Status</div>
                  <div className="text-xs font-bold text-gray-900">In Stock & Ready to Ship</div>
                </div>
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 border border-gray-200 hover:border-orange-500/50 cursor-pointer transition-colors flex items-center justify-center">
                   <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-lg opacity-50"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Conversion Engine */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="no-animate-mobile"
            >
              {/* Desktop Header */}
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-[#FF4D00]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-500">4.9/5 from 120+ reviews</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                  Reclaim Your <span className="text-[#FF4D00] italic">Focus</span>.
                </h2>

                <p className="text-base text-gray-600 mb-6 leading-relaxed font-light">
                  The daily nootropic gummy for deep work. Formulated with Cognizin®, L-Theanine, and Saffron to silence the noise and amplify your signal.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Made in USA', 'Third-party tested', 'Natural Caffeine', 'Vegan / Non-GMO', '30-day satisfaction guarantee'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{badge}</span>
                  </div>
                ))}
              </div>

              {/* Purchase Toggles */}
              <div className="mb-6">
                
                {/* Congrats Banner */}
                {quantity > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-xs font-bold mb-4 flex items-center gap-2 no-animate-mobile"
                  >
                    <span>🎉</span>
                    Congrats! You're saving {Math.round(discountPercent * 100)}% off with a bulk discount
                  </motion.div>
                )}
                
                {/* Urgency Nudge */}
                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  14 people are viewing this right now
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-serif font-bold text-gray-900">${finalPrice.toFixed(2)}</span>
                  <span className="text-xl text-gray-400 line-through decoration-gray-300 decoration-2">${totalBase.toFixed(2)}</span>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Quantity</div>
                    <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Most Popular: 3 Months</div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((qty) => {
                       const isSelected = quantity === qty;
                       const discount = qty === 2 ? '30% OFF' : qty === 3 ? '35% OFF' : null;
                       const isBestValue = qty === 3;
                       
                       return (
                         <button
                           key={qty}
                           onClick={() => setQuantity(qty as 1 | 2 | 3)}
                           className={`relative flex-1 py-3 md:py-2 rounded-xl md:rounded-full border text-xs font-bold transition-all ${
                             isSelected 
                               ? 'border-[#FF4D00] text-[#FF4D00] ring-1 ring-[#FF4D00] bg-white shadow-md' 
                               : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                           }`}
                         >
                           {qty} Month{qty > 1 ? 's' : ''}
                           {discount && (
                             <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap border shadow-sm ${
                               isSelected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-100 text-green-700 border-green-200'
                             }`}>
                               {discount}
                             </div>
                           )}
                           {isBestValue && !discount && (
                              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap border bg-orange-100 text-orange-700 border-orange-200">
                                Best Value
                              </div>
                           )}
                         </button>
                       );
                    })}
                  </div>
                </div>

                {/* Subscription Card */}
                <div className="relative p-4 rounded-xl border-2 border-[#FF4D00] bg-[#fff5f0] mb-4">
                  <div className="absolute -top-3 right-4 bg-[#FF4D00] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-[4px] border-[#FF4D00] bg-white"></div>
                      <div>
                        <div className="font-bold text-gray-900 text-base">Subscribe and Save</div>
                        <div className="inline-block bg-[#FF4D00] text-white text-xs font-bold px-3 py-0.5 rounded-md mt-1 shadow-sm">
                          Save {Math.round(discountPercent * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-gray-900">${finalPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 line-through font-bold">${totalBase.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">${perServing.toFixed(2)} / serving</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-orange-200 pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <RefreshCw className="w-3 h-3 text-gray-400" />
                      <span>Ships free every {quantity} month{quantity > 1 ? 's' : ''}.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-3 text-center text-gray-400">$</span>
                      <span>Save <span className="font-bold text-[#FF4D00]">${savings.toFixed(2)}</span> with each delivery.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <ShieldCheck className="w-3 h-3 text-gray-400" />
                      <span>Modify or cancel anytime. Money back guarantee.</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 right-3">
                    <Info className="w-3 h-3 text-gray-300" />
                  </div>
                </div>
              </div>

              {/* Main CTA */}
              <button className="w-full bg-[#FF4D00] text-white py-5 rounded-full text-xl font-bold hover:bg-[#e64500] transition-all duration-300 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md mb-4 flex items-center justify-center gap-2">
                <span>Add to Cart</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-base">${finalPrice.toFixed(2)}</span>
              </button>
              
              <div className="text-center mb-6 space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600">
                  <ShieldCheck className="w-3 h-3 text-green-600" />
                  <span>30-Day Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>Ships in 24 hours</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-600">
                  <Truck className="w-3 h-3 text-orange-600" />
                  <span>Free shipping on orders $40+</span>
                </div>
              </div>



              {/* Payment Methods */}
              <div className="flex justify-center gap-2 mb-6 opacity-60 grayscale">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain" alt="Visa" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 object-contain" alt="Mastercard" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" className="h-4 object-contain" alt="PayPal" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" className="h-4 object-contain" alt="Apple Pay" />
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-100 pb-6">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-green-600" />
                  30-Day Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-blue-600" />
                  Free Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-3 h-3 text-purple-600" />
                  3rd Party Tested
                </span>
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3 h-3 text-green-500" />
                  Vegan & Gluten-Free
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-orange-600" />
                  GMP Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <Flag className="w-3 h-3 text-red-600" />
                  Made in USA
                </span>
              </div>

              {/* Accordions */}
              <div className="space-y-2">
                {[
                  {
                    title: 'Supplement Facts',
                    content: (
                      <div className="text-xs space-y-2 text-gray-600">
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span>Serving Size</span>
                          <span className="font-bold">2 Gummies</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span>Cognizin® Citicoline</span>
                          <span className="font-bold">125mg</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span>L-Theanine</span>
                          <span className="font-bold">100mg</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-1">
                          <span>Natural Caffeine</span>
                          <span className="font-bold">50mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saffron Extract</span>
                          <span className="font-bold">20mg</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Ingredients',
                    content: 'Allulose, tapioca fiber syrup, distilled water, pectin, sodium citrate, natural flavors (blood orange, tangerine), malic acid, citric acid, calcium lactate, saffron extract, monk fruit extract, MCT oil.'
                  },
                  {
                    title: 'How to Use',
                    content: 'Serving Size: Chew 2 gummies. Ideal in the morning or early afternoon. Once daily for best results. Do not exceed 4 gummies per day. Start with 2 gummies and see how you feel.'
                  },
                  {
                    title: 'Safety & Warnings',
                    content: 'Contains 50 mg caffeine per serving. Not recommended for children, pregnant or nursing women, or individuals sensitive to caffeine. Consult your healthcare provider before use if you take prescription medications or have a medical condition.'
                  }
                ].map((item, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                      className="w-full px-4 py-3 flex justify-between items-center text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                      <span className={`text-lg text-gray-400 transition-transform duration-300 ${openAccordion === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    <AnimatePresence>
                      {openAccordion === i && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-gray-50"
                        >
                          <div className="p-4 pt-0 text-gray-600 leading-relaxed font-light text-xs">
                            <div className="h-px w-full bg-gray-200 mb-3" />
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
