'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero3DProduct() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  return (
    <div ref={ref} className="hidden md:block">
      <motion.div
        initial={{ opacity: 0, rotateY: -20, rotateX: 10, y: 50 }}
        animate={{ opacity: 1, rotateY: -15, rotateX: 5, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
      >
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotateX: [2, 0, 2],
            rotateY: [-20, -15, -20]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-64 h-[24rem] md:w-72 md:h-[28rem] [transform-style:preserve-3d]"
        >
          {/* Side Face (Thickness) */}
          <div className="absolute top-6 bottom-6 right-[1px] w-12 bg-gray-300 origin-right [transform:rotateY(-90deg)] rounded-l-sm border-l border-gray-400/30"></div>

          {/* Front Face */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl shadow-2xl border border-white/50 md:backdrop-blur-sm flex flex-col items-center p-6 [transform:translateZ(1px)]">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/40 to-transparent pointer-events-none"></div>
            
            {/* Package Content */}
            <div className="w-full text-center mt-8 z-10">
              <div className="text-[10px] font-bold tracking-[0.3em] text-gray-400 mb-3">SOLUNA</div>
              <div className="text-5xl font-serif font-bold text-gray-800 mb-1">Focus</div>
              <div className="text-sm font-serif italic text-orange-600">Daily Nootropic</div>
            </div>

            {/* Abstract Graphic */}
            <div className="flex-1 w-full flex items-center justify-center relative">
              <div className="absolute w-32 h-32 bg-orange-500/20 rounded-full blur-2xl md:animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg z-10 opacity-90"></div>
            </div>

            {/* Bottom Details */}
            <div className="w-full flex justify-between items-end border-t border-gray-300/50 pt-4 z-10">
              <div className="text-left">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Count</div>
                <div className="text-xs font-bold text-gray-700">30 Gummies</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flavor</div>
                <div className="text-xs font-bold text-gray-700">Blood Orange</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
