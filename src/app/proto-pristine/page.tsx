import Link from "next/link";

/*
 * TEMPORARY PROTOTYPE ROUTE - index for the D->E detonation seam identity
 * prototype (docs/adr/rung-e-pristine.md "Decided: identity chosen by
 * prototype"). Two candidates, same content and choreography - only the
 * identity differs. Deleted once rung E adopts the winner.
 */
export const metadata = { title: "pristine proto · pick the identity" };

const VARIANTS = [
  {
    href: "/proto-pristine/night",
    name: "night-desk",
    blurb:
      "Near-black void, warm text, bright amber accents - the terminal's palette promoted to the whole finale.",
  },
  {
    href: "/proto-pristine/paper",
    name: "evolved paper",
    blurb:
      "Warm ivory, ink, amber moments - the current identity pushed much further with real motion.",
  },
] as const;

export default function ProtoPristineIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
        temporary prototype · not linked from the site · noindex
      </p>
      {/* Emphasis word must spell from the italic subset's glyphs
          (` -06abiklntw`) or it falls back to Georgia italic - "ink" does. */}
      <h1 className="statement mt-4 text-[clamp(1.9rem,4.5vw,2.8rem)] leading-[1.15]">
        One detonation, two coats of <em className="text-signal">ink</em>.
      </h1>
      <p className="mt-4 max-w-[52ch] text-faint">
        Same content, same three acts (color, voice, life) - only the identity
        differs. Scroll each one, then pick the resurrection that hits harder
        (docs/adr/rung-e-pristine.md).
      </p>

      <ul className="mt-12 grid gap-4">
        {VARIANTS.map((v, i) => (
          <li key={v.href}>
            <Link
              href={v.href}
              className="group block border border-line p-6 transition-colors hover:border-signal focus-visible:border-signal"
            >
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-faint">
                variant {i + 1}
              </span>
              <span className="mt-1 block text-xl font-medium group-hover:text-signal">
                {v.name}
              </span>
              <span className="mt-2 block max-w-[56ch] text-sm text-faint">
                {v.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
