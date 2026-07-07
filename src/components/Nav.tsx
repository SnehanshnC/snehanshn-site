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
        className="mx-auto flex max-w-6xl items-center justify-between gap-[16px] px-[20px] py-4 sm:px-[32px]"
      >
        <Link
          href="/"
          className="group flex min-h-[44px] items-baseline gap-[12px]"
          data-cursor={identity.latencyJoke}
        >
          <span className="font-mono text-[13px] font-medium tracking-[0.08em] uppercase">
            Snehanshn Chowdhury
          </span>
          <span className="hidden font-mono text-[13px] tracking-[0.08em] text-faint uppercase sm:inline">
            {identity.navRole}
          </span>
        </Link>

        <div className="flex items-center gap-[4px] sm:gap-[8px]">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] items-center px-[10px] font-mono text-[13px] tracking-[0.08em] uppercase transition-colors duration-150 max-[359px]:px-[6px] sm:px-[12px] ${
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
            className="ml-[4px] flex min-h-[44px] min-w-[44px] items-center justify-center border border-line px-[12px] font-mono text-[13px] text-faint transition-colors duration-150 max-[359px]:ml-0 max-[359px]:px-[8px] hover:border-ink hover:text-ink"
          >
            {">_"}
          </button>
        </div>
      </nav>
    </header>
  );
}
