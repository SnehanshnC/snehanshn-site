import { journeyRungC } from "@/content";
import { meta } from "./meta";

/*
 * RUNG C - AI-BLAND: the soulless SaaS template (docs/adr/rung-c-ai-bland.md).
 *
 * STUB DRESS - a plain rendering of the rung's copy so the scaffold's
 * dwell is visible. The rung C task replaces this file's internals with
 * the real dress: purple->blue gradient hero, Inter-alike type, pill
 * buttons ([Get in touch] = real mailto, [Learn more] = user-initiated
 * smooth-scroll into the C->D seam), three emoji cards that stack at 390px.
 *
 * Contract: visuals here; the B->C beat list in ./seam.ts (including this
 * rung's rail re-dress via SeamContext.rail); scroll spans in ./meta.ts;
 * copy in the journeyRungC block in src/content.ts. Heading level note:
 * the document h1 is rung E.0's statement (ADR 0002 "SEO") - keep this
 * layer's hero a paragraph or a lower-level heading.
 */
export default function RungCDress() {
  return (
    <div className="grid h-full place-content-center gap-4 bg-[#f4f2fd] p-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
        rung {meta.id.toUpperCase()} · {meta.name} · stub dress
      </p>
      <p className="text-2xl font-medium">{journeyRungC.hero}</p>
      <p className="font-mono text-sm text-faint">
        [ {journeyRungC.ctas.getInTouch} ]  [ {journeyRungC.ctas.learnMore} ]
      </p>
      <ul className="flex flex-wrap justify-center gap-3">
        {journeyRungC.cards.map((card) => (
          <li key={card.title} className="rounded border border-line px-4 py-3">
            <span aria-hidden="true">{card.emoji}</span> {card.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
