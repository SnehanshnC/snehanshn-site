import { identity } from "@/content";
import OrderFlow from "./OrderFlow";
import SessionClock from "./SessionClock";
import TerminalHint from "./TerminalHint";

/*
 * The hero: the name set enormous - trading-floor signage - over the
 * order-flow surface. The h1 is the LCP element and is server-rendered;
 * the canvas and clock hydrate in behind it after paint.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-1.9rem)] flex-col overflow-hidden">
      <OrderFlow className="absolute inset-0 h-full w-full" />

      {/* Top data row: kicker left, session state right. */}
      <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 pt-5 font-mono text-[11px] tracking-[0.14em] uppercase sm:px-6 md:px-8">
        <p className="text-noise">{identity.kicker}</p>
        <p className="flex items-baseline gap-2 text-noise">
          <span aria-hidden="true" className="live-dot text-signal">
            ●
          </span>
          LIVE · <SessionClock />
        </p>
      </div>

      {/* The instrument itself. */}
      {/* Nudged up on small screens so the copy sits above the depth band
          and the sparse strip under the tape shrinks. */}
      <div className="relative z-10 flex flex-1 flex-col justify-center pb-[10svh] px-3 sm:px-5 md:px-7 md:pb-0">
        <h1 className="rise-move signage text-[clamp(2.2rem,10.4vw,10.2rem)] leading-[0.92] tracking-tight text-glow uppercase">
          Snehanshn
          <br />
          Chowdhury
        </h1>
        <p className="rise mt-6 max-w-2xl px-1 text-base leading-relaxed text-noise sm:text-lg md:text-xl [animation-delay:300ms]">
          {identity.heroLine}
        </p>
      </div>

      {/* Bottom status row. */}
      <div className="relative z-10 flex items-center justify-between px-4 pb-4 font-mono text-[11px] tracking-[0.14em] uppercase sm:px-6 md:px-8">
        <a
          href="#positions"
          className="rise inline-flex min-h-11 items-center gap-2 text-noise transition-colors duration-150 hover:text-signal [animation-delay:600ms]"
        >
          <span aria-hidden="true" className="text-signal">
            ▾
          </span>
          the book
        </a>
        <span className="rise hidden sm:block [animation-delay:600ms]">
          <TerminalHint label="press / for the terminal" />
        </span>
      </div>
    </section>
  );
}
