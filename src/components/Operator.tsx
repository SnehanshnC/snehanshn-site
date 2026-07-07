import { experience, identity, otherWins } from "@/content";
import ModuleHeader from "./ModuleHeader";

/*
 * 02 / OPERATOR - who is running the desk.
 * Bio + education on the left rail; experience as a session-history table
 * on the right; other wins as a FILLS line across the bottom.
 */
export default function Operator() {
  return (
    <section id="operator">
      <ModuleHeader
        index="02"
        title="Operator"
        readout={`SESSIONS: ${experience.length}`}
      />
      <div className="grid gap-y-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="px-4 pt-6 sm:px-6 md:border-r md:border-trace/40 md:px-8 md:py-8">
          <p className="max-w-prose text-[15px] leading-relaxed text-glow md:text-base">
            {identity.bio}
          </p>
          <p className="mt-5 font-mono text-[11px] tracking-[0.08em] text-noise uppercase">
            {identity.education}
          </p>
        </div>

        <ul className="md:py-2">
          {experience.map((job) => (
            <li
              key={job.company}
              className="border-t border-trace/50 px-4 py-5 first:border-t-0 sm:px-6 md:px-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="signage text-base text-glow uppercase">
                  {job.company}
                </h3>
                <p className="font-mono text-[11px] tracking-[0.08em] text-noise uppercase tabular-nums">
                  {job.period}
                </p>
              </div>
              <p className="mt-1 font-mono text-xs text-noise">{job.role}</p>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-noise">
                {job.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* The rest of the fills, one line across the module. */}
      <p className="border-t border-trace/40 px-4 py-4 font-mono text-xs leading-relaxed text-noise sm:px-6 md:px-8">
        <span aria-hidden="true" className="text-signal">
          FILLS{" "}
        </span>
        {otherWins}
      </p>
    </section>
  );
}
