"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contact, identity, otherWins, projects } from "@/content";

/*
 * The easter egg: press `/` anywhere (or tap "press /" in the footer) to
 * open a terminal over the page. It speaks the site's own tokens (amber
 * prompt on surface), not the green-on-black cliché. Fully keyboard-
 * operable: type, Tab to complete, Enter, ArrowUp/Down for history
 * (persisted for the session), Escape or `exit` to close.
 */

type Line = { kind: "input" | "output"; text: string };

const HELP = `commands:
  help              this list
  ls projects       what I've built
  open <project>    open a project's link
  cat awards        the trophy cabinet, quietly
  whoami            who is this guy
  sudo hire-me      escalate privileges
  pulse             catch an arb on the hero
  clear             clear the screen
  exit              close the terminal`;

const COMMANDS = [
  "cat",
  "clear",
  "exit",
  "help",
  "ls",
  "open",
  "pulse",
  "sudo",
  "whoami",
];

/** Argument completions per command, for Tab. */
const COMMAND_ARGS: Record<string, string[]> = {
  ls: ["projects"],
  open: projects.map((p) => p.slug),
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
  exit?: boolean;
  clear?: boolean;
  pulse?: boolean;
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
            .map((p) => `${p.slug.padEnd(14)} ${p.tagline}`)
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
          output: `[sudo] password accepted.\naccess granted: I start Mondays.${email}`,
        };
      }
      return { output: `sudo: ${arg}: not in the sudoers file` };
    case "clear":
      return { output: "", clear: true };
    case "pulse":
      return { output: "", exit: true, pulse: true };
    case "exit":
      return { output: "", exit: true };
    default:
      return { output: `command not found: ${cmd} (try: help)` };
  }
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // preventScroll keeps `pulse` (which scrolls to the hero) from being
    // yanked back to the restored element; a plain close never scrolled.
    restoreFocusRef.current?.focus({ preventScroll: true });
  }, []);

  const openTerminal = useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement;
    setLines([{ kind: "output", text: "snehanshn.com - type help to begin" }]);
    setValue("");
    setHistoryIndex(-1);
    // Session-persisted history: reopening recalls previous commands.
    try {
      const saved = sessionStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // sessionStorage unavailable (private mode quirks): history stays in-memory.
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (e.key === "/" && !open && !typing && !e.metaKey && !e.ctrlKey) {
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
  }, [open, close, openTerminal]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
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
    if (result.pulse) {
      close();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      // Let the hero scroll into view before the arb fires (MarketFlow
      // ignores the event entirely under reduced motion).
      window.setTimeout(
        () => window.dispatchEvent(new Event("marketflow:pulse")),
        reduced ? 0 : 450
      );
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-void/70 px-4 pt-[12svh] backdrop-blur-sm sm:px-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="terminal-in flex max-h-[70svh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-trace bg-surface shadow-2xl shadow-void"
      >
            <div className="flex items-center justify-between border-b border-trace/60 px-4 py-1">
              <p className="font-mono text-xs text-noise">
                snehanshn@site:~
              </p>
              <button
                type="button"
                onClick={close}
                className="min-h-11 min-w-11 cursor-pointer rounded px-3 font-mono text-xs text-noise transition-colors duration-150 hover:text-signal"
              >
                esc
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
            >
              {lines.map((line, i) =>
                line.kind === "input" ? (
                  <p key={i} className="text-glow">
                    <span aria-hidden="true" className="text-signal">
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

            <div className="flex items-center gap-2 border-t border-trace/60 px-4 py-3">
              <span aria-hidden="true" className="font-mono text-[13px] text-signal">
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
                className="min-h-6 w-full bg-transparent font-mono text-[13px] text-glow caret-signal outline-none placeholder:text-noise/50"
                placeholder="help"
              />
            </div>
          </div>
    </div>
  );
}
