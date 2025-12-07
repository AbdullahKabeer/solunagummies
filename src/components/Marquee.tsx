export default function Marquee() {
  return (
    <div className="relative flex overflow-hidden bg-black py-4 md:py-8 border-y border-white/10">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}} />
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay hidden md:block"></div>
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        {[0, 1].map((part) => (
          <div key={part} className="flex shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-8 md:gap-12 mx-4 md:mx-6">
                <span className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500 uppercase font-serif italic opacity-80 py-2 md:py-4 leading-relaxed pr-2">
                  Focus You Can Feel
                </span>
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500"></span>
                <span className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500 uppercase font-serif italic opacity-80 py-2 md:py-4 leading-relaxed pr-2">
                  Clean Energy
                </span>
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500"></span>
                <span className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500 uppercase font-serif italic opacity-80 py-2 md:py-4 leading-relaxed pr-2">
                  Zero Crash
                </span>
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500"></span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}