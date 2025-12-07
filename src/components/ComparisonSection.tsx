import { Zap, Coffee, Battery } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-32 bg-[#FDFCF8] relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">A smoother alternative to caffeine-heavy drinks.</h2>
          </div>

          <div className="grid grid-cols-4 gap-4 md:gap-8 border-t-2 border-gray-900 pt-8">
            {/* Headers */}
            <div className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">Feature</div>
            <div className="font-bold text-orange-600 text-sm md:text-base flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Focus Gummies
            </div>
            <div className="font-bold text-gray-400 text-sm md:text-base flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Coffee
            </div>
            <div className="font-bold text-gray-400 text-sm md:text-base flex items-center gap-2">
              <Battery className="w-4 h-4" />
              Energy Drinks
            </div>

            {/* Row 1 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">Natural Caffeine</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">✔</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✔</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>

            {/* Row 2 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">Users report smooth, steady energy*</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">✔</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>

            {/* Row 3 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">No jitters reported*</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">✔</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>

            {/* Row 4 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">No crash reported*</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">✔</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">✘</div>

            {/* Row 5 */}
            <div className="py-4 border-b border-gray-100 text-sm font-medium text-gray-700">Easy on stomach</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-900 font-bold">✔</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">Varies</div>
            <div className="py-4 border-b border-gray-100 text-sm text-gray-500">Varies</div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400 text-center">
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-lg font-serif italic text-gray-600 mb-8">
              Soluna isn't an upgrade. It's a whole different category.
            </p>
            <a 
              href="#purchase" 
              className="inline-block bg-[#FF4D00] text-white px-10 py-4 rounded-full font-bold hover:bg-[#ff6a2b] transition-all shadow-lg shadow-orange-500/20"
            >
              Make The Switch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}