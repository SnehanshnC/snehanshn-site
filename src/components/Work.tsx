import { projects } from "@/content";
import Section from "./Section";

export default function Work() {
  return (
    <Section id="work" index="01" title="Selected Work">
      {/*
       * Each row owns its top hairline (the row below supplies the bottom one),
       * so a hovered row can warm both of its hairlines to signal/30 - the row
       * lights the way a route lights during a pulse.
       */}
      <ul>
        {projects.map((project, i) => (
          <li
            key={project.slug}
            className="border-t border-trace/50 transition-colors duration-150 last:border-b hover:border-signal/30 [&:hover+li]:border-t-signal/30"
          >
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-x-8 gap-y-3 py-8 md:grid-cols-[3fr_4fr_auto] md:py-9"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  {/* Unpadded (vs the kicker's "01") so the two numbering
                      systems don't read as one; noise/60 would fail AA. */}
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-noise"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-glow transition-colors duration-150 group-hover:text-signal">
                    {project.name}
                  </h3>
                </div>
                <p className="mt-1.5 text-sm text-noise md:pl-8">
                  {project.tagline}
                </p>
                {project.awards.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2 md:pl-8">
                    {project.awards.map((award) => (
                      <li
                        key={award.badge}
                        className="rounded-full border border-signal/35 px-2.5 py-1 font-mono text-[11px] leading-none text-signal"
                        title={award.full}
                      >
                        {award.badge}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="text-[15px] leading-relaxed text-noise md:mt-[3px]">
                <p>{project.description}</p>
                {project.role && (
                  <p className="mt-2 font-mono text-xs text-noise">
                    {project.role}
                  </p>
                )}
              </div>
              <span className="self-start font-mono text-xs text-noise transition-colors duration-150 group-hover:text-signal">
                {project.link.label} ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
