// import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
// import TopicsGrid from "@/components/topics-grid";
// import ObservatorySection from "@/components/observatory-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <div className="w-full h-full mx-auto">
        <HeroSection />
      </div>
      {/* <TopicsGrid /> */}
      {/* <ObservatorySection /> */}
      <Footer />
    </main>
  );
}
