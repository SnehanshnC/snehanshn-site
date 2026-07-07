import { identity, projects } from "@/content";
import Ledger from "@/components/Ledger";
import WorkCard from "@/components/WorkCard";

export default function Home() {
  const s = identity.statement;
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* Statement hero + the experience ledger beside it. */}
      <section className="grid grid-cols-1 items-end gap-x-14 gap-y-10 py-16 sm:py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          {/* LCP element: transform-only entrance, paints immediately. */}
          <h1 className="statement rise-move text-[clamp(2.1rem,5.4vw,3.9rem)] leading-[1.12] text-balance">
            {s.pre}
            <em className="text-signal">{s.emphasis}</em>
            {s.post}
          </h1>
          <p className="mt-6 font-mono text-[13px] tracking-[0.06em] text-faint">
            {identity.kicker}
          </p>
        </div>
        <div className="rise lg:col-span-5">
          <Ledger />
        </div>
      </section>

      {/* The work grid: all six projects as designed cards. */}
      <section aria-labelledby="work-heading" className="pb-20 sm:pb-24">
        <h2
          id="work-heading"
          className="mb-6 font-mono text-[12px] font-medium tracking-[0.14em] text-faint uppercase"
        >
          Selected work
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
          {projects.map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
