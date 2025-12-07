'use client';

const benefits = [
  {
    id: "01",
    title: "Stable Lift",
    code: "MOD_LIFT_01",
    description: "Sustained dopamine release without adrenal fatigue. Engineered for 6-hour efficacy.",
  },
  {
    id: "02",
    title: "Deep Focus",
    code: "MOD_FOCUS_02",
    description: "Alpha-wave promotion via L-Theanine synergy. Eliminates peripheral distractions.",
  },
  {
    id: "03",
    title: "Neural Repair",
    code: "MOD_REPAIR_03",
    description: "Supports long-term synaptic plasticity and membrane health via Citicoline.",
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 border-b border-black bg-[#F2F0E9]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-black pb-6">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            System<br/>Capabilities
          </h2>
          <div className="font-mono text-sm mb-2 md:mb-0">
            /// PERFORMANCE_METRICS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="card-brutal group hover:bg-black hover:text-white transition-colors duration-300">
              <div className="flex justify-between items-start mb-8 border-b border-black group-hover:border-white pb-4">
                <span className="font-mono text-xs font-bold">{benefit.code}</span>
                <span className="font-mono text-xs">[{benefit.id}]</span>
              </div>
              
              <h3 className="text-3xl font-bold uppercase mb-4 tracking-tight">{benefit.title}</h3>
              <p className="font-mono text-sm leading-relaxed opacity-80">
                {benefit.description}
              </p>

              <div className="mt-8 pt-4 border-t border-dashed border-black group-hover:border-white flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest">Status</span>
                <div className="w-2 h-2 bg-[#FF3300] rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
