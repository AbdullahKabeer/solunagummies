'use client';

import { ArrowRight, Brain, Zap, Activity, Layers } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Supports Focus",
    description: "Citicoline provides the essential nutrients to support healthy brain energy and cognitive signaling.",
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: "02",
    title: "Promotes Calm",
    description: "L-Theanine helps promote alpha brain waves, associated with a state of wakeful relaxation.",
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: "03",
    title: "Mood Support",
    description: "Saffron extract helps maintain positive mood and emotional balance during stressful periods.",
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: "04",
    title: "Steady Flow",
    description: "The combination creates a synergistic effect for sustained mental clarity and performance.",
    icon: <Layers className="w-6 h-6" />
  }
];

export default function Science() {
  return (
    <section id="science" className="py-24 bg-white border-b border-black/10">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-8">
          <div>
            <div className="inline-block bg-black text-white px-3 py-1 text-xs font-mono mb-4 rounded-full">
              Science
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] leading-tight">
              How the Formula<br />Works
            </h2>
          </div>
          <div className="mt-8 md:mt-0 max-w-md">
            <p className="text-gray-600 leading-relaxed">
              Soluna uses a multi-pathway approach to support cognitive health, targeting energy, focus, and mood simultaneously.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group bg-white p-8 md:p-12 hover:bg-orange-50 transition-colors duration-300 relative"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-white group-hover:text-[#FF3300] transition-colors">
                  Step {step.id}
                </span>
                <div className="text-gray-400 group-hover:text-[#FF3300] transition-colors">
                  {step.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF3300]">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="group flex items-center gap-2 font-bold text-sm text-[#1a1a1a] hover:text-[#FF3300] transition-colors">
            <span>Read the Clinical Research</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
