'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const timelineEvents = [
  {
    time: "15 Minutes In",
    title: "Subtle Lift",
    description: "No spike. Just a gentle awakening of your senses. The fog clears.",
    icon: "🌅"
  },
  {
    time: "30-60 Minutes",
    title: "Deep Focus",
    description: "You enter the flow state. Distractions fade. Your cognitive architecture is fully online.",
    icon: "🧠"
  },
  {
    time: "4-6 Hours",
    title: "Sustained Clarity",
    description: "Still steady. No crash. No jitters. Just clean, consistent output.",
    icon: "⚡"
  }
];

export default function Timeline() {
  return (
    <section id="benefits" className="py-24 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 no-animate-mobile"
          >
            Energy That Feels <span className="italic text-orange-600">Different</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-light no-animate-mobile"
          >
            Most energy products hit hard and fade fast. Soluna is designed for the long haul.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-linear-to-r from-orange-200 via-orange-400 to-orange-200"
            />
          </div>

          {timelineEvents.map((event, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center group no-animate-mobile"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 rounded-full bg-white border-4 border-orange-100 group-hover:border-orange-500 transition-colors duration-500 flex items-center justify-center shadow-lg mb-6 relative z-10"
              >
                <span className="text-4xl filter drop-shadow-sm">{event.icon}</span>
              </motion.div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 w-full h-full">
                <span className="text-orange-600 font-bold tracking-widest uppercase text-[10px] mb-3 inline-block bg-orange-50 px-3 py-1 rounded-full">
                  {event.time}
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.a 
            href="#purchase" 
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-2 text-gray-900 font-bold hover:text-orange-600 transition-colors tracking-widest uppercase text-sm border-b-2 border-gray-900 hover:border-orange-600 pb-1"
          >
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}