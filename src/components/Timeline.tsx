'use client';

import { motion } from 'framer-motion';

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
    <section id="benefits" className="py-32 bg-transparent relative overflow-hidden">

      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-gray-900">
            Energy That Feels <span className="italic text-orange-600">Different</span>.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Most energy products hit hard and fade fast. Soluna is designed for the long haul.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-orange-200 via-orange-500 to-orange-200 md:-translate-x-1/2"></div>

          <div className="space-y-24">
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-16 text-left' : 'md:pr-16 md:text-right'}`}>
                  <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-2 block">{event.time}</span>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                {/* Center Icon */}
                <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-orange-500 z-10 flex items-center justify-center shadow-lg">
                  <span className="text-xs">{event.icon}</span>
                </div>

                {/* Empty Side for Balance */}
                <div className="hidden md:block w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}