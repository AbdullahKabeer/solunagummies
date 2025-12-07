'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const purchaseSection = document.getElementById('purchase');
      let inPurchaseSection = false;
      
      if (purchaseSection) {
        const rect = purchaseSection.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
            inPurchaseSection = true;
        }
      }

      const show = scrollY > windowHeight * 0.8 && !inPurchaseSection;
      setIsVisible(show);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('purchase');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-black md:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Status: Available</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black uppercase">.96</span>
                <span className="text-xs font-mono text-[#FF3300] bg-black/5 px-1">SAVE 20%</span>
              </div>
            </div>
            <button
              onClick={scrollToPurchase}
              className="flex-1 bg-[#FF3300] text-white py-3 border border-black font-mono font-bold uppercase text-sm flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Zap className="w-4 h-4" />
              Initiate_Order
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
