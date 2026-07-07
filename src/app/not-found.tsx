import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Snehanshn Chowdhury",
};

/*
 * The dead-link page, in the site's own voice: paper, one statement with a
 * single italic emphasis word, a mono sub-line, a way home. The emphasis
 * word must be spellable from the italic subset's glyphs (` -06abiklntw`,
 * see the LCP contract in layout.tsx) - "blank" is; a missing glyph would
 * silently fall back to Georgia italic.
 */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="py-16 sm:py-20 lg:py-24">
        <h1 className="statement rise-move max-w-3xl text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.14] text-balance">
          This page came back <em className="text-signal">blank</em>.
        </h1>
        <p className="rise mt-6 font-mono text-[13px] tracking-[0.06em] text-faint">
          404 · nothing lives at this address
        </p>
        <p className="rise mt-12">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] tracking-[0.08em] text-signal uppercase transition-colors duration-150 hover:text-ink"
          >
            Back to the work
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>
    </main>
  );
}
