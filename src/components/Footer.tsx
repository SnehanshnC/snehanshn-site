import { contact, signOff } from "@/content";
import TerminalHint from "@/journey/rungs/e/salvage/TerminalHint";

/* Links still awaiting a real URL (`#todo` in content.ts) are not rendered. */
const links = [contact.github, contact.linkedin, contact.x, contact.email].filter(
  (link) => link.href !== "#todo"
);

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 sm:px-8">
        <p className="font-mono text-[12px] tracking-[0.06em] text-faint">
          {signOff}
        </p>
        <div className="flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor={`${l.label.toLowerCase()} ↗`}
              className="flex min-h-[44px] items-center font-mono text-[12px] tracking-[0.1em] text-faint uppercase transition-colors duration-150 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <TerminalHint />
        </div>
      </div>
    </footer>
  );
}
