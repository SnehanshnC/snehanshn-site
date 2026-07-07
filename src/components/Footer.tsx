import { contact, identity } from "@/content";
import TerminalHint from "./TerminalHint";

/* Links still awaiting a real URL (`#todo` in content.ts) are not rendered. */
const links = [contact.github, contact.linkedin, contact.x, contact.email].filter(
  (link) => link.href !== "#todo"
);

/*
 * The footer as the surface's status bar: links left, session line right,
 * in the same data voice as the tape and module headers.
 */
export default function Footer() {
  return (
    <footer className="border-t border-grid/70 bg-surface/40">
      <div className="flex flex-col gap-x-6 gap-y-2 px-4 py-3 font-mono text-[11px] tracking-[0.14em] uppercase sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <ul className="-ml-2 flex flex-wrap gap-x-1">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-block min-h-11 content-center px-2 text-noise transition-colors duration-150 hover:text-signal"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap items-center gap-x-2 text-noise">
          <span>SESSION © 2026 {identity.name}</span>
          <span aria-hidden="true">·</span>
          <TerminalHint />
        </p>
      </div>
    </footer>
  );
}
