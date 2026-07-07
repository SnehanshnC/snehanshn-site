"use client";

/*
 * The "press /" hint (footer and hero), as a real button so the terminal
 * is reachable on touch devices (no keyboard, no `/`). Dispatches the
 * `terminal:open` event that Terminal listens for.
 */
export default function TerminalHint({
  label = "press /",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  /* The `/` alone carries the signal accent - the doorway glyph mirrors
     the amber ▾ on "the book" without raising the label's volume. */
  const slash = label.indexOf("/");
  return (
    <button
      type="button"
      title="open the terminal"
      onClick={() => window.dispatchEvent(new Event("terminal:open"))}
      className={`-my-3 inline-block min-h-11 min-w-11 cursor-pointer content-center px-1 font-mono text-[11px] tracking-[0.14em] text-noise uppercase transition-colors duration-150 hover:text-signal ${className}`}
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
