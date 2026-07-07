import type { Metadata } from "next";
import { identity, offTheClock, wins } from "@/content";
import Sparkline from "@/components/Sparkline";

export const metadata: Metadata = {
  title: "Fun - Snehanshn Chowdhury",
  description:
    "Hackathon wins, photos, and what Snehanshn is up to off the clock.",
  alternates: { canonical: "/fun" },
  openGraph: {
    title: "Fun - Snehanshn Chowdhury",
    description:
      "Hackathon wins, photos, and what Snehanshn is up to off the clock.",
    url: "/fun",
    siteName: "Snehanshn Chowdhury",
    type: "website",
    // The root segment's opengraph-image.png does not cascade past a page
    // that declares its own openGraph object, so point at it explicitly.
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

/*
 * The personality page: the trophy wall as a designed collection, the
 * photo dump (placeholder slots until content.ts gets real photos), and
 * the currently strip with the one market whisper (a tiny sparkline).
 */
export default function Fun() {
  const s = identity.funStatement;
  const photos = offTheClock.photoSlots;
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="py-16 sm:py-20 lg:py-24">
        <h1 className="statement rise-move max-w-3xl text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.14] text-balance">
          {s.pre}
          <em className="text-signal">{s.emphasis}</em>
          {s.post}
        </h1>
      </section>

      {/* The wall: every win as a tile - placement set display-size. */}
      <section aria-labelledby="wins-heading" className="pb-16 sm:pb-20">
        <h2
          id="wins-heading"
          className="mb-6 font-mono text-[12px] font-medium tracking-[0.14em] text-faint uppercase"
        >
          The wall
        </h2>
        <ul className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {wins.map((w) => (
            <li
              key={`${w.detail}-${w.year}`}
              className="flex min-h-40 flex-col justify-between gap-6 bg-paper p-4 sm:p-5"
            >
              <p className="statement break-words text-[clamp(1.6rem,3vw,2.2rem)] leading-none">
                {w.placement}
              </p>
              <div>
                <p className="font-mono text-[12px] leading-relaxed font-medium tracking-[0.04em] uppercase">
                  {w.detail}
                </p>
                <p className="mt-0.5 font-mono text-[12px] tracking-[0.04em] text-faint">
                  {w.context} · {w.year}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* The photo dump: designed placeholders until real photos land. */}
      <section aria-labelledby="photos-heading" className="pb-16 sm:pb-20">
        <h2
          id="photos-heading"
          className="mb-6 font-mono text-[12px] font-medium tracking-[0.14em] text-faint uppercase"
        >
          Photo dump
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {photos.map((photo, i) =>
            photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.alt}
                src={photo.src}
                alt={photo.alt}
                className="aspect-square w-full border border-line object-cover"
              />
            ) : (
              <div
                key={photo.alt}
                aria-hidden="true"
                className="flex aspect-square w-full items-end border border-line bg-wash p-3"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                  soon · {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            )
          )}
        </div>
      </section>

      {/* Currently: one line, one whisper of the old tape. */}
      <section className="pb-20 sm:pb-24">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-6 font-mono text-[13px] tracking-[0.04em] text-faint">
          <span className="font-medium text-ink uppercase">Currently</span>
          <Sparkline className="text-faint" />
          <span>{offTheClock.currently}</span>
        </p>
      </section>
    </main>
  );
}
