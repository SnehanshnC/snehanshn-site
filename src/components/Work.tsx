import { projects } from "@/content";
import Section from "./Section";

export default function Work() {
  return (
    <Section id="work" index="01" title="Selected Work">
      <ul className="divide-y divide-trace/50 border-y border-trace/50">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-x-8 gap-y-3 py-8 transition-colors duration-150 md:grid-cols-[3fr_4fr_auto] md:py-9"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-noise/70"
                  >
                    {String(i + 1).padStart(2, "0")}
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
              <div className="text-[15px] leading-relaxed text-noise">
                <p>{project.description}</p>
                {project.role && (
                  <p className="mt-2 font-mono text-xs text-noise/70">
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
