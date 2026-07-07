import type { Project } from "@/content";
import Cover from "./Cover";

/** What the cursor pill says over this card, from the link's kind. */
function cursorLabel(label: string): string {
  const l = label.toLowerCase();
  if (l === "live site") return "live ↗";
  return `${l} ↗`;
}

/*
 * One position in the work grid: designed abstract cover, title line,
 * mono metadata line. Awards ride inline as a small flare tag - unless
 * the metric already IS the placement (`fromAward`), which would say it
 * twice.
 */
export default function WorkCard({ project }: { project: Project }) {
  const p = project;
  const award = p.metric.fromAward ? undefined : p.awards[0];
  return (
    <a
      href={p.link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor={cursorLabel(p.link.label)}
      className="work-card group block"
    >
      <div className="overflow-hidden border border-line">
        {/* TODO(snehanshn): real screenshot - add coverSrc in content.ts and swap it in here. */}
        <Cover
          hue={p.cover.hue}
          motif={p.cover.motif}
          className="block aspect-[3/2] w-full"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {/*
          The link's accessible name comes from its content (an aria-label
          can never contain ALL the visible text - axe's
          label-content-name-mismatch counts the ticker/metric line too, so
          voice-control users could not say what they see). Only the link
          kind rides along visually hidden.
        */}
        <h3 className="text-[17px] font-medium">
          {p.name}
          <span className="text-faint"> · {p.tagline}</span>
          <span className="sr-only"> ({p.link.label})</span>
        </h3>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] tracking-[0.04em] text-faint tabular-nums">
        {/*
          Ticker and metric share one flex item so a long metric wraps
          inside its own text instead of dropping the whole metric below a
          lone ticker (the ml-3 stands in for the row's gap-x-3).
        */}
        <span>
          <span className="uppercase">{p.ticker}</span>
          <span className="ml-3">
            {p.metric.value} {p.metric.label}
          </span>
        </span>
        {award && (
          <span className="bg-flare px-1.5 py-0.5 text-[11px] font-medium text-ink">
            {award.badge}
          </span>
        )}
      </p>
    </a>
  );
}
