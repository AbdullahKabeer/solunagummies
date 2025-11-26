'use client';

import { motion } from 'framer-motion';

export default function FlowingBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#FDFCF8]">
      {/* Mobile Static Background */}
      <div className="absolute inset-0 md:hidden">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full bg-orange-500/10 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] rounded-full bg-amber-500/10 blur-3xl mix-blend-multiply" />
      </div>

      {/* Desktop Animated Background */}
      <div className="hidden md:block absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[15%] -top-[15%] w-[50vw] h-[50vw] rounded-full bg-linear-to-br from-orange-500/20 to-amber-600/20 blur-3xl mix-blend-multiply"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -60, 0],
            x: [0, -50, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-[15%] top-[30%] w-[45vw] h-[45vw] rounded-full bg-linear-to-tr from-yellow-500/20 to-orange-500/20 blur-3xl mix-blend-multiply"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[10%] bottom-[10%] w-[40vw] h-[40vw] rounded-full bg-linear-to-bl from-orange-400/20 to-amber-500/20 blur-3xl mix-blend-multiply"
        />
      </div>
    </div>
  );
}
