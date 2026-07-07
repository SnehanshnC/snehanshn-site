import { experience, identity, otherWins } from "@/content";
import Section from "./Section";

export default function About() {
  return (
    <Section id="about" index="02" title="About">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[5fr_7fr]">
        <div>
          <p className="max-w-prose text-[17px] leading-relaxed text-glow">
            {identity.bio}
          </p>
          <p className="mt-5 font-mono text-xs leading-relaxed text-noise">
            {identity.education}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.18em] text-noise uppercase">
            Experience
          </h3>
          <ul className="mt-6 divide-y divide-trace/50">
            {experience.map((job) => (
              <li key={job.company} className="py-6 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-display text-lg font-semibold text-glow">
                    {job.company}
                  </p>
                  <p className="font-mono text-xs text-noise">{job.period}</p>
                </div>
                <p className="mt-1 text-sm text-noise">{job.role}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-noise">
                  {job.summary}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* A footnote for the whole section, not the left column. */}
      <p className="mt-12 text-sm leading-relaxed text-noise">{otherWins}</p>
    </Section>
  );
}
