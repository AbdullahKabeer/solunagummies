'use client';

import Link from 'next/link';
import Hero3DProduct from './Hero3DProduct';
import { motion } from 'framer-motion';

export default function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1.0] as [number, number, number, number]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent">
      
      <div className="container mx-auto px-6 relative z-10 pt-20 md:pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            className="w-full lg:w-3/5 perspective-[2000px] no-animate-mobile"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="lg:transform-[rotateY(15deg)] lg:origin-center lg:transform-3d">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 mb-12 no-animate-mobile"
              >
                <div className="h-px w-12 bg-orange-600"></div>
                <span className="text-xs font-bold tracking-[0.3em] text-orange-900 uppercase">Est. 2024</span>
              </motion.div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl leading-[1.1] text-[#1a1a1a] mb-8 md:mb-12 tracking-tight text-center lg:text-left">
                <motion.div variants={itemVariants} className="py-2 no-animate-mobile">
                  Smooth, Natural
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="italic text-orange-600 ml-0 lg:ml-4 lg:pr-4 py-2 no-animate-mobile"
                >
                  Support for Focus
                </motion.div>
                <motion.div variants={itemVariants} className="py-2 no-animate-mobile">
                  & Daily Energy
                </motion.div>
              </h1>

              <div className="flex flex-col md:flex-row items-center lg:items-start gap-8 md:gap-24 ml-2 md:ml-4">
                <div className="max-w-md text-center lg:text-left">
                  <motion.p 
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-600 leading-relaxed font-light no-animate-mobile mb-4"
                  >
                    A daily nootropic gummy formulated to support alertness, clarity, and a calm sense of energy throughout your day.
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    className="text-xs text-gray-400 leading-relaxed font-light no-animate-mobile"
                  >
                    Made with research-backed ingredients that help support healthy brain function.*
                  </motion.p>
                  
                  {/* Social Proof */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center justify-center lg:justify-start gap-3 mt-6 no-animate-mobile"
                  >
                    <div className="flex text-[#FF4D00]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">4.8/5 Average Rating</span>
                  </motion.div>

                  {/* Badges */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6 no-animate-mobile"
                  >
                    {['GMP Certified', 'Made in USA', 'Natural Caffeine', 'Vegan', '3rd Party Tested'].map((badge) => (
                      <span key={badge} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        {badge}
                      </span>
                    ))}
                  </motion.div>
                </div>

                <motion.div 
                  variants={itemVariants}
                  className="relative group hidden md:block no-animate-mobile"
                >
                  <Link 
                    href="#purchase" 
                    onClick={handleScroll}
                    className="relative z-10 inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase transition-transform duration-500 group-hover:scale-110 text-center px-4"
                  >
                    Get Focus Gummies
                  </Link>
                  <div className="absolute inset-0 rounded-full border border-[#1a1a1a] scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                  
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-64 text-center">
                    <p className="text-[10px] text-gray-500 font-medium">Thousands of customers use Focus as part of their daily routine.</p>
                  </div>
                </motion.div>
                
                {/* Mobile Shop Button */}
                <motion.div 
                  variants={itemVariants}
                  className="md:hidden w-full"
                >
                  <Link 
                    href="#purchase" 
                    onClick={handleScroll}
                    className="flex items-center justify-center w-full py-5 rounded-full bg-[#1a1a1a] text-white text-base font-bold tracking-widest uppercase shadow-xl"
                  >
                    Get Focus
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating Product Mockup */}
          <div className="w-full lg:w-2/5 relative flex justify-center lg:justify-end perspective-[1000px] mt-0 lg:mt-0 mb-8 lg:mb-0 scale-90 md:scale-100">
            <Hero3DProduct />
          </div>
        </div>
      </div>
      
      {/* Scroll Line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100px" }}
        transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
        className="absolute bottom-0 left-12 w-px bg-gray-300 hidden md:block"
      ></motion.div>
    </section>
  );
}
