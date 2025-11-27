import Hero3DProduct from './Hero3DProduct';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent">
      
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-3/5 [perspective:2000px]">
            <div className="lg:transform-[rotateY(15deg)] lg:origin-center lg:[transform-style:preserve-3d]">
              <div
                className="flex items-center gap-4 mb-12 animate-fade-in-up"
              >
                <div className="h-[1px] w-12 bg-orange-600"></div>
                <span className="text-xs font-bold tracking-[0.3em] text-orange-900 uppercase">Est. 2024</span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-8xl leading-[1.1] text-[#1a1a1a] mb-8 md:mb-12 tracking-tight">
                <div
                  className="py-2 animate-fade-in-up"
                >
                  Reclaim your
                </div>
                <div
                  className="italic text-orange-600 ml-8 md:ml-24 pr-4 py-2 animate-fade-in-up delay-100"
                >
                  cognitive
                </div>
                <div
                  className="py-2 animate-fade-in-up delay-200"
                >
                  architecture.
                </div>
              </h1>

              <div className="flex flex-col md:flex-row items-start gap-8 md:gap-24 ml-2 md:ml-4">
                <p 
                  className="text-lg md:text-xl text-gray-600 max-w-md leading-relaxed font-light animate-fade-in-up delay-300"
                >
                  A daily ritual for deep work. <br/>
                  Formulated with <span className="text-orange-600 font-medium">Cognizin®</span> and <span className="text-orange-600 font-medium">Saffron</span> to silence the noise and amplify your signal.
                </p>

                <div 
                  className="relative group hidden md:block animate-fade-in-up delay-400"
                >
                  <a 
                    href="#purchase" 
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase transition-transform duration-500 group-hover:scale-110"
                  >
                    Shop
                  </a>
                  <div className="absolute inset-0 rounded-full border border-[#1a1a1a] scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                </div>
                
                {/* Mobile Shop Button */}
                <div 
                  className="md:hidden w-full animate-fade-in-up delay-400"
                >
                  <a 
                    href="#purchase" 
                    className="flex items-center justify-center w-full py-4 rounded-full bg-[#1a1a1a] text-white text-sm font-bold tracking-widest uppercase"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Product Mockup */}
          <div className="w-full lg:w-2/5 relative flex justify-center lg:justify-end [perspective:1000px] mt-12 lg:mt-0">
            <Hero3DProduct />
          </div>
        </div>
      </div>
      
      {/* Scroll Line */}
      <div 
        className="absolute bottom-0 left-12 w-[1px] bg-gray-300 hidden md:block animate-grow-height delay-1000"
      ></div>
    </section>
  );
}
