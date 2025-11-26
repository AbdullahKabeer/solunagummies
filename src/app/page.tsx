import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
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

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent selection:bg-orange-200 selection:text-orange-900 relative">
      <FlowingBackground />
      <div className="relative z-10">
        <Header />
        <Hero />
        
        <div className="flex flex-col w-full">
          <Marquee />
          
          {/* <ComparisonSection /> */}
          
          <ProductShowcase />
          
          <Timeline />
          
          <Benefits />
          
          <Ingredients />
          
          <Science />

          <ProductPurchase />

          <FAQ />
        </div>

        <Footer />
      </div>
    </main>
  );
}
