'use client';

import { motion } from 'framer-motion';
import { Zap, Brain, Smile } from 'lucide-react';

export default function TimelineSection() {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-4 block">The Journey</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Better mornings, better energy for life.
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-light">
            Soluna isn't just a quick fix. It's a cumulative investment in your brain's operating system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0 }}
            className="bg-[#FDFCF8] rounded-3xl p-8 border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition-colors"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32 text-orange-500" />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-6">HOUR 01</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Calm Activation</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Experience a smooth lift within 45 minutes. The L-Theanine neutralizes caffeine jitters, putting you in a state of "relaxed alertness" ready for deep work.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#FDFCF8] rounded-3xl p-8 border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition-colors"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="w-32 h-32 text-orange-500" />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-6">DAY 07</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Steady Rhythm</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Consistent use helps support steadier mornings. You may notice less grogginess and improved focus endurance as Cognizin® begins to support brain energy metabolism.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#FDFCF8] rounded-3xl p-8 border border-gray-100 relative overflow-hidden group hover:border-orange-200 transition-colors"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Smile className="w-32 h-32 text-orange-500" />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-6">DAY 30+</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Optimized Mind</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Long-term users report feeling more refreshed and aligned. Saffron extract supports emotional balance and stress resilience, making challenges feel more manageable.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
