"use client";

/*
 * The "press /" hint (footer + nav doorway), as a real button so the
 * terminal is reachable on touch devices (no keyboard, no `/`).
 * Dispatches the `terminal:open` event that Terminal listens for.
 */
export default function TerminalHint({
  label = "press /",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  /* The `/` alone carries the accent - a doorway glyph, not a shout. */
  const slash = label.indexOf("/");
  return (
    <button
      type="button"
      title="open the terminal"
      data-cursor="press /"
      onClick={() => window.dispatchEvent(new Event("terminal:open"))}
      className={`-my-3 inline-block min-h-11 min-w-11 content-center px-1 font-mono text-[12px] tracking-[0.1em] text-faint uppercase transition-colors duration-150 hover:text-ink ${className}`}
    >
      {slash === -1 ? (
        label
      ) : (
        <>
          {label.slice(0, slash)}
          <span className="text-signal">/</span>
          {label.slice(slash + 1)}
        </>
      )}
    </button>
  );
}
