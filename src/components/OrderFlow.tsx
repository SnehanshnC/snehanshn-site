"use client";

import { useEffect, useRef } from "react";

/*
 * The signature: an order-flow surface on raw canvas 2D.
 * Three systems, all data-shaped:
 *  - Flow lanes: horizontal streamlines carrying visible particle currents
 *    across the full width (mostly left-to-right, a few counterflows).
 *  - Arbitrage pulses: an amber streak races a lane end-to-end every few
 *    seconds; a click on open canvas fires one on the nearest lane, and the
 *    terminal's `pulse` command dispatches the `marketflow:pulse` event.
 *  - Depth chart: a seeded step line accumulating along the bottom band,
 *    drawing itself in over ~8s, holding, then rebuilding a new book.
 * Pointer proximity speeds up nearby particles (hover-capable devices).
 * Behavior contracts (do not regress): a synchronous frame is painted on
 * resize so the canvas is never blank in headless captures; the rAF loop is
 * cancelled (not idled) when the tab is hidden or the canvas leaves the
 * viewport; prefers-reduced-motion gets a composed static frame - lanes,
 * one full pulse trail, the full depth line - a terminal paused, not off.
 * Tuning constants below are documented in AGENTS.md; change both together.
 */

const SIGNAL = "242, 163, 60"; // --signal as r,g,b
const NOISE = "139, 147, 167"; // --noise as r,g,b - particle base color
const GRID = "58, 74, 112"; // --grid as r,g,b - chart furniture

const DPR_CAP = 2;
const DESKTOP_LANES = 10;
const MOBILE_LANES = 7;
const DESKTOP_PARTICLES = 460;
const MOBILE_PARTICLES = 150;
const MOBILE_BREAKPOINT = 768;
const COUNTERFLOW_EVERY = 3; // every Nth lane runs right-to-left, dimmer
const LANE_BAND: [number, number] = [0.06, 0.66]; // lanes live in this y-band
const LANE_AMP: [number, number] = [0.012, 0.045]; // sine amplitude, fraction of h
const LANE_WOBBLE = 0.00006; // lane phase drift per ms
const PARTICLE_SPEED: [number, number] = [0.000028, 0.00009]; // fraction of w per ms
const PARTICLE_ALPHA: [number, number] = [0.28, 0.75];
const PARTICLE_SIZE: [number, number] = [0.6, 1.7];
const AMBER_PARTICLE_RATIO = 0.05; // a few particles carry the accent
const PULSE_EVERY_MS: [number, number] = [2800, 5200];
const PULSE_DURATION_MS = 1300;
const PULSE_TRAIL = 0.3; // fraction of the width lit behind the head
const PULSE_PEAK_ALPHA = 0.85;
const PULSE_GLOW_RADIUS = 22;
const DEPTH_BAND: [number, number] = [0.7, 0.97]; // depth chart y-band
const DEPTH_STEPS = 96;
const DEPTH_DRAW_MS = 8000; // draw-in duration
const DEPTH_HOLD_MS = 6000; // hold before rebuilding
const POINTER_RADIUS = 130;
const POINTER_BOOST = 2.2;
const POINTER_LERP = 0.08;
const RULER_TICKS = 9; // right-edge price ruler

const SEED = 0x1a2b3c;

