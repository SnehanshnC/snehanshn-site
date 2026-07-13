"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contact, identity, journeyRungE, otherWins, projects } from "@/content";
import { subscribeJourneyProgress } from "@/journey/progress";

/*
 * The surprise beat: press `/` (or the `>_` doorway in E.0's meta row, or
 * "press /" in the endcap) and a night-desk terminal opens over the paper
 * - the one dramatic dark moment on the site, the market-desk heritage in
 * a box. Salvaged as rung E's easter egg (rung-e-pristine.md): the `/`
 * key only answers once the journey has arrived at rung E - the terminal
 * belongs to the destination, not to the costumes on the way there.
 * Fully keyboard-operable: type, Tab to complete, Enter, ArrowUp/Down for
 * history (persisted for the session), Escape or `exit` to close.
 * `goto` jumps to E's sections (the old work/fun/about routes are gone -
 * their 301s land on these anchors too).
 */

type Line = { kind: "input" | "output"; text: string };

/** The banner types itself in (punctuation-aware pacing); SR reads it once. */
const BANNER = "snehanshn.com - type help to begin";

const SECTION_IDS = journeyRungE.sections.map((s) => s.id);

const HELP = `commands:
  help              this list
  ls projects       what I've built
  open <project>    open a project's link
  goto <section>    ${SECTION_IDS.join(" / ")}
  cat awards        the trophy cabinet, quietly
  whoami            who is this guy
  sudo hire-me      escalate privileges
  clear             clear the screen
  exit              close the terminal`;

const COMMANDS = [
  "cat",
  "clear",
  "exit",
  "goto",
  "help",
  "ls",
  "open",
  "sudo",
  "whoami",
];

/** Argument completions per command, for Tab. */
const COMMAND_ARGS: Record<string, string[]> = {
  ls: ["projects"],
  open: projects.map((p) => p.slug),
  goto: SECTION_IDS,
  cat: ["awards"],
  sudo: ["hire-me"],
};

const HISTORY_KEY = "snehanshn-terminal-history";

