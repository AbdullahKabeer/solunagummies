'use client';

import { motion } from 'framer-motion';

interface SectionFlowProps {
  variant?: 'line' | 'orb' | 'fade' | 'lightToDark' | 'darkToLight';
  className?: string;
}

export default function SectionFlow({ variant = 'line', className = '' }: SectionFlowProps) {
  return (
    <div className={`w-full flex justify-center items-center relative z-0 pointer-events-none ${className}`}>
      {variant === 'line' && (
        <div className="h-32 relative">
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: '100%', opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-[1px] h-full bg-linear-to-b from-transparent via-orange-200 to-transparent"
          />
        </div>
      )}

      {variant === 'orb' && (
        <div className="h-40 relative flex items-center justify-center">
           <motion.div
             initial={{ height: 0 }}
             whileInView={{ height: '100%' }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="absolute w-[1px] bg-linear-to-b from-gray-100 via-gray-200 to-gray-100"
           />
           <motion.div
             initial={{ scale: 0, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="w-3 h-3 rounded-full border border-orange-300 bg-[#FDFCF8] relative z-10"
           />
           <motion.div
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute w-3 h-3 rounded-full bg-orange-400/30 blur-sm"
           />
        </div>
      )}

      {variant === 'lightToDark' && (
        <div className="w-full h-32 bg-linear-to-b from-[#FDFCF8] to-[#1a1a1a] relative flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-noise" />
           <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: '100%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-px h-full bg-linear-to-b from-orange-200/50 to-[#FDFCF8]/10 relative z-10"
          />
        </div>
      )}

      {variant === 'darkToLight' && (
        <div className="w-full h-32 bg-linear-to-b from-[#1a1a1a] to-[#FDFCF8] relative flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-noise" />
           <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: '100%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-px h-full bg-linear-to-b from-[#FDFCF8]/10 to-orange-200/50 relative z-10"
          />
        </div>
      )}
    </div>
  );
}