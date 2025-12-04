'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue, useInView } from 'framer-motion';
import { useRef, useState, MouseEvent, useEffect } from 'react';

const ingredients = [
  {
    name: "Cognizin® Citicoline",
    amount: "125mg",
    foundIn: "Brain Tissue",
    sourcedFrom: "Japan",
    benefits: ["Brain Energy", "Focus", "Neural Repair"],
    description: "A patented form of citicoline that supports the brain’s natural energy production and healthy communication between neurons.",
    color: "from-blue-500 to-cyan-400",
    bg: "bg-blue-50",
    icon: "🧠"
  },
  {
    name: "L-Theanine",
    amount: "100mg",
    foundIn: "Green Tea",
    sourcedFrom: "Japan",
    benefits: ["Calm Alertness", "Alpha Waves", "Stress Reduction"],
    description: "An amino acid that promotes a state of 'calm alertness,' helping smooth out caffeine and support focused concentration.",
    color: "from-green-500 to-emerald-400",
    bg: "bg-green-50",
    icon: "🍵"
  },
  {
    name: "Natural Caffeine",
    amount: "50mg",
    foundIn: "Green Tea",
    sourcedFrom: "India",
    benefits: ["Alertness", "Reaction Time", "Metabolism"],
    description: "Gentle lift in alertness and reaction time from a natural source. Enough to feel, not enough to crash.",
    color: "from-orange-500 to-amber-400",
    bg: "bg-orange-50",
    icon: "⚡"
  },
  {
    name: "Saffron Extract",
    amount: "20mg",
    foundIn: "Saffron Crocus",
    sourcedFrom: "Spain",
    benefits: ["Mood Support", "Emotional Balance", "Stress"],
    description: "Standardized saffron extract to support a positive mood, stress resilience, and emotional balance over time.*",
    color: "from-purple-500 to-pink-400",
    bg: "bg-purple-50",
    icon: "🌸"
  },
  {
    name: "Vitamin B12",
    amount: "300mcg",
    foundIn: "Bioactive Methylcobalamin",
    sourcedFrom: "Lab Synthesized",
    benefits: ["Energy Metabolism", "Nervous System", "Cellular Health"],
    description: "Bioactive B12 to support healthy energy metabolism and nervous system function, especially useful for low B12 intake.*",
    color: "from-red-500 to-rose-400",
    bg: "bg-red-50",
    icon: "🧬"
  }
];

