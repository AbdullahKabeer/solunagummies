'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-transparent">
      
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="h-[1px] w-12 bg-orange-600"></div>
              <span className="text-xs font-bold tracking-[0.3em] text-orange-900 uppercase">Est. 2024</span>
            </motion.div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl leading-[1.1] text-[#1a1a1a] mb-8 md:mb-12 tracking-tight">
              <div className="overflow-hidden py-2">
                <motion.div
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  Reclaim your
                </motion.div>
              </div>
              <div className="overflow-hidden py-2">
                <motion.div
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="italic text-orange-600 ml-8 md:ml-24 pr-4"
                >
                  cognitive
                </motion.div>
              </div>
              <div className="overflow-hidden py-2">
                <motion.div
                  initial={{ y: "100%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  architecture.
                </motion.div>
              </div>
            </h1>

            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24 ml-2 md:ml-4">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg md:text-xl text-gray-600 max-w-md leading-relaxed font-light"
              >
                A daily ritual for deep work. <br/>
                Formulated with <span className="text-orange-600 font-medium">Cognizin®</span> and <span className="text-orange-600 font-medium">Saffron</span> to silence the noise and amplify your signal.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative group hidden md:block"
              >
                <a 
                  href="#purchase" 
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase transition-transform duration-500 group-hover:scale-110"
                >
                  Shop
                </a>
                <div className="absolute inset-0 rounded-full border border-[#1a1a1a] scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
              </motion.div>
              
              {/* Mobile Shop Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="md:hidden w-full"
              >
                <a 
                  href="#purchase" 
                  className="flex items-center justify-center w-full py-4 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase"
                >
                  Shop Now
                </a>
              </motion.div>
            </div>
          </div>

          {/* Floating Product Mockup */}
          <div className="w-full lg:w-2/5 relative flex justify-center lg:justify-end [perspective:1000px] mt-12 lg:mt-0">
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
        </div>
      </div>
      
      {/* Scroll Line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 100 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-12 w-[1px] bg-gray-300 hidden md:block"
      ></motion.div>
    </section>
  );
}
