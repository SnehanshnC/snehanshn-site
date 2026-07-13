import { journeyRungB } from "@/content";
import { meta } from "./meta";

/*
 * RUNG B - KITSCH: effort without taste (docs/adr/rung-b-kitsch.md).
 *
 * STUB DRESS - a plain rendering of the rung's copy so the scaffold's
 * dwell is visible. The rung B task replaces this file's internals with
 * the real dress: marquee headline (STATIC under reduced motion), centered
 * shout-stack, lime-on-magenta, silver bevel buttons with a press effect
 * but no action (aria-disabled, never a focus trap).
 *
 * Contract: visuals here; the A->B beat list in ./seam.ts (including this
 * rung's rail re-dress via SeamContext.rail); scroll spans in ./meta.ts;
 * copy in the journeyRungB block in src/content.ts. Heading level note:
 * the document h1 is rung E.0's statement (ADR 0002 "SEO") - keep this
 * layer's headline a paragraph or a lower-level heading.
 */
export default function RungBDress() {
  return (
    <div className="grid h-full place-content-center gap-4 bg-[#fdf3fb] p-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
        rung {meta.id.toUpperCase()} · {meta.name} · stub dress
      </p>
      <p className="text-2xl font-medium">{journeyRungB.headline}</p>
      {journeyRungB.body.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p className="font-mono text-sm text-faint">
        [ {journeyRungB.buttons.join(" ]  [ ")} ]
      </p>
    </div>
  );
}
