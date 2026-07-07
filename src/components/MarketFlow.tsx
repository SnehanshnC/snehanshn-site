"use client";

import { useEffect, useRef } from "react";

/*
 * The signature: a market-flow field drawn on raw canvas 2D.
 * Fine particles drift along curved routes between three unlabeled nodes;
 * every few seconds an arbitrage pulse traces a lit route in the accent
 * color and fades. The field also answers the visitor: particles near the
 * pointer speed up along their arcs (desktop, hover-capable only), and a
 * click on open canvas fires a pulse from the nearest node. Both are
 * skipped under prefers-reduced-motion. Tuning parameters are documented
 * in AGENTS.md - change them there and here together.
 */

const SIGNAL = "242, 163, 60"; // --signal as r,g,b
const TRACE = "139, 147, 167"; // --noise as r,g,b (particles read better than --trace)

const DPR_CAP = 2;
const DESKTOP_PARTICLES = 520;
const MOBILE_PARTICLES = 110;
const MOBILE_BREAKPOINT = 768;
const PULSE_EVERY_MS: [number, number] = [4200, 7500];
const PULSE_DURATION_MS = 1500;
const PULSE_TRAIL = 0.22; // fraction of a route lit behind the pulse head
const PULSE_PEAK_ALPHA = 0.75; // trail alpha at the head
const PULSE_GLOW_RADIUS = 18; // head glow radius, px
const DRIFT_SPEED = 0.000016; // particle progress per ms, base
const POINTER_RADIUS = 120; // px of pointer influence
const POINTER_BOOST = 1.9; // extra arc speed at the pointer's center
const POINTER_LERP = 0.08; // per-frame easing toward/away from the boost

type Vec = { x: number; y: number };

/**
 * Node anchors in unit space; drift is added per-frame.
 * Node 0 sits low-left and node 1 high-center-right so the main arcs
 * arch over and right of the hero copy block instead of behind it.
 */
const NODES: Vec[] = [
  { x: 0.1, y: 0.78 },
  { x: 0.58, y: 0.22 },
  { x: 0.86, y: 0.6 },
];

/** Edges as [nodeA, nodeB, curvature]; two arcs per pair for depth. */
const EDGES: [number, number, number][] = [
  [0, 1, 0.22],
  [0, 1, -0.14],
  [1, 2, 0.2],
  [1, 2, -0.16],
  [0, 2, 0.3],
  [0, 2, -0.24],
];

function nodePos(i: number, t: number, w: number, h: number): Vec {
  const n = NODES[i];
  // Slow, small orbital drift so the field never feels frozen.
  const dx = Math.sin(t * 0.00008 + i * 2.1) * 0.012;
  const dy = Math.cos(t * 0.00006 + i * 1.7) * 0.016;
  return { x: (n.x + dx) * w, y: (n.y + dy) * h };
}

function edgeControl(a: Vec, b: Vec, curvature: number): Vec {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { x: mx - dy * curvature, y: my + dx * curvature };
}

type Particle = {
  edge: number;
  t: number;
  speed: number;
  size: number;
  alpha: number;
  dir: 1 | -1;
  /** Pointer-influence speed multiplier, eased toward its target each frame. */
  boost: number;
};

type Pulse = {
  /** Ordered edges forming the route, with direction per hop. */
  hops: { edge: number; reverse: boolean }[];
  start: number;
} | null;

