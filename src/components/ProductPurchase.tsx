'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, RotateCcw, Truck, Bell, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { createClient } from '@/lib/supabase/client';

export default function ProductPurchase() {
  const [quantity, setQuantity] = useState<1 | 2 | 3>(2);
  const [frequency, setFrequency] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'subscribe' | 'onetime'>('subscribe');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { track } = useAnalytics();
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  const basePrice = 74.95;
  
  const getPriceDetails = (qty: number, type: 'subscribe' | 'onetime') => {
    // Try to find matching product from DB
    let sku = '';
    if (type === 'subscribe') {
        // SKU format: FG{quantity}S{frequency}
        // But wait, if we only seeded FG1S1, FG1S2, FG1S3 (quantity=1), how do we handle quantity=2?
        // If the user selects Qty=2, Freq=1, we look for FG2S1.
        // If FG2S1 is not in DB, we should probably fall back to (FG1S1 price * 2).
        sku = `FG${qty}S${frequency}`; 
    } else {
        sku = `FG${qty}O`;
    }

    const product = products.find(p => p.sku === sku);

    if (product) {
        const finalPrice = product.price;
        const totalBase = product.compare_at_price || (finalPrice * 1.25); 
        const savings = totalBase - finalPrice;
        const discountPercent = totalBase > 0 ? savings / totalBase : 0;
        const perServing = finalPrice / (30 * qty);
        
        return {
            finalPrice,
            totalBase,
            savings,
            perServing,
            discountPercent
        };
    }

    // Fallback: Try to find base unit (Qty=1) and multiply
    if (type === 'subscribe') {
        const baseSku = `FG1S${frequency}`;
        const baseProduct = products.find(p => p.sku === baseSku);
        if (baseProduct) {
             const finalPrice = baseProduct.price * qty;
             const totalBase = (baseProduct.compare_at_price || (baseProduct.price * 1.25)) * qty;
             const savings = totalBase - finalPrice;
             const discountPercent = totalBase > 0 ? savings / totalBase : 0;
             const perServing = finalPrice / (30 * qty);
             return { finalPrice, totalBase, savings, perServing, discountPercent };
        }
    } else {
        const baseSku = 'FG1O';
        const baseProduct = products.find(p => p.sku === baseSku);
        if (baseProduct) {
             const finalPrice = baseProduct.price * qty;
             const totalBase = (baseProduct.compare_at_price || (baseProduct.price * 1.25)) * qty;
             const savings = totalBase - finalPrice;
             const discountPercent = totalBase > 0 ? savings / totalBase : 0;
             const perServing = finalPrice / (30 * qty);
             return { finalPrice, totalBase, savings, perServing, discountPercent };
        }
    }

    // Final Fallback to hardcoded logic
    const totalBase = basePrice * qty;
    let discountPercent = 0;
    
    if (type === 'subscribe') {
        // Discount based on frequency
        if (frequency === 1) discountPercent = 0.20;
        if (frequency === 2) discountPercent = 0.30;
        if (frequency === 3) discountPercent = 0.35;
    } else {
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
    if (purchaseType === 'subscribe') {
        // Subscription Logic
        // SKU format: FG{quantity}S{frequency} - e.g. FG1S1 (1 bottle every 1 month)
        const sku = `FG${quantity}S${frequency}`; 
        let productName = `Soluna Subscription (${quantity} Bottle${quantity > 1 ? 's' : ''})`;
        
        // Add frequency to product name for clarity in cart
        productName += ` - Delivered Every ${frequency} Month${frequency > 1 ? 's' : ''}`;

        track('add_to_cart', {
            product_id: 'soluna-focus-protocol',
            name: productName,
            quantity: 1,
            purchase_type: 'subscribe',
            price: finalPrice,
            currency: 'USD',
            sku,
            frequency: frequency
        });

        addToCart({
            productId: 'soluna-focus-protocol',
            name: productName,
            price: finalPrice, // Total price of bundle
            quantity: 1,       // 1 Bundle (containing 'quantity' bottles)
            subscription: true,
            sku
        });
    } else {
        // One-time Logic
        // Check if we have a specific bundle SKU
        const bundleSku = `FG${quantity}O`;
        const product = products.find(p => p.sku === bundleSku);
        
        const sku = product ? bundleSku : 'FG1O';
        const productName = 'Soluna Focus Protocol';
        // If bundle exists, unit price is bundle price / qty. If not, it's just the calculated finalPrice / qty.
        const unitPrice = finalPrice / quantity; 

        track('add_to_cart', {
            product_id: 'soluna-focus-protocol',
            name: productName,
            quantity: quantity,
            purchase_type: 'onetime',
            price: unitPrice,
            currency: 'USD',
            sku
        });

        addToCart({
            productId: 'soluna-focus-protocol',
            name: productName,
            price: unitPrice,
            quantity: quantity, // Actual number of bottles
            subscription: false,
            sku
        });
    }
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
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quantity:</div>
                <div className="flex items-center bg-white border border-gray-200 rounded-lg w-fit">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1) as 1|2|3)} 
                        className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="w-12 text-center font-bold text-base">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(Math.min(3, quantity + 1) as 1|2|3)} 
                        className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
                        disabled={quantity >= 3}
                    >
                        +
                    </button>
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
                        <div className="flex gap-3 w-full">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${purchaseType === 'subscribe' ? 'border-[#FF3300] bg-[#FF3300]' : 'border-gray-300 bg-white'}`}>
                                {purchaseType === 'subscribe' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between items-start w-full">
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
                                
                                {/* Quantity/Frequency Buttons */}
                                {purchaseType === 'subscribe' && (
                                    <div className="mb-3 mt-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Deliver Every:</div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map((freq) => (
                                                <button
                                                    key={freq}
                                                    onClick={() => {
                                                        setFrequency(freq);
                                                        // Auto-select matching quantity for best value if user hasn't explicitly set a weird combo?
                                                        // Actually, let's just set quantity to match frequency to guide the user to the bundles
                                                        setQuantity(freq as 1|2|3);
                                                    }}
                                                    className={`relative flex-1 py-2 px-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                                                        frequency === freq 
                                                        ? 'border-[#FF3300] bg-orange-50 text-[#FF3300]' 
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="text-xs font-bold uppercase">{freq} Month{freq > 1 ? 's' : ''}</span>
                                                    {freq > 1 && (
                                                        <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono px-2 py-0.5 rounded-full text-white shadow-sm whitespace-nowrap ${frequency === freq ? 'bg-[#FF3300]' : 'bg-gray-400'}`}>
                                                            {freq === 2 ? '30% OFF' : '35% OFF'}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                ${(basePrice * (purchaseType === 'onetime' ? quantity : 1)).toFixed(2)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Simple Quantity Selector for One-Time - Removed as it is now global */}
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
            <div className="grid grid-cols-3 gap-4 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wide text-center mb-8">
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

            {/* Details Accordions */}
            <div className="border-t border-gray-200 pt-4">
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
                    className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
                    >
                    <span className="font-bold text-base text-[#1a1a1a] group-hover:text-[#FF3300] transition-colors">{item.title}</span>
                    <span className={`text-xl text-gray-400 group-hover:text-[#FF3300] transition-colors duration-300 ${openAccordion === i ? 'rotate-45' : ''}`}>+</span>
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
                        <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                            {item.content}
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
