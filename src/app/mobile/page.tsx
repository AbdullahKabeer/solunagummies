import Link from 'next/link';
import { Star, Zap, Clock, CheckCircle, ShieldCheck, Truck, X, Brain, Smile, Leaf } from 'lucide-react';
import Header from '@/components/Header';
import ProductPurchase from '@/components/ProductPurchase';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import FAQ from '@/components/FAQ';
import TimelineSection from '@/components/TimelineSection';

export default function MobileLanding() {
  return (
    <main className="min-h-screen bg-white selection:bg-[#FF3300] selection:text-white pb-24">
      <StickyMobileCTA />
      
      <Header />

      {/* Mobile Hero */}
      <section className="pt-24 pb-8 px-4 text-center bg-[#FDFCF8]">
        <div className="inline-block px-3 py-1 bg-orange-50 text-[#FF3300] text-[10px] font-bold uppercase tracking-wider mb-4 rounded-full border border-orange-100">
          New Formula 2.0
        </div>
        
        <h1 className="text-4xl font-bold leading-[0.95] tracking-tight mb-4 text-[#1a1a1a]">
          Focus, Flow<br/>
          <span className="text-[#FF3300]">& Steady Energy</span>
        </h1>
        
        <p className="text-base text-gray-600 leading-relaxed mb-6 max-w-xs mx-auto">
          The daily gummy for calm, clear energy. <br/>
          <span className="font-medium text-gray-900">No jitters. No crash. Just flow.</span>
        </p>

        {/* Product Image */}
        <div className="relative w-56 h-72 mx-auto mb-8 bg-white rounded-3xl shadow-2xl shadow-orange-500/10 border border-gray-100 flex items-center justify-center transform rotate-[-2deg]">
            <div className="text-center p-4">
                <div className="font-bold text-3xl tracking-tight text-[#1a1a1a]">Soluna</div>
                <div className="font-mono text-[10px] text-[#FF3300] mt-2 bg-orange-50 inline-block mx-auto px-3 py-1 rounded-full">Daily Focus</div>
            </div>
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-200/30 rounded-full blur-[50px] -z-10"></div>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex text-[#FF3300]">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-sm font-medium text-gray-600">
                <span className="font-bold text-gray-900">4.9/5</span> from 1,240+ Happy Customers
            </p>
        </div>

        <Link 
            href="#purchase" 
            className="block w-full bg-[#FF3300] text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-orange-500/20 mb-8 active:scale-95 transition-transform"
        >
            Get Started Risk-Free
        </Link>

        {/* Quick Benefits */}
        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF3300]">
                    <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Steady Energy</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF3300]">
                    <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Fast Acting</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF3300]">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Science Backed</span>
            </div>
        </div>
      </section>

      {/* Problem / Agitation */}
      <section className="py-12 px-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#1a1a1a]">
            Tired of the <span className="text-gray-400 line-through">Afternoon Slump?</span>
        </h2>
        <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-red-50 border border-red-100">
                <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-red-900 text-sm mb-1">Coffee Jitters</h3>
                    <p className="text-xs text-red-800/80 leading-relaxed">Spikes your cortisol and leaves you anxious and shaky.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-red-50 border border-red-100">
                <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-red-900 text-sm mb-1">Energy Drink Crash</h3>
                    <p className="text-xs text-red-800/80 leading-relaxed">Full of sugar and chemicals that lead to a hard crash later.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-green-50 border border-green-100">
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-green-900 text-sm mb-1">The Soluna Way</h3>
                    <p className="text-xs text-green-800/80 leading-relaxed">Balanced, sustained focus from natural ingredients.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Timeline */}
      <div className="bg-gray-50">
        <TimelineSection />
      </div>

      {/* Mobile Comparison */}
      <section className="py-12 px-4 bg-white">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Why Switch?</h2>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-center py-3">
                <div className="text-left pl-4">Feature</div>
                <div className="text-[#FF3300]">Soluna</div>
                <div className="text-gray-400">Coffee</div>
            </div>
            {[
                { label: "No Jitters", soluna: true, coffee: false },
                { label: "No Crash", soluna: true, coffee: false },
                { label: "Natural Ingredients", soluna: true, coffee: true },
                { label: "Brain Health", soluna: true, coffee: false },
                { label: "Better Sleep", soluna: true, coffee: false },
            ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-gray-100 last:border-0 py-4 items-center">
                    <div className="pl-4 text-xs font-bold text-gray-700">{row.label}</div>
                    <div className="flex justify-center">
                        {row.soluna ? <CheckCircle className="w-5 h-5 text-[#FF3300]" /> : <X className="w-5 h-5 text-gray-300" />}
                    </div>
                    <div className="flex justify-center">
                        {row.coffee ? <CheckCircle className="w-5 h-5 text-gray-400" /> : <X className="w-5 h-5 text-gray-300" />}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Ingredients Highlight */}
      <section className="py-12 px-4 bg-[#FDFCF8]">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#1a1a1a]">What's Inside?</h2>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Leaf className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-bold text-sm mb-1">L-Theanine</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">Promotes relaxation without drowsiness.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Zap className="w-6 h-6 text-yellow-500 mb-3" />
                <h3 className="font-bold text-sm mb-1">Green Tea Caffeine</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">Clean energy source (50mg).</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Brain className="w-6 h-6 text-purple-500 mb-3" />
                <h3 className="font-bold text-sm mb-1">Citicoline</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">Supports brain energy and focus.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Smile className="w-6 h-6 text-orange-500 mb-3" />
                <h3 className="font-bold text-sm mb-1">Saffron</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">Mood balance and stress support.</p>
            </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#1a1a1a]">Real Results</h2>
        <div className="space-y-4">
            {[
                { name: "Sarah M.", text: "Finally something that gives me energy without making me anxious. I take two every morning.", stars: 5 },
                { name: "James K.", text: "Replaced my second cup of coffee. No crash at 2pm anymore.", stars: 5 },
                { name: "Emily R.", text: "Taste is amazing and I actually feel focused for my deep work sessions.", stars: 5 },
            ].map((review, i) => (
                <div key={i} className="bg-gray-50 p-5 rounded-2xl">
                    <div className="flex text-[#FF3300] mb-2">
                        {[...Array(review.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-3">"{review.text}"</p>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">- {review.name}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Product Section */}
      <ProductPurchase />

      {/* Simplified FAQ */}
      <div className="px-4 py-12 bg-gray-50">
        <h3 className="font-bold text-xl mb-6 text-center">Common Questions</h3>
        <div className="space-y-4">
            <details className="bg-white p-4 rounded-xl border border-gray-200 group">
                <summary className="font-bold text-sm cursor-pointer list-none flex justify-between items-center">
                    How fast does it work?
                    <span className="text-[#FF3300] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">Most people feel the effects within 30-45 minutes of taking 2 gummies. The effects typically last for 4-6 hours.</p>
            </details>
            <details className="bg-white p-4 rounded-xl border border-gray-200 group">
                <summary className="font-bold text-sm cursor-pointer list-none flex justify-between items-center">
                    Is there caffeine?
                    <span className="text-[#FF3300] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">Yes, a small amount (50mg) from green tea - about half a cup of coffee. It's balanced with L-Theanine to prevent jitters.</p>
            </details>
            <details className="bg-white p-4 rounded-xl border border-gray-200 group">
                <summary className="font-bold text-sm cursor-pointer list-none flex justify-between items-center">
                    What if I don't like it?
                    <span className="text-[#FF3300] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">We offer a 30-day money-back guarantee. If you're not satisfied, just email us and we'll refund your order, no questions asked.</p>
            </details>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-xs text-gray-400 border-t border-gray-100">
        <p>© 2024 Soluna. All rights reserved.</p>
      </footer>

    </main>
  );
}
