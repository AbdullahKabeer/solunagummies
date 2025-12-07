'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: "Clean Daily Support",
    description: "Formulated with ingredients known to support focus, alertness, and overall brain wellness.*"
  },
  {
    title: "Smooth, Balanced Experience",
    description: "Users commonly describe feeling calmly focused—without overstimulation.*"
  },
  {
    title: "No Jitters, No Crash",
    description: "A balanced approach designed for steady, natural-feeling energy.*"
  },
  {
    title: "Easy Daily Ritual",
    description: "Just one gummy a day fits effortlessly into your routine."
  }
];

export default function Science() {
  return (
    <section id="science" className="py-16 md:py-32 relative overflow-hidden bg-[#FDFCF8]">
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-noise" />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-24 text-center no-animate-mobile"
        >
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4 block">Mechanism of Action</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-gray-900 leading-tight">
            How It <span className="text-[#FF4D00] italic">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ x: 10 }}
              className="relative pl-12 border-l border-gray-200 group cursor-default no-animate-mobile"
            >
              <span className="absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full bg-gray-50 border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors duration-300">
                {index + 1}
              </span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-orange-500 transition-colors duration-300">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light text-lg group-hover:text-gray-800 transition-colors duration-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-24 text-center">
          <motion.a 
            href="#purchase" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-[#1a1a1a] text-white px-10 py-5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg tracking-widest uppercase"
          >
            Experience The Science
          </motion.a>
        </div>
      </div>
    </section>
  );
}
