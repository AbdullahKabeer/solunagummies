export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-16 border-t border-black/10 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Soluna</h2>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Advanced cognitive support for the modern world. Designed to help you think clearly and work better, every day.
            </p>
          </div>
          
          <div>
            <h3 className="font-mono text-xs text-gray-500 mb-6 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-4 font-medium text-sm">
              <li><a href="#science" className="hover:text-[#FF3300] transition-colors">How It Works</a></li>
              <li><a href="#ingredients" className="hover:text-[#FF3300] transition-colors">Ingredients</a></li>
              <li><a href="#purchase" className="hover:text-[#FF3300] transition-colors">Shop</a></li>
              <li><a href="#faq" className="hover:text-[#FF3300] transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs text-gray-500 mb-6 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end text-xs text-gray-500">
          <div className="max-w-xl mb-8 md:mb-0 leading-relaxed">
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </div>
          <div className="text-right">
            <div>© {new Date().getFullYear()} Soluna</div>
            <div>All Rights Reserved</div>
          </div>
        </div>

      </div>
    </footer>
  );
}
