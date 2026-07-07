import { Fragment } from "react";
import { identity } from "@/content";
import MarketFlow from "./MarketFlow";

/**
 * The kicker's facts as wrap units ("Rutgers CS + Math ·", "Founding
 * engineer", "@ NovaFlow (YC S25)") so narrow viewports break on the
 * separators instead of mid-phrase.
 */
const kickerUnits = identity.kicker.split(" · ").flatMap((part, i, arr) => {
  const pieces = part.split(/ (?=@)/);
  if (i < arr.length - 1) pieces[pieces.length - 1] += " ·";
  return pieces;
});

export default function Hero() {
  return (
    // Content biased below center so the empty half of the viewport sits
    // above the headline, where the canvas is busiest - not below the fold.
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      <MarketFlow className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-[18svh] md:px-10">
        <p className="rise font-mono text-xs tracking-[0.18em] text-noise uppercase [animation-delay:150ms]">
          {kickerUnits.map((unit) => (
            <Fragment key={unit}>
              <span className="inline-block">{unit}</span>{" "}
            </Fragment>
          ))}
        </p>

        <h1 className="rise-move mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-glow sm:text-6xl md:text-7xl lg:text-8xl">
          Snehanshn
          <br />
          Chowdhury
        </h1>

        <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-noise md:text-xl [animation-delay:500ms]">
          {identity.heroLine}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-5xl px-6 pb-4 md:px-10">
          <a
            href="#work"
            className="rise inline-flex min-h-11 items-center gap-3 font-mono text-xs tracking-[0.18em] text-noise uppercase transition-colors duration-150 hover:text-signal [animation-delay:900ms]"
          >
            <span aria-hidden="true" className="text-signal">
              ▾
            </span>
            scroll
          </a>
        </div>
      </div>
    </section>
  );
}
