import { identity, journeyRungE } from "@/content";

/*
 * RUNG E - PRISTINE: the Great Pole, the real portfolio
 * (docs/adr/rung-e-pristine.md).
 *
 * STUB DRESS - semantic skeleton only. The rung E task replaces this
 * file's internals with the real sections (sticky project showcase,
 * big-type honor roll, photo dump, the Coleman close) and wakes the
 * salvaged components (Cursor, Terminal doorways, Ledger, Sparkline).
 *
 * What must SURVIVE any rewrite here (ADR 0002 contracts):
 *   - the h1: E.0's statement is the document h1, server-rendered. Its
 *     emphasis word's glyphs must exist in the Fraunces italic subset,
 *     and the OG image renders the same statement - changing it means
 *     regenerating both (see the journeyRungE block in src/content.ts).
 *   - section ids: `who-i-am` and `hobbies` are 301 targets for the old
 *     /about and /fun routes - never rename them.
 *   - everything server-rendered and crawlable; reveals collapse to
 *     visible end states under prefers-reduced-motion.
 *
 * Contract: visuals here; the D->E detonation beat list in ./seam.ts
 * (including the rail's refined final dress via SeamContext.rail); scroll
 * spans in ./meta.ts; copy in the journeyRungE block in src/content.ts.
 */
export default function RungEDress() {
  const s = journeyRungE.statement;
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* E.0 - statement hero: the document h1. */}
      <section className="py-20 sm:py-28">
        <h1 className="statement max-w-4xl text-[clamp(2.1rem,5.4vw,3.9rem)] leading-[1.12] text-balance">
          {s.pre}
          <em className="text-signal">{s.emphasis}</em>
          {s.post}
        </h1>
        <p className="mt-6 font-mono text-[13px] tracking-[0.06em] text-faint">
          {identity.kicker}
        </p>
      </section>

      {journeyRungE.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className="border-t border-line py-20"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
            {section.kicker}
          </p>
          <h2 id={`${section.id}-title`} className="mt-2 text-2xl font-medium">
            {section.title}
          </h2>
          <p className="mt-4 text-faint">{journeyRungE.stubNote}</p>
        </section>
      ))}
    </div>
  );
}
