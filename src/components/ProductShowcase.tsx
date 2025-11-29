'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function ProductShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <section ref={ref} className="min-h-screen md:h-[200vh] relative bg-transparent py-12 md:py-0">
      <div className="relative md:sticky md:top-0 h-auto md:h-screen flex items-center overflow-hidden md:pb-20">
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
          {/* Text Content (Left) */}
          <div className="w-full md:w-1/2 md:mt-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-2 md:mb-3 block">The Experience</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 md:mb-8 text-gray-900 leading-tight">
                Simple Ritual,<br />
                <span className="text-orange-600">Daily Impact.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed font-light">
                Designed to fit seamlessly into your morning routine, giving you the lift you need without the crash.
              </p>
              
              <div className="space-y-8 border-l border-gray-200 pl-8">
                <div className="relative group">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gray-200 border-4 border-[#FDFCF8] group-hover:bg-orange-600 transition-colors duration-500"></div>
                  <div className="flex items-center gap-3 mb-1">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-bold text-gray-900">When</h4>
                  </div>
                  <p className="text-gray-500 font-light">Take 2 gummies daily, preferably in the morning or early afternoon.</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gray-200 border-4 border-[#FDFCF8] group-hover:bg-orange-600 transition-colors duration-500"></div>
                  <div className="flex items-center gap-3 mb-1">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h4 className="text-lg font-bold text-gray-900">Consistency</h4>
                  </div>
                  <p className="text-gray-500 font-light">Consistency is key—ingredients like Cognizin® and Saffron build up benefits over time.</p>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gray-200 border-4 border-[#FDFCF8] group-hover:bg-orange-600 transition-colors duration-500"></div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Plant-Based & Clean</h4>
                  <p className="text-gray-500 font-light">100% Vegan, pectin-based. No high-fructose corn syrup or artificial dyes.</p>
                </div>
              </div>
              
              <div className="mt-12">
                <a 
                  href="#purchase" 
                  className="inline-block bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg tracking-widest uppercase"
                >
                  Shop Now
                </a>
              </div>
            </motion.div>
          </div>

          {/* Visual Content (Right) */}
          <div className="w-full md:w-1/2 relative md:aspect-square flex items-center justify-center mt-8 md:mt-0">
            <motion.div 
              style={{ y, rotate }}
              className="w-full h-full items-center justify-center hidden md:flex"
            >
              {/* Desktop Animated Visual */}
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-[#ff6b6b] to-[#ffa502] rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center gap-8">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="w-32 h-32 rounded-full bg-linear-to-br from-white to-white/80 shadow-2xl shadow-orange-500/10 flex items-center justify-center backdrop-blur-sm border border-white/50"
                  >
                    <span className="font-serif text-[#1a1a1a] text-2xl">1</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="w-32 h-32 rounded-full bg-linear-to-br from-white to-white/80 shadow-2xl shadow-orange-500/10 flex items-center justify-center backdrop-blur-sm mt-16 border border-white/50"
                  >
                    <span className="font-serif text-[#1a1a1a] text-2xl">2</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Dynamic Visual */}
            <div className="w-full flex items-center justify-center md:hidden py-4">
              <div className="relative w-full max-w-[280px] h-56">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-linear-to-br from-[#ff6b6b] to-[#ffa502] rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-full bg-linear-to-br from-white to-white/80 shadow-xl shadow-orange-500/10 flex items-center justify-center backdrop-blur-sm border border-white/50"
                  >
                    <span className="font-serif text-[#1a1a1a] text-lg">1</span>
                  </div>
                  <div 
                    className="w-20 h-20 rounded-full bg-linear-to-br from-white to-white/80 shadow-xl shadow-orange-500/10 flex items-center justify-center backdrop-blur-sm mt-6 border border-white/50"
                  >
                    <span className="font-serif text-[#1a1a1a] text-lg">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}
