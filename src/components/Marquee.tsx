export default function Marquee() {
  return (
    <div className="relative flex overflow-hidden bg-black py-3 border-b border-black">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}} />
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{ animation: 'marquee 60s linear infinite' }}
      >
        {[0, 1, 2, 3].map((part) => (
          <div key={part} className="flex shrink-0 items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center mx-8">
                <span className="text-sm md:text-base font-mono font-bold tracking-widest text-white uppercase">
                  Trusted by High Performers
                </span>
                <span className="mx-8 text-[#FF3300] font-mono">///</span>
                <span className="text-sm md:text-base font-mono font-bold tracking-widest text-white uppercase">
                  Stanford Research
                </span>
                <span className="mx-8 text-[#FF3300] font-mono">///</span>
                <span className="text-sm md:text-base font-mono font-bold tracking-widest text-white uppercase">
                  Y Combinator Founders
                </span>
                <span className="mx-8 text-[#FF3300] font-mono">///</span>
                <span className="text-sm md:text-base font-mono font-bold tracking-widest text-white uppercase">
                  Elite Athletes
                </span>
                <span className="mx-8 text-[#FF3300] font-mono">///</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}