function commonPrefix(items: string[]): string {
  let prefix = items[0] ?? "";
  for (const item of items) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/**
 * Tab completion over command names and their arguments.
 * Returns the completed input, or the list of candidates when ambiguous.
 */
function complete(
  value: string
): { value: string } | { candidates: string[] } | null {
  const endsWithSpace = /\s$/.test(value);
  const parts = value.trimStart().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return null;

  if (parts.length === 1 && !endsWithSpace) {
    const matches = COMMANDS.filter((c) => c.startsWith(parts[0]));
    if (matches.length === 0) return null;
    if (matches.length === 1) {
      const cmd = matches[0];
      return { value: cmd + (cmd in COMMAND_ARGS ? " " : "") };
    }
    const prefix = commonPrefix(matches);
    if (prefix.length > parts[0].length) return { value: prefix };
    return { candidates: matches };
  }

  const cmd = parts[0];
  const argPrefix = endsWithSpace ? "" : parts[parts.length - 1].toLowerCase();
  const candidates = (COMMAND_ARGS[cmd] ?? []).filter((c) =>
    c.startsWith(argPrefix)
  );
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return { value: `${cmd} ${candidates[0]}` };
  const prefix = commonPrefix(candidates);
  if (prefix.length > argPrefix.length) return { value: `${cmd} ${prefix}` };
  return { candidates };
}

function runCommand(raw: string): {
  output: string;
  url?: string;
  anchor?: string;
  exit?: boolean;
  clear?: boolean;
} {
  const input = raw.trim();
  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(" ").toLowerCase();

  switch (cmd) {
    case "":
      return { output: "" };
    case "help":
      return { output: HELP };
    case "ls":
      if (arg === "projects" || arg === "") {
        return {
          output: projects
            .map((p) => `${p.ticker.padEnd(6)} ${p.slug.padEnd(14)} ${p.tagline}`)
            .join("\n"),
        };
      }
      return { output: `ls: ${arg}: no such directory (try: ls projects)` };
    case "open": {
      const project = projects.find((p) => p.slug === arg);
      if (!project) {
        return {
          output: `open: ${arg || "<project>"}: not found (try: ls projects)`,
        };
      }
      return {
        output: `opening ${project.name} → ${project.link.href}`,
        url: project.link.href,
      };
    }
    case "goto": {
      const anchor = SECTION_IDS.find((id) => id === arg);
      if (!anchor) {
        return {
          output: `goto: ${arg || "<section>"}: not found (try: goto ${SECTION_IDS.join(" | ")})`,
        };
      }
      return { output: "", anchor, exit: true };
    }
    case "cat":
      if (arg === "awards") {
        const cardAwards = projects
          .flatMap((p) => p.awards.map((a) => `  ${a.full} - ${p.name}`))
          .join("\n");
        return { output: `${cardAwards}\n\n  ${otherWins}` };
      }
      return { output: `cat: ${arg || "<file>"}: no such file (try: cat awards)` };
    case "whoami":
      return {
        output: `${identity.name}\n${identity.kicker}\n${identity.heroLine}`,
      };
    case "sudo":
      if (arg === "hire-me") {
        const email =
          contact.email.href === "#todo"
            ? ""
            : `\nemail: ${contact.email.href.replace(/^mailto:/, "")}`;
        return {
          output: `[sudo] password for guest: accepted.\naccess granted: I start Mondays.${email}`,
        };
      }
      return { output: `sudo: ${arg}: not in the sudoers file` };
    case "clear":
      return { output: "", clear: true };
    case "exit":
      return { output: "", exit: true };
    default:
      return { output: `command not found: ${cmd} (try: help)` };
  }
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [inE, setInE] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [bannerCount, setBannerCount] = useState(0);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) restoreFocusRef.current?.focus({ preventScroll: true });
  }, []);

  const openTerminal = useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement;
    setLines([]);
    setValue("");
    setHistoryIndex(-1);
    // Reset the banner here (an event handler) so the typing effect below
    // only ever sets state from its timers. Reduced motion: full line, now.
    setBannerCount(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? BANNER.length
        : 0,
    );
    // Session-persisted history: reopening recalls previous commands.
    try {
      const saved = sessionStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // sessionStorage unavailable (private mode quirks): history stays in-memory.
    }
    setOpen(true);
  }, []);

  // The `/` key answers only at rung E (the doorway buttons live in E's
  // dress anyway, so this is the one global path that needs the gate).
  useEffect(() => {
    return subscribeJourneyProgress(({ activeRung }) => {
      setInE(activeRung === "e");
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (e.key === "/" && !open && !typing && inE && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openTerminal();
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    const onOpenEvent = () => {
      if (!open) openTerminal();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("terminal:open", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("terminal:open", onOpenEvent);
    };
  }, [open, inE, close, openTerminal]);

  // The banner types itself in with punctuation-aware pacing (the study's
  // typewriter rhythm): quick per char, a breath after a comma or dash, a
  // longer one after a period. Instant under reduced motion (openTerminal
  // seeds the full line and this effect stands down). It lives OUTSIDE
  // the role="log" region so screen readers hear the sr-only copy once
  // instead of one announcement per keystroke.
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let shown = 0;
    let timer = 0;
    const tick = () => {
      shown += 1;
      setBannerCount(shown);
      if (shown >= BANNER.length) return;
      const prev = BANNER[shown - 1];
      const delay =
        prev === "." ? 320 : prev === "," || prev === "-" ? 110 : 22;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 140);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // The paper must not slide under the open terminal: wheel/touch over the
  // overlay would scroll the body, so Escape would drop you somewhere you
  // never navigated to. Lock body scroll while open; the output pane keeps
  // its own scrolling (overscroll-contain stops chaining at its edges).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const raw = value;
    const result = runCommand(raw);
    if (raw.trim()) {
      const nextHistory = [...history, raw];
      setHistory(nextHistory);
      try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      } catch {
        // best-effort persistence only
      }
    }
    setHistoryIndex(-1);
    setValue("");
    if (result.anchor) {
      // Don't restore focus to the pre-open element: the visitor asked to
      // leave it. Focus lands on the section's heading (tabindex -1 in the
      // dress) so keyboard and SR users arrive where the scroll does.
      close(false);
      const heading = document.getElementById(`${result.anchor}-title`);
      const section = document.getElementById(result.anchor);
      heading?.focus({ preventScroll: true });
      (section ?? heading)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      return;
    }
    if (result.exit) {
      close();
      return;
    }
    if (result.clear) {
      setLines([]);
      return;
    }
    setLines((prev) => [
      ...prev,
      { kind: "input", text: raw },
      ...(result.output
        ? [{ kind: "output" as const, text: result.output }]
        : []),
    ]);
    if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const completion = complete(value);
      if (!completion) return;
      if ("value" in completion) {
        setValue(completion.value);
      } else {
        setLines((prev) => [
          ...prev,
          { kind: "input", text: value },
          { kind: "output", text: completion.candidates.join("  ") },
        ]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next =
        historyIndex === -1
          ? history.length - 1
          : Math.max(historyIndex - 1, 0);
      setHistoryIndex(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-void/60 px-4 pt-[12svh] backdrop-blur-sm sm:px-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="terminal-in flex max-h-[70svh] w-full max-w-2xl flex-col overflow-hidden border border-grid/70 bg-surface shadow-2xl shadow-void/60"
      >
        <div className="flex items-center justify-between border-b border-grid/70 bg-void/40 px-4 py-1">
          <p className="font-mono text-[11px] tracking-[0.14em] text-noise uppercase">
            <span aria-hidden="true" className="text-flare">
              ▸
            </span>{" "}
            snehanshn@desk:~
          </p>
          <button
            type="button"
            onClick={() => close()}
            className="min-h-[44px] min-w-[44px] px-3 font-mono text-[11px] tracking-[0.14em] text-noise uppercase transition-colors duration-150 hover:text-flare"
          >
            esc
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 font-mono text-[13px] leading-relaxed"
        >
          <p className="text-noise">
            <span aria-hidden="true">
              {BANNER.slice(0, bannerCount)}
              {bannerCount < BANNER.length && (
                <span className="text-flare">▌</span>
              )}
            </span>
            <span className="sr-only">{BANNER}</span>
          </p>
          <div role="log">
            {lines.map((line, i) =>
              line.kind === "input" ? (
                <p key={i} className="text-glow">
                  <span aria-hidden="true" className="text-flare">
                    ❯{" "}
                  </span>
                  {line.text}
                </p>
              ) : (
                <pre
                  key={i}
                  className="whitespace-pre-wrap break-words text-noise"
                >
                  {line.text}
                </pre>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-trace/60 px-4 py-3">
          <span aria-hidden="true" className="font-mono text-[13px] text-flare">
            ❯
          </span>
          <input
            ref={inputRef}
            data-terminal-input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onInputKey}
            aria-label="Terminal command"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-h-6 w-full bg-transparent font-mono text-[13px] text-glow caret-flare outline-none placeholder:text-noise/50"
            placeholder="help"
          />
        </div>
      </div>
    </div>
  );
}
