import { motion } from 'framer-motion';

export default function FlowingBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#FDFCF8]">
      {/* Mobile Static Background */}
      <div className="absolute inset-0 md:hidden">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full bg-orange-500/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] rounded-full bg-amber-500/10 blur-2xl" />
      </div>

      {/* Desktop Animated Background - CSS Animation */}
      <div className="hidden md:block absolute inset-0">
        <div className="absolute -right-[15%] -top-[15%] w-[50vw] h-[50vw] rounded-full bg-linear-to-br from-orange-500/20 to-amber-600/20 blur-3xl mix-blend-multiply animate-blob" />
        <div className="absolute -left-[15%] top-[30%] w-[45vw] h-[45vw] rounded-full bg-linear-to-tr from-yellow-500/20 to-orange-500/20 blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute -right-[10%] bottom-[10%] w-[40vw] h-[40vw] rounded-full bg-linear-to-bl from-orange-400/20 to-amber-500/20 blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
