'use client';

import { motion } from 'framer-motion';
import { Zap, Brain, Sun, ShieldCheck, Smile } from 'lucide-react';

export default function IngredientsBreakdown() {
  const ingredients = [
    {
      name: "Cognizin® Citicoline",
      amount: "250mg",
      desc: "A potent brain nutrient that supports mental energy, focus, and attention.",
      icon: Brain
    },
    {
      name: "L-Theanine",
      amount: "200mg",
      desc: "Promotes relaxation without drowsiness, smoothing out the effects of caffeine.",
      icon: Zap
    },
    {
      name: "Natural Caffeine",
      amount: "100mg",
      desc: "Derived from green tea for a clean, steady lift in alertness.",
      icon: Sun
    },
    {
      name: "Saffron Extract",
      amount: "30mg",
      desc: "Clinically studied to support positive mood and emotional balance.",
      icon: Smile
    },
    {
      name: "Vitamin B12",
      amount: "600mcg",
      desc: "Essential for cellular energy production and nervous system health.",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-[#FDFCF8]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          
          {/* Left: Grid */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                Meet the world's first<br />
                <span className="text-orange-600">comprehensive focus gummy.</span>
              </h2>
              <p className="text-gray-600 font-light">
                Designed to replace your morning coffee and afternoon energy drink with something smarter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {ingredients.map((ing, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 mt-1">
                    <ing.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{ing.name}</h4>
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{ing.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{ing.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Visual (Placeholder for Pill/Gummy Visual) */}
          <div className="w-full md:w-1/2 relative order-1 md:order-2">
            <div className="aspect-square rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 text-center p-12">
                <h3 className="text-4xl font-serif font-bold text-orange-900 mb-4">Power in every gummy.</h3>
                <p className="text-orange-800/70">Designed to be taken daily for cumulative benefits.</p>
              </div>
              
              {/* Decorative Circles */}
              <div className="absolute inset-0 border border-orange-200 rounded-full scale-90 opacity-50"></div>
              <div className="absolute inset-0 border border-orange-200 rounded-full scale-75 opacity-50"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function SmileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}
