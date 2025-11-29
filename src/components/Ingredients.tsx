'use client';

import { motion, useScroll, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { useRef, useState } from 'react';

const ingredients = [
  {
    name: "Cognizin® Citicoline",
    amount: "125mg",
    foundIn: "Brain Tissue",
    sourcedFrom: "Japan",
    benefits: ["Brain Energy", "Focus", "Neural Repair"],
    description: "A patented form of citicoline that supports the brain’s natural energy production and healthy communication between neurons."
  },
  {
    name: "L-Theanine",
    amount: "100mg",
    foundIn: "Green Tea",
    sourcedFrom: "Japan",
    benefits: ["Calm Alertness", "Alpha Waves", "Stress Reduction"],
    description: "An amino acid that promotes a state of 'calm alertness,' helping smooth out caffeine and support focused concentration."
  },
  {
    name: "Natural Caffeine",
    amount: "50mg",
    foundIn: "Green Tea",
    sourcedFrom: "India",
    benefits: ["Alertness", "Reaction Time", "Metabolism"],
    description: "Gentle lift in alertness and reaction time from a natural source. Enough to feel, not enough to crash."
  },
  {
    name: "Saffron Extract",
    amount: "20mg",
    foundIn: "Saffron Crocus",
    sourcedFrom: "Spain",
    benefits: ["Mood Support", "Emotional Balance", "Stress"],
    description: "Standardized saffron extract to support a positive mood, stress resilience, and emotional balance over time.*"
  },
  {
    name: "Vitamin B12",
    amount: "300mcg",
    foundIn: "Bioactive Methylcobalamin",
    sourcedFrom: "Lab Synthesized",
    benefits: ["Energy Metabolism", "Nervous System", "Cellular Health"],
    description: "Bioactive B12 to support healthy energy metabolism and nervous system function, especially useful for low B12 intake.*"
  }
];

export default function Ingredients() {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.33%"]);

  return (
    <section ref={ref} id="ingredients" className="min-h-screen md:h-[600vh] relative bg-transparent">
      
      {/* Desktop Horizontal Scroll View */}
      <div className="hidden md:flex sticky top-0 h-screen overflow-hidden items-center">
        <motion.div style={{ x }} className="flex">
          
          {/* Header Slide */}
          <div className="w-screen h-screen flex items-center justify-center px-6 shrink-0">
            <div className="max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-gray-900 leading-tight">
                All-natural, clinically-validated formula.<br />
                <span className="text-[#FF4D00]">Simple, powerful ingredients.</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
                We don&apos;t believe in spraying and praying. Each ingredient is hand-curated and validated to support morning energy, focus, and mood.
              </p>
            </div>
          </div>

          {/* Ingredient Slides */}
          {ingredients.map((ing, index) => (
            <div key={index} className="w-screen h-screen flex items-center justify-center px-6 shrink-0">
              <div className="max-w-6xl w-full grid md:grid-cols-12 gap-12 items-center">
                {/* Image Placeholder */}
                <div className="md:col-span-5 aspect-square rounded-3xl relative overflow-hidden group shadow-2xl shadow-orange-900/5">
                   <div className={`absolute inset-0 bg-linear-to-br ${index === 0 ? 'from-blue-100 to-blue-50' : index === 1 ? 'from-green-100 to-green-50' : index === 2 ? 'from-orange-100 to-orange-50' : 'from-purple-100 to-purple-50'} transition-transform duration-700 group-hover:scale-110`}></div>
                   
                   {/* Abstract Shapes */}
                   <div className="absolute inset-0 opacity-50 mix-blend-multiply">
                      <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20"></div>
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl ${index === 0 ? 'bg-blue-400/30' : index === 1 ? 'bg-green-400/30' : index === 2 ? 'bg-orange-400/30' : 'bg-purple-400/30'}`}></div>
                   </div>

                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-8xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                       {index === 0 ? '🧠' : index === 1 ? '🍵' : index === 2 ? '⚡' : '🌸'}
                     </span>
                   </div>
                </div>

                {/* Content */}
                <div className="md:col-span-7 grid md:grid-cols-2 gap-12">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-4xl font-serif font-bold text-gray-900">{ing.name}</h3>
                      <span className="text-gray-400 font-mono text-sm">{ing.amount}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">{ing.description}</p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Found In</h4>
                      <p className="text-gray-600">{ing.foundIn}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Sourced From</h4>
                      <p className="text-gray-600">{ing.sourcedFrom}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {ing.benefits.map((benefit, i) => (
                          <li key={i} className="text-gray-600 flex items-center gap-2">
                            <span className="w-1 h-1 bg-[#FF4D00] rounded-full"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden py-12 px-2 min-h-screen flex flex-col">
        <div className="mb-8 px-4">
          <h2 className="text-4xl font-serif font-bold mb-4 text-gray-900 leading-tight">
            All-natural, clinically-validated formula.<br />
            <span className="text-[#FF4D00]">Simple, powerful ingredients.</span>
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Swipe to explore our hand-curated ingredients.
          </p>
        </div>

        <div className="relative h-[680px] w-full flex-1 perspective-1000">
          <AnimatePresence mode="popLayout">
            {ingredients.map((ing, index) => {
              if (index === activeCard) {
                return (
                  <motion.div
                    key={index}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (offset.x < -100 || swipe < -500) {
                        setActiveCard((prev) => (prev + 1) % ingredients.length);
                      } else if (offset.x > 100 || swipe > 500) {
                        setActiveCard((prev) => (prev - 1 + ingredients.length) % ingredients.length);
                      }
                    }}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
                    exit={{ x: -300, opacity: 0, rotate: -20, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden z-20 cursor-grab active:cursor-grabbing p-3"
                  >
                    <div className="h-full flex flex-col">
                      {/* Image Area */}
                      <div className="h-[35%] relative overflow-hidden rounded-[2rem]">
                        <div className={`absolute inset-0 bg-linear-to-br ${index === 0 ? 'from-blue-100 to-blue-50' : index === 1 ? 'from-green-100 to-green-50' : index === 2 ? 'from-orange-100 to-orange-50' : 'from-purple-100 to-purple-50'}`}></div>
                        <div className="absolute inset-0 opacity-50 mix-blend-multiply">
                          <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20"></div>
                          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl ${index === 0 ? 'bg-blue-400/30' : index === 1 ? 'bg-green-400/30' : index === 2 ? 'bg-orange-400/30' : 'bg-purple-400/30'}`}></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-8xl filter drop-shadow-lg">
                            {index === 0 ? '🧠' : index === 1 ? '🍵' : index === 2 ? '⚡' : '🌸'}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="px-2 py-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-baseline mb-2">
                          <h3 className="text-2xl font-serif font-bold text-gray-900">{ing.name}</h3>
                          <span className="text-orange-600 font-mono font-bold text-sm">{ing.amount}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4 text-sm line-clamp-3">{ing.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Found In</span>
                            <span className="text-gray-900 font-medium text-sm">{ing.foundIn}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Sourced From</span>
                            <span className="text-gray-900 font-medium text-sm">{ing.sourcedFrom}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl mt-auto">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Key Benefits</span>
                          <ul className="space-y-2">
                            {ing.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                <span className="text-gray-700 font-medium text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              } else if (index === (activeCard + 1) % ingredients.length) {
                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.9, x: 20, opacity: 0 }}
                    animate={{ scale: 0.95, x: 24, y: 0, opacity: 1 }}
                    className="absolute inset-0 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden z-10 opacity-50 pointer-events-none p-3"
                  >
                     <div className="h-full flex flex-col opacity-40">
                        <div className={`h-[35%] bg-gray-100 rounded-[2rem]`}></div>
                        <div className="p-6">
                            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                        </div>
                     </div>
                  </motion.div>
                );
              }
              return null;
            })}
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
            {ingredients.map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveCard(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeCard ? 'bg-orange-600 w-6' : 'bg-gray-300'}`} 
                />
            ))}
        </div>
      </div>
    </section>
  );
}
