'use client';

import { motion } from 'framer-motion';

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
  return (
    <section id="ingredients" className="py-24 bg-transparent relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-900 leading-tight">
            All-natural, clinically-validated formula.<br />
            <span className="text-[#FF4D00]">Simple, powerful ingredients.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-light leading-relaxed">
            We don&apos;t believe in spraying and praying. Each ingredient is hand-curated and validated to support morning energy, focus, and mood.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ingredients.map((ing, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-100 border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon Header */}
              <div className="mb-6 relative h-32 rounded-2xl overflow-hidden group">
                <div className={`absolute inset-0 bg-linear-to-br ${index === 0 ? 'from-blue-100 to-blue-50' : index === 1 ? 'from-green-100 to-green-50' : index === 2 ? 'from-orange-100 to-orange-50' : 'from-purple-100 to-purple-50'} transition-transform duration-700 group-hover:scale-110`}></div>
                
                {/* Abstract Shapes */}
                <div className="absolute inset-0 opacity-50 mix-blend-multiply">
                   <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20"></div>
                   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-xl ${index === 0 ? 'bg-blue-400/30' : index === 1 ? 'bg-green-400/30' : index === 2 ? 'bg-orange-400/30' : 'bg-purple-400/30'}`}></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    {index === 0 ? '🧠' : index === 1 ? '🍵' : index === 2 ? '⚡' : '🌸'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">{ing.name}</h3>
                  <span className="text-orange-600 font-mono font-bold text-sm bg-orange-50 px-2 py-1 rounded-full">{ing.amount}</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6 text-sm flex-grow">
                  {ing.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Found In</span>
                    <span className="text-gray-900 font-medium text-sm">{ing.foundIn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Sourced From</span>
                    <span className="text-gray-900 font-medium text-sm">{ing.sourcedFrom}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Key Benefits</span>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
