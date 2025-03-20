import HeroSection from "@/app/dashboard/inicio/hero-section";
import ObservatorySection from "@/app/dashboard/inicio/observatory-section";
import TopicsGrid from "@/app/dashboard/inicio/topics-grid";
import MapAnemia from "./dashboard/inicio/map-anemia";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-12">
      <div className="w-full h-full mx-auto">
        <HeroSection />
      </div>
      <div className="w-full h-full mx-auto">
        <MapAnemia />
      </div>
      <div className="w-full h-full mx-auto">
        <TopicsGrid />
      </div>
      <div className="w-full h-full mx-auto">
        <ObservatorySection />
      </div>
    </div>
  );
}
