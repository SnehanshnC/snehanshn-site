import { journeyRungD } from "@/content";
import { meta } from "./meta";

/*
 * RUNG D - SAFE: genuinely well-made, grayscale, static (docs/adr/rung-d-safe.md).
 *
 * STUB DRESS - a plain rendering of the rung's copy so the scaffold's
 * dwell is visible. The rung D task replaces this file's internals with
 * the real dress: ~#fafafa / ~#111 Swiss grid, Inter-class display scale
 * (clamped so 390px never overflows), tiny uppercase mono meta labels.
 * Strictly grayscale and completely static - D banks color and motion so
 * the D->E detonation can spend them.
 *
 * Contract: visuals here; the C->D beat list in ./seam.ts (including this
 * rung's rail re-dress via SeamContext.rail); scroll spans in ./meta.ts;
 * copy in the journeyRungD block in src/content.ts. Heading level note:
 * the document h1 is rung E.0's statement (ADR 0002 "SEO") - keep this
 * layer's name block a paragraph or a lower-level heading.
 */
export default function RungDDress() {
  return (
    <div className="grid h-full place-content-center gap-4 bg-[#fafafa] p-6 text-center text-[#111]">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#666]">
        rung {meta.id.toUpperCase()} · {meta.name} · stub dress
      </p>
      <p className="text-3xl font-semibold tracking-tight">
        {journeyRungD.name.join(" ")}
      </p>
      {journeyRungD.role.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#666]">
        {journeyRungD.meta.index} · {journeyRungD.meta.location} ·{" "}
        {journeyRungD.meta.year}
      </p>
    </div>
  );
}
