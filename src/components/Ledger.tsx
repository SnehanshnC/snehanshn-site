import { experience } from "@/content";

/*
 * The experience ledger: compact year / company / role rows beside the
 * statement. Companies with a real URL link out; the rest wait for one
 * (TODO markers live in content.ts).
 */
export default function Ledger() {
  return (
    <ul className="w-full">
      {experience.map((e) => (
        <li
          key={e.company}
          className="grid grid-cols-[2.75rem_1.15fr_1fr] items-baseline gap-x-4 border-b border-line py-2.5 first:border-t sm:gap-x-6"
        >
          <span className="font-mono text-[12px] text-faint tabular-nums">
            {e.year}
          </span>
          <span className="min-w-0 text-[14px] font-medium">
            {e.href ? (
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="visit ↗"
                className="underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-signal"
              >
                {e.company}
              </a>
            ) : (
              e.company
            )}
          </span>
          <span className="min-w-0 text-[13px] text-faint" title={e.period}>
            {e.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
