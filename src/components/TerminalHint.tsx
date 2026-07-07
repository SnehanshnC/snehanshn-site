"use client";

/*
 * The footer's "press /" hint, as a real button so the terminal is
 * reachable on touch devices (no keyboard, no `/`). Dispatches the
 * `terminal:open` event that Terminal listens for.
 */
export default function TerminalHint() {
  return (
    <button
      type="button"
      title="open the terminal"
      onClick={() => window.dispatchEvent(new Event("terminal:open"))}
      className="-my-3 inline-block min-h-11 min-w-11 cursor-pointer content-center px-1 font-mono text-xs text-noise transition-colors duration-150 hover:text-signal"
    >
      press /
    </button>
  );
}
