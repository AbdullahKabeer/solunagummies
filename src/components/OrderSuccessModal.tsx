'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function OrderSuccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const supabase = createClient();
  const { track } = useAnalytics();

  useEffect(() => {
    const success = searchParams.get('order_success');
    const id = searchParams.get('order_id');

    if (success === 'true' && id) {
      setIsOpen(true);
      setOrderId(id);

      // Fetch order details for tracking
      const trackPurchase = async () => {
        const { data: order } = await supabase
          .from('orders')
          .select('amount, order_items(quantity)')
          .eq('id', id)
          .single();
        
        if (order) {
           const itemCount = order.order_items.reduce((acc: number, item: any) => acc + item.quantity, 0);
           track('purchase', {
             transaction_id: id,
             value: order.amount,
             currency: 'USD',
             item_count: itemCount
           });
        }
      };
      trackPurchase();

      // Clean up URL without refresh
      window.history.replaceState(null, '', '/');
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#F2F0E9] w-full max-w-md border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FF3300] rounded-full animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest">Order Confirmed</span>
              </div>
              <button onClick={handleClose} className="hover:text-[#FF3300] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
                Thank You!
              </h2>
              <p className="font-mono text-sm text-gray-600 mb-8">
                Your order has been successfully placed. We've sent a confirmation email with details.
              </p>

              {/* Order ID Box */}
              <div className="bg-white border border-black p-4 mb-8 relative group cursor-pointer" onClick={() => navigator.clipboard.writeText(orderId)}>
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Order ID</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="font-mono text-lg font-bold">{orderId}</code>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-bold bg-black text-white px-2 py-1">COPY</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-wider hover:bg-[#FF3300] transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Decorative Footer */}
            <div className="h-2 bg-[url('/noise.png')] opacity-20" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
