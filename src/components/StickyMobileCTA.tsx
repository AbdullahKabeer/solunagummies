'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

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
        // Check if purchase section is currently in view
        if (rect.top < windowHeight && rect.bottom > 0) {
            inPurchaseSection = true;
        }
      }

      // Show after scrolling 80% of viewport, hide if inside purchase section
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
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden"
        >
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subscribe & Save</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-serif font-bold text-gray-900">$49.00</span>
                <span className="text-xs text-gray-400 line-through">$59</span>
              </div>
              <div className="text-[9px] text-green-600 font-bold">Free Shipping</div>
            </div>
            <button
              onClick={scrollToPurchase}
              className="flex-1 bg-[#FF4D00] text-white py-4 rounded-full text-base font-bold text-center uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
            >
              Get Focus Gummies
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
