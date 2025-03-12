import HeroSection from "@/components/hero-section";
import ObservatorySection from "@/components/observatory-section";
import TopicsGrid from "@/components/topics-grid";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pt-12">
      <div className="w-full h-full mx-auto">
        <HeroSection />
      </div>
      <div className="w-full h-full mx-auto">
        <TopicsGrid />
      </div>
      <div className="w-full h-full">
        <ObservatorySection />
      </div>
    </main>
  );
} 