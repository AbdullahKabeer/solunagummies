'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const benefits = [
  {
    id: "01",
    title: "Focus & Clarity",
    description: "Cognizin® citicoline + natural caffeine supports the brain’s natural energy production.",
    gradient: "from-orange-400 to-red-500",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Calm Energy",
    description: "L-theanine + caffeine combo clinically studied for attention and smooth alertness.",
    gradient: "from-blue-400 to-teal-500",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Mood Balance",
    description: "Standardized saffron extract at research-level doses for emotional well-being.",
    gradient: "from-purple-400 to-pink-500",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800&auto=format&fit=crop"
  }
];

export default function Benefits() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={ref} className="h-[300vh] relative bg-transparent">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto relative h-[600px] flex items-center justify-center">
            {benefits.map((benefit, index) => {
              // Calculate range for this specific card
              const start = index * 0.33;
              const end = start + 0.33;
              
              // Transform hooks need to be called at the top level, so we'll extract this logic
              // into a sub-component or just map it here if we can ensure hook rules.
              // Since we are mapping a static array, we can use hooks inside the map in this specific case 
              // (React allows hooks in loops if the loop order/count is constant, but it's safer to extract).
              // However, for simplicity and safety, let's extract the Card component.
              return (
                <BenefitCard 
                  key={index} 
                  benefit={benefit} 
                  index={index} 
                  total={benefits.length} 
                  progress={scrollYProgress} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, index, total, progress }: { benefit: any, index: number, total: number, progress: any }) {
  const rangeStart = index * (1 / total);
  const rangeEnd = (index + 1) * (1 / total);
  
  // Opacity: Fade in when entering range, fade out when leaving
  const opacity = useTransform(
    progress,
    [rangeStart - 0.1, rangeStart, rangeEnd - 0.1, rangeEnd],
    [0, 1, 1, 0]
  );

  // Scale: Slight zoom effect
  const scale = useTransform(
    progress,
    [rangeStart, rangeEnd],
    [0.8, 1]
  );

  // Y Position: Slide up effect
  const y = useTransform(
    progress,
    [rangeStart - 0.1, rangeStart, rangeEnd],
    [100, 0, -100]
  );

  // We want the first card to be visible initially without scrolling
  const isFirst = index === 0;
  const initialOpacity = isFirst ? useTransform(progress, [0, rangeEnd - 0.1, rangeEnd], [1, 1, 0]) : opacity;
  const initialY = isFirst ? useTransform(progress, [0, rangeEnd], [0, -100]) : y;
  const initialScale = isFirst ? useTransform(progress, [0, rangeEnd], [1, 1]) : scale;

  return (
    <motion.div 
      style={{ 
        opacity: isFirst ? initialOpacity : opacity, 
        y: isFirst ? initialY : y,
        scale: isFirst ? initialScale : scale,
        zIndex: index 
      }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center p-12 rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-orange-500/5">
        
        {/* Visual Side */}
        <div className="relative aspect-square flex items-center justify-center">
          <div className={`absolute inset-0 bg-linear-to-br ${benefit.gradient} opacity-20 blur-3xl rounded-full animate-pulse`}></div>
          
          <div className="relative w-64 h-64 rounded-[2rem] overflow-hidden border border-white/60 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
            <img 
              src={benefit.image} 
              alt={benefit.title}
              className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-700"
            />
            <div className={`absolute inset-0 bg-linear-to-br ${benefit.gradient} opacity-10 mix-blend-overlay`}></div>
          </div>

          <div className="absolute top-0 left-0 text-9xl font-serif font-bold text-black/5 z-[-1]">
            {benefit.id}
          </div>
        </div>

        {/* Text Side */}
        <div>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {benefit.title}
          </h3>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            {benefit.description}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
