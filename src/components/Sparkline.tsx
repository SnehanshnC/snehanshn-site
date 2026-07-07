/*
 * The one market whisper allowed on the light surface: a tiny static
 * sparkline riding beside the "currently" line. Deterministic points,
 * amber tick on the last close. Decorative only.
 */
const POINTS = [12, 9, 11, 7, 8, 5, 7, 4, 6, 3, 4, 2];

export default function Sparkline({ className = "" }: { className?: string }) {
  const pts = POINTS.map((y, i) => `${i * 6},${y}`).join(" ");
  const last = POINTS[POINTS.length - 1];
  const lastX = (POINTS.length - 1) * 6;
  return (
    <svg
      viewBox="0 0 70 14"
      width="70"
      height="14"
      aria-hidden="true"
      className={className}
    >
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx={lastX} cy={last} r="2.5" fill="var(--flare)" />
    </svg>
  );
}
