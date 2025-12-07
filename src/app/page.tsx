import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ingredients from "@/components/Ingredients";
import Science from "@/components/Science";
import ProductShowcase from "@/components/ProductShowcase";
import ComparisonSection from "@/components/ComparisonSection";
import ProductPurchase from "@/components/ProductPurchase";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import TimelineSection from "@/components/TimelineSection";
import FAQ from "@/components/FAQ";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-[#FF3300] selection:text-white relative">
      <StickyMobileCTA />
      <div className="relative z-10">
        <Header />
        <Hero />
        
        <div className="flex flex-col w-full">
          <ProductShowcase />
          
          <TimelineSection />
          
          <ComparisonSection /> 
          
          <Ingredients />
          
          <Science />

          <Marquee />

          <ProductPurchase />

          <FAQ />
        </div>

        <Footer />
      </div>
    </main>
  );
}
