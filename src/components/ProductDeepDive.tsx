'use client';

import { motion } from 'framer-motion';

export default function ProductDeepDive() {
  return (
    <div className="bg-[#FDFCF8]">
      
      {/* Key Benefits */}
      <section className="py-24 container mx-auto px-6 max-w-5xl">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-16 text-center">Key Benefits</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-5xl mb-6">🧠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Focus & Mental Clarity*</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Citicoline (as Cognizin®) helps support the brain’s natural energy production and communication between neurons, so you can lock in on tasks and stay sharp.*
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-6">🌊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Calm, Non-Jittery Energy*</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              L-theanine and natural caffeine work together to promote smooth, focused alertness instead of shaky stimulation or an afternoon crash.*
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-6">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mood & Stress Support*</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Standardized saffron extract is included at a meaningful dose to support a more positive mood, emotional balance, and stress resilience when used consistently.*
            </p>
          </div>
        </div>
        <div className="mt-16 text-center max-w-2xl mx-auto bg-orange-50 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Better-For-You Gummy Base</h3>
          <p className="text-gray-600 font-light">
            Pectin-based (no gelatin), sweetened with allulose and monk fruit instead of heavy sugar or corn syrup, so your focus ritual feels like a treat—not a sugar bomb.
          </p>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12 text-center">Made For People Who:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Want focus and mental clarity without living on energy drinks",
              "Need to get into deep work more easily (creators, students, founders, professionals)*",
              "Prefer calm, steady energy over jittery spikes and crashes*",
              "Want mood and stress support wrapped in a delicious blood orange gummy*"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm">
                <span className="text-orange-500 text-xl">✓</span>
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 container mx-auto px-6 max-w-5xl">
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-16 text-center">How Soluna Works</h2>
        <div className="space-y-16">
          {[
            {
              title: "1. Brain Fuel for Focus",
              desc: "Cognizin® citicoline supports the brain’s natural energy metabolism and healthy phospholipid production. In simple terms: it helps keep the “wiring” and “power supply” of your brain in good working order, which is key for attention and mental performance.*"
            },
            {
              title: "2. Calm, Smooth Stimulation",
              desc: "The combination of L-theanine and natural caffeine is designed to promote “calm alertness.” Caffeine provides the lift in alertness; L-theanine helps smooth the edges so you stay focused and composed instead of wired.*"
            },
            {
              title: "3. Mood & Emotional Balance",
              desc: "Saffron extract, used at 20 mg per serving, is included to support mood, emotional balance, and stress resilience when taken regularly over time. It’s not a sedative—it’s there to support a more even, positive headspace as part of your daily routine.*"
            },
            {
              title: "4. Built into a Modern, Low-Sugar Gummy",
              desc: "The actives are delivered in a pectin-based gummy sweetened with allulose and monk fruit, plus tapioca fiber syrup for body. You get a satisfying chew and flavor without loading up on sugar."
            }
          ].map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <h3 className="text-2xl font-serif font-bold text-gray-900">{step.title}</h3>
              </div>
              <div className="w-full md:w-2/3">
                <p className="text-gray-600 text-lg font-light leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-serif font-bold mb-16 text-center">What’s Inside Each 2-Gummy Serving</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                name: "Cognizin® Citicoline",
                amount: "125 mg",
                desc: "A premium, clinically researched form of citicoline that supports brain energy, mental clarity, and attention. This is one of the hero ingredients behind Soluna.*"
              },
              {
                name: "L-Theanine",
                amount: "100 mg",
                desc: "An amino acid naturally found in green tea. L-theanine is known for promoting a state of relaxed alertness and helping smooth out the stimulating effects of caffeine.*"
              },
              {
                name: "Natural Caffeine (from Green Tea)",
                amount: "50 mg",
                desc: "About the caffeine of half a small cup of coffee, sourced from green tea. Enough to feel more awake and focused—without feeling over-amped (for most people).*"
              },
              {
                name: "Saffron Extract",
                amount: "20 mg",
                desc: "Standardized saffron extract from Crocus sativus. Used at a meaningful dose to support mood, emotional balance, and stress resilience when taken consistently.*"
              },
              {
                name: "Vitamin B12 (as Methylcobalamin)",
                amount: "300 mcg",
                desc: "A bioactive form of vitamin B12 that supports energy metabolism, red blood cell formation, and healthy nerve function—especially useful if your diet is low in B12.*"
              }
            ].map((ing, i) => (
              <div key={i} className="border border-white/10 p-8 rounded-3xl hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="text-xl font-bold text-orange-500">{ing.name}</h3>
                  <span className="font-mono text-sm text-white/60">{ing.amount}</span>
                </div>
                <p className="text-white/70 font-light leading-relaxed">
                  {ing.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
