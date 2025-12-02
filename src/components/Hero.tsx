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
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent">
      
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            className="w-full lg:w-3/5 perspective-[2000px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="lg:transform-[rotateY(15deg)] lg:origin-center lg:transform-3d">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 mb-12"
              >
                <div className="h-px w-12 bg-orange-600"></div>
                <span className="text-xs font-bold tracking-[0.3em] text-orange-900 uppercase">Est. 2024</span>
              </motion.div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl leading-[1.1] text-[#1a1a1a] mb-8 md:mb-12 tracking-tight text-center lg:text-left">
                <motion.div variants={itemVariants} className="py-2">
                  Reclaim your
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="italic text-orange-600 ml-0 lg:ml-24 lg:pr-4 py-2"
                >
                  cognitive
                </motion.div>
                <motion.div variants={itemVariants} className="py-2">
                  architecture.
                </motion.div>
              </h1>

              <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24 ml-2 md:ml-4">
                <motion.p 
                  variants={itemVariants}
                  className="text-lg md:text-xl text-gray-600 max-w-md leading-relaxed font-light"
                >
                  A daily ritual for deep work. <br/>
                  Formulated with <span className="text-orange-600 font-medium">Cognizin®</span> and <span className="text-orange-600 font-medium">Saffron</span> to silence the noise and amplify your signal.
                </motion.p>

                <motion.div 
                  variants={itemVariants}
                  className="relative group hidden md:block"
                >
                  <Link 
                    href="#purchase" 
                    onClick={handleScroll}
                    className="relative z-10 inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase transition-transform duration-500 group-hover:scale-110"
                  >
                    Shop
                  </Link>
                  <div className="absolute inset-0 rounded-full border border-[#1a1a1a] scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                </motion.div>
                
                {/* Mobile Shop Button */}
                <motion.div 
                  variants={itemVariants}
                  className="md:hidden w-full"
                >
                  <Link 
                    href="#purchase" 
                    onClick={handleScroll}
                    className="flex items-center justify-center w-full py-4 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating Product Mockup */}
          <div className="w-full lg:w-2/5 relative flex justify-center lg:justify-end perspective-[1000px] mt-0 lg:mt-0 mb-20 lg:mb-0">
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
