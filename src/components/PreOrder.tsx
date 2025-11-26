export default function PreOrder() {
  return (
    <section id="pre-order" className="py-32 bg-primary text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">Ready to Unlock Your Potential?</h2>
        <p className="text-2xl mb-16 max-w-2xl mx-auto opacity-90 font-light">
          Be the first to experience Soluna. Limited first batch available.
        </p>
        <div className="bg-white p-10 rounded-4xl max-w-lg mx-auto text-gray-900 shadow-2xl">
          <h3 className="text-3xl font-serif font-bold mb-8">Pre-order Soluna</h3>
          <div className="space-y-5">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg transition-all"
            />
            <button className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-light transition-all transform hover:scale-[1.02] text-lg shadow-lg shadow-primary/20">
              Reserve My Spot
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500">No payment required today. We'll notify you when we launch.</p>
        </div>
      </div>
    </section>
  );
}
