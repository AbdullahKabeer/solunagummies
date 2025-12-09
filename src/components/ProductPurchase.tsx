'use client';

import { useState } from 'react';
import { Star, RotateCcw, Truck, Bell, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductPurchase() {
  const [quantity, setQuantity] = useState<1 | 2 | 3>(2);
  const [purchaseType, setPurchaseType] = useState<'subscribe' | 'onetime'>('subscribe');
  const { addToCart } = useCart();

  const basePrice = 74.95;
  
  const getPriceDetails = (qty: number, type: 'subscribe' | 'onetime') => {
    const totalBase = basePrice * qty;
    let discountPercent = 0;
    
    // Subscription always gets discount
    if (type === 'subscribe') {
        if (qty === 1) discountPercent = 0.20;
        if (qty === 2) discountPercent = 0.30;
        if (qty === 3) discountPercent = 0.35;
    } else {
        // One-time purchase gets NO discount (or maybe small bulk discount? User asked for distinct price difference)
        // Let's keep it simple: One-time is full price.
        discountPercent = 0;
    }
    
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

  const { finalPrice, totalBase, savings, perServing, discountPercent } = getPriceDetails(quantity, purchaseType);

  // Calculate subscription price for comparison in One-Time card
  const subPriceDetails = getPriceDetails(quantity, 'subscribe');

  const handleAddToCart = () => {
    addToCart({
      productId: 'soluna-focus-protocol',
      name: 'Soluna Focus Protocol',
      price: finalPrice / quantity,
      quantity: quantity,
      subscription: purchaseType === 'subscribe',
    });
  };

  return (
    <section id="purchase" className="py-6 md:py-12 bg-white border-b border-black/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6">
             <div className="bg-[#F5F5F0] rounded-3xl aspect-square flex items-center justify-center mb-4 relative overflow-hidden">
                {/* Main Image Placeholder */}
                <div className="w-48 h-60 bg-white rounded-xl shadow-xl flex items-center justify-center border border-gray-100">
                    <div className="text-center p-4">
                        <div className="font-bold text-2xl tracking-tight text-[#1a1a1a]">Soluna</div>
                        <div className="font-mono text-[10px] text-[#FF3300] mt-2 bg-orange-50 inline-block mx-auto px-2 py-1 rounded-full">Daily Focus</div>
                    </div>
                </div>
             </div>
             {/* Thumbnails */}
             <div className="grid grid-cols-5 gap-4">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`aspect-square rounded-xl border-2 ${i === 1 ? 'border-[#FF3300]' : 'border-transparent'} bg-[#F5F5F0] flex items-center justify-center cursor-pointer hover:border-gray-300`}>
                        <div className="w-8 h-10 bg-white rounded shadow-sm"></div>
                    </div>
                ))}
             </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-6 lg:pl-6">
            <div className="mb-3">
                <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1">Timed-Release Nootropic</div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2 tracking-tight">Focus Protocol</h2>
                
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-[#FF3300]">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="font-bold text-[#1a1a1a]">4.9</span>
                    <span className="text-gray-500 underline decoration-gray-300 underline-offset-4">1,240 reviews</span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                    Developed by neuroscientists and validated in clinical studies, our focus supplement supports clear thinking, sustained energy, and helps counteract brain fog and afternoon fatigue.
                </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 mb-4">Quantity</div>
                <div className="flex gap-2">
                    {[1, 2, 3].map((qty) => (
                        <button
                            key={qty}
                            onClick={() => setQuantity(qty as 1 | 2 | 3)}
                            className={`relative flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${
                                quantity === qty 
                                ? 'border-[#FF3300] bg-orange-50 text-[#FF3300]' 
                                : 'border-black/10 text-gray-600 hover:border-black/30'
                            }`}
                        >
                            {qty} MONTH{qty > 1 ? 'S' : ''}
                            {qty > 1 && (
                                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono px-2 py-0.5 rounded-full text-white shadow-sm whitespace-nowrap ${quantity === qty ? 'bg-[#FF3300]' : 'bg-gray-400'}`}>
                                    {qty === 2 ? '30% OFF' : '35% OFF'}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-3 mb-6">
                
                {/* Subscribe Option */}
                <div 
                    onClick={() => setPurchaseType('subscribe')}
                    className={`relative rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                        purchaseType === 'subscribe' 
                        ? 'bg-[#F9F9F7] border-[#FF3300]' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${purchaseType === 'subscribe' ? 'border-[#FF3300] bg-[#FF3300]' : 'border-gray-300 bg-white'}`}>
                                {purchaseType === 'subscribe' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-[#1a1a1a]">Subscribe & Save</span>
                                    <span className="bg-[#E6F4EA] text-[#1E4620] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Save {(subPriceDetails.discountPercent * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono mb-2">
                                    ${subPriceDetails.perServing.toFixed(2)} / serving
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600 font-medium">
                                    <div className="flex items-center gap-1">
                                        <RotateCcw className="w-3 h-3 text-gray-400" />
                                        <span>Flexible frequency</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-gray-400" />
                                        <span>Cancel anytime</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Truck className="w-3 h-3 text-gray-400" />
                                        <span>Free shipping</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg text-[#1a1a1a]">
                                ${subPriceDetails.finalPrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-[#FF3300] font-bold">
                                Save ${subPriceDetails.savings.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* One-Time Option */}
                <div 
                    onClick={() => setPurchaseType('onetime')}
                    className={`relative rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                        purchaseType === 'onetime' 
                        ? 'bg-[#F9F9F7] border-[#1a1a1a]' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${purchaseType === 'onetime' ? 'border-[#1a1a1a] bg-[#1a1a1a]' : 'border-gray-300 bg-white'}`}>
                                {purchaseType === 'onetime' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="font-bold text-[#1a1a1a]">One-Time Purchase</span>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg text-[#1a1a1a]">
                                ${(basePrice * quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* CTA */}
            <button 
                onClick={handleAddToCart}
                className="w-full bg-[#FF3300] text-white font-bold text-base py-3 rounded-full hover:bg-[#e62e00] transition-all shadow-lg shadow-orange-500/20 mb-4"
            >
                {purchaseType === 'subscribe' ? 'Start My Subscription' : 'Add to Cart'} - ${finalPrice.toFixed(2)}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wide text-center">
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Truck className="w-4 h-4 text-[#FF3300]" />
                    <span>Free Shipping For All Orders</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span>Reminders Before Every Order</span>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