function IngredientCard({ ing, index, containerRef, onClick }: { ing: typeof ingredients[0], index: number, containerRef: React.RefObject<HTMLDivElement | null>, onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollXProgress } = useScroll({
    target: cardRef,
    container: containerRef,
    axis: "x",
    offset: ["start end", "end start"]
  });

  // 3D Revolving Effect
  // 0 (entering from right) -> rotateY: -45deg
  // 0.5 (center) -> rotateY: 0deg
  // 1 (leaving to left) -> rotateY: 45deg
  const rotateY = useTransform(scrollXProgress, [0, 0.5, 1], [45, 0, -45]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollXProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);
  const z = useTransform(scrollXProgress, [0, 0.5, 1], [-100, 0, -100]);

  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateYSpring = useSpring(rotateY, springConfig);
  const scaleSpring = useSpring(scale, springConfig);
  const zSpring = useSpring(z, springConfig);

  const handleClick = () => {
    if (cardRef.current && containerRef.current) {
      onClick();
      const container = containerRef.current;
      const card = cardRef.current;
      const scrollLeft = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={handleClick}
      style={{
        rotateY: rotateYSpring,
        scale: scaleSpring,
        z: zSpring,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className="w-full md:w-[400px] shrink-0 py-10 perspective-1000 cursor-pointer"
    >
      <div className="group relative h-full rounded-4xl border border-gray-200 bg-white p-8 shadow-xl transition-all hover:shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-16 h-16 rounded-2xl ${ing.bg} flex items-center justify-center text-3xl shadow-inner`}>
            {ing.icon}
          </div>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-mono text-sm font-bold">
            {ing.amount}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-[#FF4D00] transition-colors">
          {ing.name}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6 grow text-sm md:text-base">
          {ing.description}
        </p>

        {/* Details Grid */}
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

        {/* Benefits Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {ing.benefits.map((benefit, i) => (
            <span 
              key={i}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-100"
            >
              {benefit}
            </span>
          ))}
        </div>
        
        {/* Decorative Gradient Line */}
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-linear-to-r ${ing.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </div>
    </motion.div>
  );
}

export default function Ingredients() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const [isDragging, setIsDragging] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const didDrag = useRef(false);
  
  // Momentum Scrolling Refs
  const velocity = useRef(0);
  const lastMoveTime = useRef(0);
  const lastPageX = useRef(0);
  const rAF = useRef<number>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout>(null);

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    setTimerKey(prev => prev + 1);
    
    autoScrollTimer.current = setInterval(() => {
      if (containerRef.current && !isDragging) {
        const firstCard = containerRef.current.children[0] as HTMLElement;
        const secondCard = containerRef.current.children[1] as HTMLElement;
        const cardWidth = (firstCard && secondCard) 
          ? secondCard.offsetLeft - firstCard.offsetLeft 
          : (firstCard ? firstCard.offsetWidth + (window.innerWidth >= 768 ? 24 : 16) : 0);
        
        if (!cardWidth) return;

        const currentScroll = containerRef.current.scrollLeft;
        
        const currentIndex = Math.round(currentScroll / cardWidth);
        const totalCards = ingredients.length + 1; // ingredients + CTA
        
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalCards) {
          nextIndex = 0;
        }
        
        containerRef.current.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth'
        });
        
        setTimerKey(prev => prev + 1);
      }
    }, 7000);
  };

  useEffect(() => {
    if (isInView) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
      stopAutoScroll();
    };
  }, [isInView]);

  const snapToNearestCard = () => {
    if (!containerRef.current) return;
    setIsDragging(false);
    
    const firstCard = containerRef.current.children[0] as HTMLElement;
    const secondCard = containerRef.current.children[1] as HTMLElement;
    const cardWidth = (firstCard && secondCard) 
      ? secondCard.offsetLeft - firstCard.offsetLeft 
      : (firstCard ? firstCard.offsetWidth + (window.innerWidth >= 768 ? 24 : 16) : 0);

    if (!cardWidth) return;

    const currentScroll = containerRef.current.scrollLeft;
    const nearestIndex = Math.round(currentScroll / cardWidth);
    
    containerRef.current.scrollTo({
      left: nearestIndex * cardWidth,
      behavior: 'smooth'
    });
    
    startAutoScroll();
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!containerRef.current) return;
    stopAutoScroll();
    if (rAF.current) cancelAnimationFrame(rAF.current);
    
    setIsDragging(true);
    didDrag.current = false;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    
    lastPageX.current = e.pageX;
    lastMoveTime.current = Date.now();
    velocity.current = 0;
  };


  const handleMouseUp = () => {
    // Don't set isDragging false immediately to keep snap disabled during momentum
    const timeSinceLastMove = Date.now() - lastMoveTime.current;
    if (timeSinceLastMove > 50) {
      velocity.current = 0;
    }
    
    if (Math.abs(velocity.current) > 0.5) {
      startMomentum();
    } else {
      snapToNearestCard();
    }

    setTimeout(() => {
      didDrag.current = false;
    }, 50);
  };

  const handleMouseLeave = () => {
    handleMouseUp();
  };

  const startMomentum = () => {
    if (!containerRef.current) return;
    
    const momentumLoop = () => {
      if (!containerRef.current) return;
      
      // Apply velocity
      containerRef.current.scrollLeft -= velocity.current;
      
      // Apply friction
      velocity.current *= 0.95;
      
      if (Math.abs(velocity.current) > 0.5) {
        rAF.current = requestAnimationFrame(momentumLoop);
      } else {
        snapToNearestCard();
      }
    };
    
    rAF.current = requestAnimationFrame(momentumLoop);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    
    // Calculate velocity
    const now = Date.now();
    const dt = now - lastMoveTime.current;
    const dx = e.pageX - lastPageX.current;
    
    // Simple velocity tracking (pixels per frame approx)
    velocity.current = dx * 1.5; // Match the walk multiplier
    
    lastPageX.current = e.pageX;
    lastMoveTime.current = now;
    
    if (Math.abs(walk) > 5) {
      didDrag.current = true;
    }
    
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleCardClick = () => {
    if (didDrag.current) return;
  };

  return (
    <section id="ingredients" className="py-24 bg-gray-50/50 relative z-10 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-medium text-sm tracking-wide uppercase"
          >
            The Formula
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-900 leading-tight">
            Simple ingredients.<br />
            <span className="text-[#FF4D00]">Powerful results.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Swipe to explore the clinically validated ingredients that power your morning.
          </p>
        </div>

        {/* Revolving Scroll Container */}
        <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
          {/* Scroll Indicators */}
          <div className="flex justify-center gap-2 pointer-events-none opacity-50 mb-8">
             <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
               {!isDragging && (
                 <motion.div 
                   key={timerKey}
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 7, ease: "linear" }}
                   className="h-full bg-orange-500" 
                 />
               )}
             </div>
          </div>

          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-4 md:gap-6 overflow-x-auto pb-12 pt-4 px-[5%] md:px-[calc(50%_-_200px)] scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              perspective: '1000px',
              scrollBehavior: isDragging ? 'auto' : 'smooth' 
            }}
          >
            {ingredients.map((ing, index) => (
              <IngredientCard 
                key={index} 
                ing={ing} 
                index={index} 
                containerRef={containerRef}
                onClick={handleCardClick}
              />
            ))}
            
            {/* Call to Action Card */}
            <motion.div
              className="w-full md:w-[400px] shrink-0 py-10 flex items-center justify-center"
            >
              <div className="rounded-4xl bg-[#FF4D00] p-8 shadow-xl flex flex-col justify-center items-center text-center text-white relative overflow-hidden group cursor-pointer w-full h-full min-h-[400px]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold mb-4">Full Transparency</h3>
                  <p className="text-orange-100 mb-8 text-lg">
                    No hidden fillers. No artificial junk. Just the good stuff.
                  </p>
                  <a href="#product" className="inline-block bg-white text-[#FF4D00] px-8 py-4 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg">
                    See Full Label
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
