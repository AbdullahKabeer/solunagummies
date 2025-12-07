'use client';

import { useState } from 'react';
import { Check, ShieldCheck, Truck, Clock, Zap } from 'lucide-react';

export default function ProductPurchase() {
  const [quantity, setQuantity] = useState<1 | 2 | 3>(1);

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
    <section id="purchase" className="py-16 bg-[#FDFCF8] border-b border-black/10 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-200/50 rounded-full mt-8"></div>
      <div className="container mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Product Visual */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-orange-50/30 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-mono mb-6 text-gray-500">
                Best Seller
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-2 text-[#1a1a1a]">Focus Protocol</h2>
              <p className="text-gray-600">30-Day Supply • Blood Orange Flavor</p>
            </div>

            <div className="relative z-10 my-12 flex justify-center">
               {/* Product Placeholder - Clean */}
               <div className="w-64 h-80 bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
                  <div className="text-center p-6 border border-gray-50 rounded-xl w-full h-full flex flex-col justify-center">
                    <div className="font-bold text-3xl tracking-tight text-[#1a1a1a]">Soluna</div>
                    <div className="font-mono text-xs text-[#FF3300] mt-2 bg-orange-50 inline-block mx-auto px-2 py-1 rounded-full">Daily Focus</div>
                  </div>
               </div>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-3 h-3 text-green-600" /></div>
                <span>Clinically Dosed Ingredients</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-3 h-3 text-green-600" /></div>
                <span>Zero Sugar • Vegan • Gluten Free</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-green-100 p-1 rounded-full"><Check className="w-3 h-3 text-green-600" /></div>
                <span>Made in USA Facility</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form */}
          <div className="lg:col-span-7 py-4">
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a]">Choose Your Supply</h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((qty) => {
                  const details = getPriceDetails(qty);
                  const isSelected = quantity === qty;
                  
                  return (
                    <div 
                      key={qty}
                      onClick={() => setQuantity(qty as 1 | 2 | 3)}
                      className={`cursor-pointer rounded-xl border-2 p-5 flex items-center justify-between transition-all ${isSelected ? 'border-[#FF3300] bg-orange-50/30' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#FF3300] border-[#FF3300]' : 'border-gray-300'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <div className="font-bold text-[#1a1a1a] text-lg">{qty} Month Supply</div>
                          <div className="text-sm text-gray-500">
                            {qty * 30} Servings • ${details.perServing.toFixed(2)}/serving
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-[#1a1a1a]">${details.finalPrice.toFixed(2)}</div>
                        {qty > 1 && (
                          <div className="text-xs font-bold text-[#FF3300]">
                            Save ${(details.savings).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="line-through">${totalBase.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Discount ({discountPercent * 100}%)</span>
                <span className="text-[#FF3300] font-bold">- ${savings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center font-bold text-2xl border-t border-gray-100 pt-6 text-[#1a1a1a]">
                <span>Total</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>

              <button className="w-full bg-[#FF3300] text-white font-bold text-lg py-5 rounded-full hover:bg-[#e62e00] transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3">
                <Zap className="w-5 h-5" />
                Start Your Ritual
              </button>
              
              <div className="flex justify-center gap-6 text-xs text-gray-400 mt-4">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure Checkout</span>
                <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Fast Shipping</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
