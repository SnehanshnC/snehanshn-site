import { contact, identity } from "@/content";

const links = [contact.github, contact.linkedin, contact.x, contact.email];

export default function Footer() {
  return (
    <footer className="border-t border-trace/50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
        <ul className="-ml-2 flex flex-wrap gap-x-2 gap-y-1">
          {links.map((link) => (
            <li key={link.label}>
              {/* TODO(snehanshn): real contact URLs live in content.ts */}
              <a
                href={link.href}
                className="inline-block min-h-11 content-center px-2 py-2 font-mono text-xs text-noise transition-colors duration-150 hover:text-signal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-noise/60">
          © {new Date().getFullYear()} {identity.name} ·{" "}
          <span title="open the terminal">press / </span>
        </p>
      </div>
    </footer>
  );
}
