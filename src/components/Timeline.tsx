'use client';

import { motion } from 'framer-motion';

export default function Timeline() {
  return (
    <section className="py-24 bg-[#FDFCF8]">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:mb-24 max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a] mb-6 leading-[1.1] no-animate-mobile"
          >
            Energy that feels <br/>
            <span className="text-orange-600 italic">different.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 font-light leading-relaxed no-animate-mobile"
          >
            Most energy drinks borrow from tomorrow. Soluna fuels you for today.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 border-t border-gray-200 pt-12">
          {/* Item 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group no-animate-mobile"
          >
            <span className="block text-xs font-bold tracking-widest text-orange-600 mb-4">01 — 15 MINUTES</span>
            <h3 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4 group-hover:text-orange-600 transition-colors">The Quiet Lift</h3>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              No heart racing. No jitters. Just a subtle shift where the brain fog lifts and the lights turn on.
            </p>
          </motion.div>

          {/* Item 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group no-animate-mobile"
          >
            <span className="block text-xs font-bold tracking-widest text-orange-600 mb-4">02 — 45 MINUTES</span>
            <h3 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4 group-hover:text-orange-600 transition-colors">Locked In</h3>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              The noise fades. You stop checking your phone. You’re not forcing the work anymore—you’re just doing it.
            </p>
          </motion.div>

          {/* Item 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group no-animate-mobile"
          >
            <span className="block text-xs font-bold tracking-widest text-orange-600 mb-4">03 — 4 HOURS</span>
            <h3 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4 group-hover:text-orange-600 transition-colors">No Afternoon Crash</h3>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              Instead of hitting a wall, you just keep going. The energy doesn't dump you; it gently tapers off when you're done.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}