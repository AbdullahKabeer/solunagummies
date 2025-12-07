import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ingredients from "@/components/Ingredients";
import Science from "@/components/Science";
import ProductShowcase from "@/components/ProductShowcase";
import ComparisonSection from "@/components/ComparisonSection";
import ProductPurchase from "@/components/ProductPurchase";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import FlowingBackground from "@/components/FlowingBackground";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent selection:bg-orange-200 selection:text-orange-900 relative">
      <FlowingBackground />
      <StickyMobileCTA />
      <div className="relative z-10">
        <Header />
        <Hero />
        
        <div className="flex flex-col w-full">
          <ProductShowcase />
          
          <Timeline />
          
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