/** mulberry32 - deterministic PRNG so static frames are reproducible. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Lane = {
  baseY: number; // fraction of height
  amp: number; // fraction of height
  waves: number; // sine periods across the width
  phase: number;
  dir: 1 | -1;
};

type Particle = {
  lane: number;
  x: number; // fraction of width
  speed: number; // fraction of width per ms
  size: number;
  alpha: number;
  amber: boolean;
  boost: number;
};

type Pulse = { lane: number; start: number } | null;

export default function OrderFlow({ className }: { className?: string }) {
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
    let lanes: Lane[] = [];
    let particles: Particle[] = [];
    let depth: number[] = []; // step values in [0,1]
    let depthStart = 0;
    let pulse: Pulse = null;
    let nextPulseAt = 0;
    let visible = true;
    let hidden = false;
    let pointer: { x: number; y: number } | null = null;
    let lastFrame = performance.now();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;

    const seeded = mulberry32(SEED);
    const rand = (lo: number, hi: number) => lo + seeded() * (hi - lo);

    function makeField() {
      const mobile = width < MOBILE_BREAKPOINT;
      const laneCount = mobile ? MOBILE_LANES : DESKTOP_LANES;
      const [bandLo, bandHi] = LANE_BAND;
      lanes = Array.from({ length: laneCount }, (_, i) => ({
        // Even spacing with seeded jitter so the band reads as a field,
        // not a ruled page.
        baseY:
          bandLo +
          ((bandHi - bandLo) * (i + 0.5)) / laneCount +
          rand(-0.018, 0.018),
        amp: rand(LANE_AMP[0], LANE_AMP[1]),
        waves: rand(1.1, 2.6),
        phase: rand(0, Math.PI * 2),
        dir: i % COUNTERFLOW_EVERY === COUNTERFLOW_EVERY - 1 ? -1 : 1,
      }));
      const count = mobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
      particles = Array.from({ length: count }, () => ({
        lane: Math.floor(seeded() * laneCount),
        x: seeded(),
        speed: rand(PARTICLE_SPEED[0], PARTICLE_SPEED[1]),
        size: rand(PARTICLE_SIZE[0], PARTICLE_SIZE[1]),
        alpha: rand(PARTICLE_ALPHA[0], PARTICLE_ALPHA[1]),
        amber: seeded() < AMBER_PARTICLE_RATIO,
        boost: 1,
      }));
      makeDepth();
    }

    /** A fresh order book: cumulative seeded walk, normalized to [0,1]. */
    function makeDepth() {
      const steps: number[] = [];
      let v = 0.5;
      for (let i = 0; i < DEPTH_STEPS; i++) {
        v += rand(-0.09, 0.09);
        v = Math.min(1, Math.max(0, v));
        steps.push(v);
      }
      depth = steps;
    }

    function laneY(lane: Lane, xFrac: number, t: number): number {
      return (
        (lane.baseY +
          lane.amp *
            Math.sin(
              xFrac * lane.waves * Math.PI * 2 +
                lane.phase +
                t * LANE_WOBBLE * lane.dir
            )) *
        height
      );
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeField();
      // Paint one frame synchronously: the reduced-motion frame, and the
      // first visible frame everywhere else until the rAF loop takes over.
      drawStatic();
    }

    /** Chart furniture: faint horizontal gridlines + right-edge ruler. */
    function drawFurniture() {
      ctx!.strokeStyle = `rgba(${GRID}, 0.16)`;
      ctx!.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const y = (height * i) / 5;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
      ctx!.strokeStyle = `rgba(${GRID}, 0.5)`;
      for (let i = 0; i <= RULER_TICKS; i++) {
        const y = (height * (i + 0.5)) / (RULER_TICKS + 1);
        ctx!.beginPath();
        ctx!.moveTo(width - 8, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
    }

    /**
     * The lane guides: each current's path drawn as a faint curve, so the
     * particle streams read as directed order flow, not scattered stars.
     */
    function drawLanes(now: number) {
      const samples = 48;
      for (const lane of lanes) {
        ctx!.beginPath();
        for (let i = 0; i <= samples; i++) {
          const xf = i / samples;
          const y = laneY(lane, xf, now);
          if (i === 0) ctx!.moveTo(0, y);
          else ctx!.lineTo(xf * width, y);
        }
        ctx!.strokeStyle = `rgba(${GRID}, ${lane.dir === 1 ? 0.32 : 0.18})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
    }

    function drawParticles(now: number, dt: number) {
      const r2 = POINTER_RADIUS * POINTER_RADIUS;
      for (const p of particles) {
        const lane = lanes[p.lane];
        const px = p.x * width;
        const py = laneY(lane, p.x, now);
        let target = 1;
        if (pointer) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            target = 1 + POINTER_BOOST * (1 - Math.sqrt(d2) / POINTER_RADIUS);
          }
        }
        p.boost += (target - p.boost) * POINTER_LERP;
        p.x += lane.dir * p.speed * p.boost * dt;
        if (p.x > 1) p.x -= 1;
        if (p.x < 0) p.x += 1;
        const dim = lane.dir === -1 ? 0.55 : 1; // counterflow reads as depth
        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.amber
          ? `rgba(${SIGNAL}, ${p.alpha * dim})`
          : `rgba(${NOISE}, ${p.alpha * dim})`;
        ctx!.fill();
      }
    }

    /** The depth chart: step line + fill, drawing in then rebuilding. */
    function drawDepth(now: number) {
      const cycle = DEPTH_DRAW_MS + DEPTH_HOLD_MS;
      const elapsed = now - depthStart;
      if (!reducedMotion && elapsed > cycle) {
        makeDepth();
        depthStart = now;
      }
      const reveal = reducedMotion
        ? 1
        : Math.min((now - depthStart) / DEPTH_DRAW_MS, 1);
      const [lo, hi] = DEPTH_BAND;
      const bandTop = lo * height;
      const bandH = (hi - lo) * height;
      const shown = Math.max(2, Math.floor(DEPTH_STEPS * reveal));
      const stepW = width / (DEPTH_STEPS - 1);

      ctx!.beginPath();
      ctx!.moveTo(0, bandTop + (1 - depth[0]) * bandH);
      for (let i = 1; i < shown; i++) {
        const y = bandTop + (1 - depth[i]) * bandH;
        ctx!.lineTo(i * stepW, bandTop + (1 - depth[i - 1]) * bandH);
        ctx!.lineTo(i * stepW, y);
      }
      ctx!.strokeStyle = `rgba(${SIGNAL}, 0.4)`;
      ctx!.lineWidth = 1.25;
      ctx!.stroke();
      // Fill to the bottom of the band, very low alpha.
      ctx!.lineTo((shown - 1) * stepW, bandTop + bandH);
      ctx!.lineTo(0, bandTop + bandH);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${SIGNAL}, 0.05)`;
      ctx!.fill();
    }

    function schedulePulse(now: number) {
      nextPulseAt = now + rand(PULSE_EVERY_MS[0], PULSE_EVERY_MS[1]);
    }

    function startPulse(now: number, laneIndex?: number) {
      pulse = {
        lane: laneIndex ?? Math.floor(seeded() * lanes.length),
        start: now,
      };
    }

    /** One amber streak racing its lane end-to-end, trail fading behind. */
    function drawPulse(now: number) {
      if (!pulse) {
        if (now >= nextPulseAt) startPulse(now);
        return;
      }
      const lane = lanes[pulse.lane];
      const progress = (now - pulse.start) / PULSE_DURATION_MS;
      if (progress >= 1 + PULSE_TRAIL) {
        pulse = null;
        schedulePulse(now);
        return;
      }
      drawPulseTrail(lane, progress, now);
    }

    function drawPulseTrail(lane: Lane, progress: number, now: number) {
      const head = Math.min(progress, 1);
      const tail = Math.max(progress - PULSE_TRAIL, 0);
      const fade = progress <= 1 ? 1 : 1 - (progress - 1) / PULSE_TRAIL;
      const toX = (p: number) => (lane.dir === 1 ? p : 1 - p);

      const steps = 40;
      ctx!.lineCap = "round";
      for (let i = 0; i < steps; i++) {
        const p0 = tail + ((head - tail) * i) / steps;
        const p1 = tail + ((head - tail) * (i + 1)) / steps;
        if (p1 <= p0) continue;
        const x0 = toX(p0);
        const x1 = toX(p1);
        const strength = (i + 1) / steps;
        ctx!.beginPath();
        ctx!.moveTo(x0 * width, laneY(lane, x0, now));
        ctx!.lineTo(x1 * width, laneY(lane, x1, now));
        ctx!.strokeStyle = `rgba(${SIGNAL}, ${PULSE_PEAK_ALPHA * strength * fade})`;
        ctx!.lineWidth = 1 + strength * 1.6;
        ctx!.stroke();
      }
      if (progress <= 1) {
        const hx = toX(head) * width;
        const hy = laneY(lane, toX(head), now);
        const glow = ctx!.createRadialGradient(hx, hy, 0, hx, hy, PULSE_GLOW_RADIUS);
        glow.addColorStop(0, `rgba(${SIGNAL}, 0.9)`);
        glow.addColorStop(1, `rgba(${SIGNAL}, 0)`);
        ctx!.beginPath();
        ctx!.arc(hx, hy, PULSE_GLOW_RADIUS, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      }
    }

    /**
     * The reduced-motion frame: the full field, the full depth line, and
     * one pulse frozen at 70% of a middle lane - paused, not blank.
     */
    function drawStatic() {
      const now = 0;
      ctx!.clearRect(0, 0, width, height);
      drawFurniture();
      drawLanes(now);
      for (const p of particles) {
        const lane = lanes[p.lane];
        const dim = lane.dir === -1 ? 0.55 : 1;
        ctx!.beginPath();
        ctx!.arc(p.x * width, laneY(lane, p.x, now), p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.amber
          ? `rgba(${SIGNAL}, ${p.alpha * dim})`
          : `rgba(${NOISE}, ${p.alpha * dim})`;
        ctx!.fill();
      }
      drawDepthStatic();
      drawPulseTrail(lanes[Math.floor(lanes.length / 2)], 0.7, now);
    }

    function drawDepthStatic() {
      const [lo, hi] = DEPTH_BAND;
      const bandTop = lo * height;
      const bandH = (hi - lo) * height;
      const stepW = width / (DEPTH_STEPS - 1);
      ctx!.beginPath();
      ctx!.moveTo(0, bandTop + (1 - depth[0]) * bandH);
      for (let i = 1; i < DEPTH_STEPS; i++) {
        ctx!.lineTo(i * stepW, bandTop + (1 - depth[i - 1]) * bandH);
        ctx!.lineTo(i * stepW, bandTop + (1 - depth[i]) * bandH);
      }
      ctx!.strokeStyle = `rgba(${SIGNAL}, 0.4)`;
      ctx!.lineWidth = 1.25;
      ctx!.stroke();
      ctx!.lineTo(width, bandTop + bandH);
      ctx!.lineTo(0, bandTop + bandH);
      ctx!.closePath();
      ctx!.fillStyle = `rgba(${SIGNAL}, 0.05)`;
      ctx!.fill();
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - lastFrame, 48);
      lastFrame = now;
      ctx!.clearRect(0, 0, width, height);
      drawFurniture();
      drawLanes(now);
      drawDepth(now);
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
        if (depthStart === 0) depthStart = now;
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

    const firePulse = (laneIndex?: number) => {
      if (reducedMotion || pulse) return; // one active pulse, ever
      startPulse(performance.now(), laneIndex);
    };

    const onClick = (e: MouseEvent) => {
      // Clicks on the copy or interactive elements keep their meaning.
      if ((e.target as HTMLElement).closest("h1, p, a, button")) return;
      const rect = canvas!.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const now = performance.now();
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < lanes.length; i++) {
        const d = Math.abs(laneY(lanes[i], (e.clientX - rect.left) / width, now) - y);
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

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
