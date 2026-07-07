import { identity } from "@/content";
import MarketFlow from "./MarketFlow";

export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      <MarketFlow className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10">
        <p className="rise font-mono text-xs tracking-[0.18em] text-noise uppercase [animation-delay:150ms]">
          {identity.kicker}
        </p>

        <h1 className="rise mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-glow sm:text-6xl md:text-7xl lg:text-8xl [animation-delay:300ms]">
          Snehanshn
          <br />
          Chowdhury
        </h1>

        <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-noise md:text-xl [animation-delay:500ms]">
          {identity.heroLine}
        </p>
      </div>
    </section>
  );
}
