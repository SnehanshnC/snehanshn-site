import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import OffHours from "@/components/OffHours";
import Operator from "@/components/Operator";
import Positions from "@/components/Positions";
import Tape from "@/components/Tape";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <>
      <Tape />
      {/* The surface: every module sits inside a visible hairline frame. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col border-x border-grid/50">
        <main className="flex-1">
          <Hero />
          <Positions />
          <Operator />
          <OffHours />
        </main>
        <Footer />
      </div>
      <Terminal />
    </>
  );
}
