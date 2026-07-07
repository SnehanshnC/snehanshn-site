"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact, identity, otherWins, projects } from "@/content";

/*
 * The easter egg: press `/` anywhere to open a terminal over the page.
 * It speaks the site's own tokens (amber prompt on surface), not the
 * green-on-black cliché. Fully keyboard-operable: type, Enter, ArrowUp/Down
 * for history, Escape or `exit` to close.
 */

type Line = { kind: "input" | "output"; text: string };

const HELP = `commands:
  help              this list
  ls projects       what I've built
  open <project>    open a project's link
  cat awards        the trophy cabinet, quietly
  whoami            who is this guy
  sudo hire-me      escalate privileges
  exit              close the terminal`;

function runCommand(raw: string): { output: string; url?: string; exit?: boolean } {
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
          .flatMap((p) => p.awards.map((a) => `  ${a.full} — ${p.name}`))
          .join("\n");
        return { output: `${cardAwards}\n${otherWins}` };
      }
      return { output: `cat: ${arg || "<file>"}: no such file (try: cat awards)` };
    case "whoami":
      return {
        output: `${identity.name}\n${identity.kicker}\n${identity.heroLine}`,
      };
    case "sudo":
      if (arg === "hire-me") {
        return {
          output: `[sudo] password accepted.\naccess granted: I start Mondays.\nemail: ${contact.email.href === "#todo" ? "pending — check back soon" : contact.email.href}`,
        };
      }
      return { output: `sudo: ${arg}: not in the sudoers file` };
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
    restoreFocusRef.current?.focus();
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
        restoreFocusRef.current = document.activeElement as HTMLElement;
        setLines([
          { kind: "output", text: "snehanshn.com — type help to begin" },
        ]);
        setValue("");
        setOpen(true);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const raw = value;
    const result = runCommand(raw);
    if (result.exit) {
      close();
      return;
    }
    setLines((prev) => [
      ...prev,
      { kind: "input", text: raw },
      ...(result.output
        ? [{ kind: "output" as const, text: result.output }]
        : []),
    ]);
    if (raw.trim()) setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    setValue("");
    if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-void/70 px-4 pt-[12svh] backdrop-blur-sm sm:px-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            className="flex max-h-[70svh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-trace bg-surface shadow-2xl shadow-void"
          >
            <div className="flex items-center justify-between border-b border-trace/60 px-4 py-2.5">
              <p className="font-mono text-xs text-noise">
                snehanshn@site:~
              </p>
              <button
                type="button"
                onClick={close}
                className="min-h-8 rounded px-2 font-mono text-xs text-noise transition-colors duration-150 hover:text-signal"
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onInputKey}
                aria-label="Terminal command"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="min-h-6 w-full bg-transparent font-mono text-[13px] text-glow outline-none placeholder:text-noise/50"
                placeholder="help"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
