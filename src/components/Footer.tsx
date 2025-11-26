export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#FDFCF8] py-16 border-t border-[#FDFCF8]/10 relative overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-noise" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold tracking-tighter italic">Soluna</h2>
            <p className="text-[#FDFCF8]/60 mt-3 font-light">Brain fuel for the modern world.</p>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-[#FDFCF8]/60 hover:text-[#FDFCF8] transition-colors text-sm tracking-wide">Terms</a>
            <a href="#" className="text-[#FDFCF8]/60 hover:text-[#FDFCF8] transition-colors text-sm tracking-wide">Privacy</a>
            <a href="#" className="text-[#FDFCF8]/60 hover:text-[#FDFCF8] transition-colors text-sm tracking-wide">Contact</a>
          </div>
        </div>
        <div className="border-t border-[#FDFCF8]/10 mt-16 pt-8 text-center text-[#FDFCF8]/40 text-xs leading-relaxed">
          <p>© {new Date().getFullYear()} Soluna. All rights reserved.</p>
          <p className="mt-4 max-w-2xl mx-auto">*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </div>
    </footer>
  );
}
