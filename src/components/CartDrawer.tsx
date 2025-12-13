'use client';

import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { track } = useAnalytics();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#F2F0E9] z-[70] shadow-2xl border-l border-black flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black bg-white">
              <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart ({items.length})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-black hover:text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
                    <span className="text-2xl">0</span>
                  </div>
                  <p className="font-mono uppercase text-sm">Cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.subscription ? 'sub' : 'one'}`} className="flex gap-4 bg-white p-4 rounded-xl border border-black/5">
                    <div className="w-20 h-20 bg-[#F5F5F0] rounded-lg flex items-center justify-center flex-shrink-0">
                        {/* Placeholder for image if not provided */}
                        <div className="w-8 h-10 bg-white shadow-sm rounded border border-gray-200"></div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm uppercase tracking-wide">{item.name}</h3>
                            <button 
                                onClick={() => {
                                    track('remove_from_cart', {
                                        product_id: item.productId,
                                        name: item.name,
                                        quantity: item.quantity,
                                        price: item.price,
                                        currency: 'USD',
                                        sku: item.sku
                                    });
                                    removeFromCart(item.id);
                                }}
                                className="text-gray-400 hover:text-[#FF3300] transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            {item.sku ? `SKU: ${item.sku}` : (item.subscription ? 'Subscription' : 'One-time')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-black/10 rounded-lg bg-[#F5F5F0]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-l-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-bold font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-black bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-sm uppercase text-gray-500">Subtotal</span>
                <span className="font-bold font-mono text-xl">${cartTotal.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => {
                  track('begin_checkout', {
                    value: cartTotal,
                    currency: 'USD',
                    item_count: items.length,
                    items: items.map(item => ({
                      item_id: item.productId,
                      item_name: item.name,
                      price: item.price,
                      quantity: item.quantity
                    }))
                  });
                  setIsCartOpen(false);
                }}
                className={`block w-full py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors text-center ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Checkout
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
