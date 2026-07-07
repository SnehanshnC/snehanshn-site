/*
 * Module header bar: the data voice naming an instrument panel.
 * `01 / POSITIONS` left, a small live readout right, on visible grid rules.
 */
export default function ModuleHeader({
  index,
  title,
  readout,
}: {
  index: string;
  title: string;
  readout?: string;
}) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-y border-grid/70 bg-surface/40 px-4 py-3 font-mono text-xs tracking-[0.16em] uppercase sm:px-6 md:px-8">
      <h2 className="text-glow">
        <span aria-hidden="true" className="text-signal">
          {index}
        </span>{" "}
        / {title}
      </h2>
      {readout && (
        <p aria-hidden="true" className="text-noise tabular-nums">
          {readout}
        </p>
      )}
    </header>
  );
}
