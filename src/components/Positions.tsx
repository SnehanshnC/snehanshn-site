import { projects } from "@/content";
import ModuleHeader from "./ModuleHeader";

/*
 * 01 / POSITIONS - the six projects as a book of positions.
 * Dense rows on the visible grid: ticker + index, name and precise prose,
 * and the headline number set display-size in the right rail. Awards are
 * filled amber tags; rows whose metric IS the placement don't repeat it.
 */
export default function Positions() {
  return (
    <section id="positions">
      <ModuleHeader
        index="01"
        title="Positions"
        readout={`BOOK: ${projects.length} OPEN`}
      />
      <ul>
        {projects.map((project, i) => (
          <li key={project.slug} className="border-b border-trace/60">
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-4 px-4 py-6 transition-colors duration-150 hover:bg-surface/60 sm:px-6 md:grid-cols-[6.5rem_minmax(0,1fr)_15rem] md:gap-x-8 md:px-8 md:py-7"
            >
              {/* Instrument code. */}
              <div className="font-mono text-xs leading-relaxed">
                <p aria-hidden="true" className="text-noise">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-0.5 font-medium tracking-[0.08em] text-glow transition-colors duration-150 group-hover:text-signal">
                  {project.ticker}
                </p>
              </div>

              {/* The position. */}
              <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="signage text-xl text-glow uppercase tracking-normal md:text-2xl">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs text-noise">
                    {project.tagline}
                  </p>
                </div>
                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-noise">
                  {project.description}
                </p>
                {project.role && (
                  <p className="mt-2 font-mono text-xs text-noise">
                    {project.role}
                  </p>
                )}
                {project.stats && (
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase md:hidden">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="flex gap-2 tracking-[0.08em]">
                        <dt className="text-noise">{stat.label}</dt>
                        <dd className="text-glow tabular-nums">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  {!project.metric.fromAward &&
                    project.awards.map((award) => (
                      <span
                        key={award.badge}
                        title={award.full}
                        className="bg-signal px-2 py-1 font-mono text-[11px] font-medium leading-none text-void"
                      >
                        {award.badge}
                      </span>
                    ))}
                  <span className="font-mono text-xs text-noise transition-colors duration-150 group-hover:text-signal">
                    {project.link.label} ↗
                  </span>
                </div>
              </div>

              {/* The number gets the display treatment. */}
              <div className="text-right md:border-l md:border-trace/40 md:pl-8">
                <p className="signage text-4xl leading-none text-glow tabular-nums md:text-5xl">
                  {project.metric.value}
                </p>
                <p className="mt-1.5 font-mono text-[11px] tracking-[0.08em] text-noise uppercase">
                  {project.metric.label}
                </p>
                {project.stats && (
                  <dl className="mt-4 hidden space-y-1 font-mono text-[11px] uppercase md:block">
                    {project.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex justify-end gap-2 tracking-[0.08em]"
                      >
                        <dt className="text-noise">{stat.label}</dt>
                        <dd className="text-glow tabular-nums">{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
