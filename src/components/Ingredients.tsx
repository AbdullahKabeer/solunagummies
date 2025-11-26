'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.33%"]);

  return (
    <section ref={ref} id="ingredients" className="h-[600vh] relative bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
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
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20"></div>
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
    </section>
  );
}
