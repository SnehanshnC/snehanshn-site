"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { identity } from "@/content";

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/fun", label: "Fun" },
  { href: "/about", label: "About" },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
      >
        <Link
          href="/"
          className="group flex min-h-11 items-baseline gap-3"
          data-cursor={identity.latencyJoke}
        >
          <span className="font-mono text-[13px] font-medium tracking-[0.08em] uppercase">
            Snehanshn Chowdhury
          </span>
          <span className="hidden font-mono text-[13px] tracking-[0.08em] text-faint uppercase sm:inline">
            {identity.navRole}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center px-2.5 font-mono text-[13px] tracking-[0.08em] uppercase transition-colors duration-150 sm:px-3 ${
                  active ? "text-signal" : "text-faint hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            aria-label="Open terminal"
            data-cursor="press /"
            onClick={() => window.dispatchEvent(new Event("terminal:open"))}
            className="ml-1 flex min-h-11 min-w-11 items-center justify-center border border-line px-3 font-mono text-[13px] text-faint transition-colors duration-150 hover:border-ink hover:text-ink"
          >
            {">_"}
          </button>
        </div>
      </nav>
    </header>
  );
}