export default function MarketFlow({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let pulse: Pulse = null;
    let nextPulseAt = 0;
    let visible = true;
    let hidden = false;
    let pointer: Vec | null = null;
    let lastFrame = performance.now();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;

    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    function makeParticles() {
      const count =
        width < MOBILE_BREAKPOINT ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
      particles = Array.from({ length: count }, () => ({
        edge: Math.floor(Math.random() * EDGES.length),
        t: Math.random(),
        speed: rand(0.6, 1.6),
        size: rand(0.5, 1.4),
        alpha: rand(0.12, 0.4),
        dir: Math.random() > 0.5 ? 1 : -1,
        boost: 1,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
      // Paint one frame synchronously: the reduced-motion frame, and the
      // first visible frame everywhere else until the rAF loop takes over.
      drawStatic();
    }

    function edgeGeometry(edgeIndex: number, now: number) {
      const [ai, bi, curvature] = EDGES[edgeIndex];
      const a = nodePos(ai, now, width, height);
      const b = nodePos(bi, now, width, height);
      const c = edgeControl(a, b, curvature);
      return { a, b, c };
    }

    function pointOn(edgeIndex: number, t: number, now: number): Vec {
      const { a, b, c } = edgeGeometry(edgeIndex, now);
      const u = 1 - t;
      return {
        x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
        y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
      };
    }

    function drawNodes(now: number) {
      for (let i = 0; i < NODES.length; i++) {
        const p = nodePos(i, now, width, height);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${TRACE}, 0.7)`;
        ctx!.fill();
      }
    }

    function drawParticles(now: number, dt: number) {
      const r2 = POINTER_RADIUS * POINTER_RADIUS;
      for (const p of particles) {
        const pos = pointOn(p.edge, p.t, now);
        // Particles near the pointer speed up along their arc - the field
        // reacts the way a book of orders reacts to a trade.
        let target = 1;
        if (pointer) {
          const dx = pos.x - pointer.x;
          const dy = pos.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            target = 1 + POINTER_BOOST * (1 - Math.sqrt(d2) / POINTER_RADIUS);
          }
        }
        p.boost += (target - p.boost) * POINTER_LERP;
        p.t += p.dir * p.speed * p.boost * DRIFT_SPEED * dt;
        if (p.t > 1) p.t -= 1;
        if (p.t < 0) p.t += 1;
        ctx!.beginPath();
        ctx!.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${TRACE}, ${p.alpha})`;
        ctx!.fill();
      }
    }

    function schedulePulse(now: number) {
      nextPulseAt = now + rand(PULSE_EVERY_MS[0], PULSE_EVERY_MS[1]);
    }

    function startPulse(now: number, startNode?: number) {
      // Route: a permutation of the three nodes, two hops. A manual pulse
      // (click) starts at the node nearest the click.
      const order =
        startNode === undefined
          ? [0, 1, 2].sort(() => Math.random() - 0.5)
          : [
              startNode,
              ...[0, 1, 2]
                .filter((i) => i !== startNode)
                .sort(() => Math.random() - 0.5),
            ];
      const hops: { edge: number; reverse: boolean }[] = [];
      for (let i = 0; i < 2; i++) {
        const from = order[i];
        const to = order[i + 1];
        const candidates = EDGES.map((e, idx) => ({ e, idx })).filter(
          ({ e }) =>
            (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from)
        );
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        hops.push({ edge: pick.idx, reverse: pick.e[0] !== from });
      }
      pulse = { hops, start: now };
    }

    /** Position along the 2-hop route, progress in [0, 1]. */
    function routePoint(pr: number, now: number): Vec {
      const hopIndex = pr < 0.5 ? 0 : 1;
      const hop = pulse!.hops[hopIndex];
      let t = (pr - hopIndex * 0.5) * 2;
      if (hop.reverse) t = 1 - t;
      return pointOn(hop.edge, t, now);
    }

    function drawPulse(now: number) {
      if (!pulse) {
        if (now >= nextPulseAt) startPulse(now);
        return;
      }
      const progress = (now - pulse.start) / PULSE_DURATION_MS;
      if (progress >= 1 + PULSE_TRAIL) {
        pulse = null;
        schedulePulse(now);
        return;
      }
      const head = Math.min(progress, 1);
      const tail = Math.max(progress - PULSE_TRAIL, 0);
      // Fade the whole trail out once the head has arrived.
      const fade =
        progress <= 1 ? 1 : 1 - (progress - 1) / PULSE_TRAIL;

      const steps = 36;
      ctx!.lineCap = "round";
      for (let i = 0; i < steps; i++) {
        const p0 = tail + ((head - tail) * i) / steps;
        const p1 = tail + ((head - tail) * (i + 1)) / steps;
        if (p1 <= p0) continue;
        const a = routePoint(p0, now);
        const b = routePoint(p1, now);
        const strength = (i + 1) / steps; // brighter toward the head
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = `rgba(${SIGNAL}, ${PULSE_PEAK_ALPHA * strength * fade})`;
        ctx!.lineWidth = 1 + strength * 1.2;
        ctx!.stroke();
      }
      // Head glow.
      if (progress <= 1) {
        const h = routePoint(head, now);
        const glow = ctx!.createRadialGradient(
          h.x,
          h.y,
          0,
          h.x,
          h.y,
          PULSE_GLOW_RADIUS
        );
        glow.addColorStop(0, `rgba(${SIGNAL}, 0.8)`);
        glow.addColorStop(1, `rgba(${SIGNAL}, 0)`);
        ctx!.beginPath();
        ctx!.arc(h.x, h.y, PULSE_GLOW_RADIUS, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      }
    }

    /** The reduced-motion frame: same field, one pulse frozen mid-route. */
    function drawStatic() {
      const now = 0;
      ctx!.clearRect(0, 0, width, height);
      drawNodes(now);
      for (const p of particles) {
        const pos = pointOn(p.edge, p.t, now);
        ctx!.beginPath();
        ctx!.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${TRACE}, ${p.alpha})`;
        ctx!.fill();
      }
      // A frozen pulse along one arc so the accent is present.
      const steps = 30;
      for (let i = 0; i < steps; i++) {
        const a = pointOn(2, 0.25 + (0.5 * i) / steps, now);
        const b = pointOn(2, 0.25 + (0.5 * (i + 1)) / steps, now);
        const strength = (i + 1) / steps;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.strokeStyle = `rgba(${SIGNAL}, ${0.5 * strength})`;
        ctx!.lineWidth = 1 + strength;
        ctx!.lineCap = "round";
        ctx!.stroke();
      }
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - lastFrame, 48);
      lastFrame = now;
      ctx!.clearRect(0, 0, width, height);
      drawNodes(now);
      drawParticles(now, dt);
      drawPulse(now);
    }

    /**
     * The rAF loop only runs while the canvas is on screen and the tab is
     * visible; pausing cancels it entirely rather than idling at 60Hz.
     */
    function updateRunning() {
      const shouldRun = !reducedMotion && visible && !hidden;
      if (shouldRun && !running) {
        running = true;
        const now = performance.now();
        lastFrame = now;
        // Don't fire a stale pulse the instant the field scrolls back in.
        if (nextPulseAt < now && !pulse) schedulePulse(now);
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateRunning();
    });
    io.observe(canvas);

    const onVisibility = () => {
      hidden = document.hidden;
      updateRunning();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Pointer + click land on the hero section (the canvas sits under the
    // copy block, which would otherwise swallow the events).
    const host: HTMLElement = canvas.parentElement ?? canvas;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onPointerLeave = () => {
      pointer = null;
    };
    if (!reducedMotion && hoverCapable) {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
    }

    const firePulse = (startNode?: number) => {
      if (reducedMotion || pulse) return; // one active pulse, ever
      const now = performance.now();
      startPulse(now, startNode);
    };

    const onClick = (e: MouseEvent) => {
      // Clicks on the copy or interactive elements keep their meaning.
      if ((e.target as HTMLElement).closest("h1, p, a, button")) return;
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < NODES.length; i++) {
        const p = nodePos(i, now, width, height);
        const d = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      firePulse(nearest);
    };
    if (!reducedMotion) host.addEventListener("click", onClick);

    // The terminal's `pulse` command lands here.
    const onCommandPulse = () => firePulse();
    window.addEventListener("marketflow:pulse", onCommandPulse);

    if (!reducedMotion) {
      schedulePulse(performance.now());
      updateRunning();
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("click", onClick);
      window.removeEventListener("marketflow:pulse", onCommandPulse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
