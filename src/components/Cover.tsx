import type { CoverMotif } from "@/content";

/*
 * Designed abstract covers for the work grid - one consistent system,
 * no fake screenshots. Each cover is a warm gradient wash in the
 * project's hue plus a thin-line SVG motif (a deeper shade of the same
 * hue) that says what the thing does, with a single amber accent.
 * Everything is deterministic - no randomness, identical on every render.
 */

const FLARE = "#f2a33c";

type Props = { hue: number; motif: CoverMotif; className?: string };

/** Deeper line shade and two wash stops derived from the project hue. */
function shades(hue: number) {
  return {
    line: `hsl(${hue} 32% 40%)`,
    soft: `hsl(${hue} 30% 62%)`,
    washA: `hsl(${hue} 42% 93%)`,
    washB: `hsl(${hue} 34% 86%)`,
  };
}

function Motif({ motif, hue }: { motif: CoverMotif; hue: number }) {
  const c = shades(hue);
  const thin = { stroke: c.line, strokeWidth: 2, fill: "none" } as const;

  switch (motif) {
    case "depth": {
      // A depth-chart step line climbing the frame, one amber fill tick.
      const steps = [300, 288, 262, 258, 232, 214, 208, 178, 170, 148, 132];
      let d = `M 50 ${steps[0]}`;
      steps.forEach((y, i) => {
        const x = 50 + i * 50;
        d += ` H ${x} V ${y}`;
      });
      d += " H 560";
      return (
        <g>
          <path d={d} {...thin} strokeWidth={2.5} />
          <path
            d={`${d} V 340 H 50 Z`}
            fill={c.soft}
            opacity={0.18}
            stroke="none"
          />
          {steps.map((y, i) => (
            <circle key={i} cx={50 + i * 50} cy={y} r={3} fill={c.line} />
          ))}
          <rect x={396} y={178} width={8} height={162} fill={FLARE} />
        </g>
      );
    }
    case "routes": {
      // One origin, many routed paths - applications fanning out.
      const ends = [70, 120, 170, 220, 270, 320];
      return (
        <g>
          {ends.map((y, i) => (
            <path
              key={i}
              d={`M 90 200 C 260 200 300 ${y} 500 ${y}`}
              {...thin}
              stroke={i === 1 ? FLARE : c.line}
              strokeWidth={i === 1 ? 3 : 2}
              opacity={i === 1 ? 1 : 0.75}
            />
          ))}
          {ends.map((y, i) => (
            <path
              key={`a${i}`}
              d={`M 500 ${y} l -12 -7 v 14 Z`}
              fill={i === 1 ? FLARE : c.line}
              opacity={i === 1 ? 1 : 0.75}
            />
          ))}
          <circle cx={90} cy={200} r={10} fill={c.line} />
        </g>
      );
    }
    case "graph": {
      // Knowledge graph: nodes, edges, one amber node.
      const nodes: [number, number, number][] = [
        [140, 120, 9],
        [300, 80, 7],
        [460, 130, 10],
        [110, 260, 7],
        [280, 210, 12],
        [450, 280, 8],
        [340, 320, 7],
        [180, 330, 6],
      ];
      const edges = [
        [0, 1],
        [1, 2],
        [0, 4],
        [2, 4],
        [3, 4],
        [4, 5],
        [4, 6],
        [3, 7],
        [6, 7],
        [2, 5],
      ];
      return (
        <g>
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
              {...thin}
              opacity={0.6}
            />
          ))}
          {nodes.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={i === 4 ? FLARE : "none"}
              stroke={i === 4 ? "none" : c.line}
              strokeWidth={2}
            />
          ))}
        </g>
      );
    }
    case "blocks": {
      // Parquet column blocks - a quarry of data slices, one amber slice.
      const cols = [220, 150, 260, 180, 240, 120, 200];
      const widths = [46, 30, 46, 30, 46, 30, 46];
      const xs = widths.reduce(
        (acc, w) => (acc.push(acc[acc.length - 1] + w + 22), acc),
        [97]
      );
      return (
        <g>
          {cols.map((h, i) => {
            const x = xs[i];
            const w = widths[i];
            const segs = Math.floor(h / 52);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={340 - h}
                  width={w}
                  height={h}
                  fill={c.soft}
                  opacity={0.28}
                  stroke="none"
                />
                {i === 4 && (
                  <rect
                    x={x}
                    y={340 - h}
                    width={w}
                    height={52}
                    fill={FLARE}
                    opacity={0.9}
                  />
                )}
                <rect
                  x={x}
                  y={340 - h}
                  width={w}
                  height={h}
                  {...thin}
                />
                {Array.from({ length: segs }, (_, s) => (
                  <line
                    key={s}
                    x1={x}
                    y1={340 - h + (s + 1) * 52}
                    x2={x + w}
                    y2={340 - h + (s + 1) * 52}
                    stroke={c.line}
                    strokeWidth={1.5}
                    opacity={0.7}
                  />
                ))}
              </g>
            );
          })}
        </g>
      );
    }
    case "wave": {
      // Speech: a row of mirrored waveform bars, one amber.
      const bars = [
        18, 34, 22, 52, 40, 76, 58, 108, 84, 128, 96, 72, 112, 60, 88, 44,
        64, 30, 46, 20, 32, 14,
      ];
      return (
        <g>
          {bars.map((h, i) => (
            <rect
              key={i}
              x={64 + i * 22}
              y={200 - h / 2}
              width={9}
              height={h}
              rx={4.5}
              fill={i === 9 ? FLARE : c.line}
              opacity={i === 9 ? 1 : 0.7}
            />
          ))}
        </g>
      );
    }
    case "pulse": {
      // EKG: flatline, spike, flatline - the field-medic heartbeat.
      return (
        <g>
          <path
            d="M 40 210 H 200 l 18 -26 l 26 52 l 30 -132 l 30 156 l 22 -68 l 16 18 H 560"
            {...thin}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx={304} cy={104} r={7} fill={FLARE} />
          <line
            x1={40}
            y1={286}
            x2={560}
            y2={286}
            stroke={c.line}
            strokeWidth={1.5}
            opacity={0.3}
            strokeDasharray="2 8"
          />
        </g>
      );
    }
  }
}

export default function Cover({ hue, motif, className }: Props) {
  const c = shades(hue);
  const gid = `wash-${motif}-${hue}`;
  return (
    <svg
      viewBox="0 0 600 400"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.washA} />
          <stop offset="1" stopColor={c.washB} />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#${gid})`} />
      <g className="cover-art">
        <Motif motif={motif} hue={hue} />
      </g>
    </svg>
  );
}
