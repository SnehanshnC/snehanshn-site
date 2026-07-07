"use client";

import { useEffect, useState } from "react";
import { tape, type TapeInstrument } from "@/content";

/*
 * The tape: a thin persistent ticker streaming his real metrics as
 * instruments. Values walk around the true figures via a seeded
 * deterministic PRNG (no Math.random in render paths - the server render
 * and first client render both show the base values). The marquee is CSS
 * (.tape-track); both the scroll and the ticks stop under reduced motion.
 */

const TICK_MS = 2100;
const SEED = 0x5eed1;

/** mulberry32 - tiny deterministic PRNG. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Quote = { value: number; dir: 1 | -1 | 0 };

function format(inst: TapeInstrument, value: number): string {
  return `${inst.prefix ?? ""}${value.toFixed(inst.decimals ?? 0)}${inst.suffix ?? ""}`;
}

function InstrumentList({ quotes, hidden }: { quotes: Quote[]; hidden?: boolean }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {tape.map((inst, i) => {
        const q = quotes[i];
        const ticks = inst.base !== undefined && (inst.vol ?? 0) > 0;
        return (
          <span
            key={inst.symbol}
            className="flex items-baseline gap-2 border-r border-trace/60 px-5 whitespace-nowrap"
          >
            <span className="text-noise">{inst.symbol}</span>
            <span className="text-glow tabular-nums">
              {inst.text ?? format(inst, q.value)}
            </span>
            {ticks && (
              <span
                aria-hidden="true"
                className={q.dir === -1 ? "text-down" : "text-signal"}
              >
                {q.dir === -1 ? "▼" : "▲"}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function Tape() {
  const [quotes, setQuotes] = useState<Quote[]>(() =>
    tape.map((inst) => ({ value: inst.base ?? 0, dir: 0 }))
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rand = mulberry32(SEED);
    const id = window.setInterval(() => {
      setQuotes((prev) =>
        tape.map((inst, i) => {
          const vol = inst.vol ?? 0;
          if (inst.base === undefined || vol === 0) return prev[i];
          const next = inst.base * (1 + vol * (2 * rand() - 1));
          // Quantize before comparing so the arrow matches what's displayed.
          const scale = 10 ** (inst.decimals ?? 0);
          const q = Math.round(next * scale);
          const p = Math.round(prev[i].value * scale);
          return { value: next, dir: q === p ? prev[i].dir : q > p ? 1 : -1 };
        })
      );
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-label="Live metrics tape"
      className="sticky top-0 z-40 overflow-hidden border-b border-grid/70 bg-void/90 py-2 font-mono text-[11px] leading-none tracking-wide backdrop-blur-sm"
    >
      <div className="tape-track flex w-max">
        <InstrumentList quotes={quotes} />
        <InstrumentList quotes={quotes} hidden />
      </div>
    </div>
  );
}
