import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OffTheClock from "@/components/OffTheClock";
import Terminal from "@/components/Terminal";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Work />
        <About />
        <OffTheClock />
      </main>
      <Footer />
      <Terminal />
    </>
  );
}
