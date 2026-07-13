"use client";

import { useEffect, useRef, useState } from "react";
import { readCursorWake, subscribeCursorWake } from "../wake";

/*
 * The signature: a custom cursor for hover-capable fine-pointer devices.
 * A 10px amber dot follows the pointer (rAF + lerp, weightless); over a
 * target carrying `data-cursor="label"` it morphs into a pill speaking
 * that label ("devpost ↗", "press /", "copy", "~2ms"); over plain
 * links/buttons (`data-cursor-grow` or none) it just grows a little.
 *
 * Salvaged into rung E (rung-e-pristine.md): the cursor sleeps through
 * rungs A-D and WAKES as the detonation's final LIFE beat - the wake
 * store (../wake.ts) is scrubbed by the E.0 entrance timeline, so
 * scrolling back toward D puts the dot back to sleep and the native
 * cursor returns. Its first appearance after waking is a small scale-in
 * pop: arrival as resurrection.
 *
 * Rules it never breaks:
 * - `(hover: hover) and (pointer: fine)` only - touch and keyboard users
 *   get the native experience, untouched.
 * - Focus outlines are never hidden; this is pointer-only garnish.
 * - Reduced motion: the dot still follows (snap, no lerp trail), morphs
 *   are instant (transition removed in globals.css), and the birth pop
 *   is skipped.
 * - Over text fields the dot sleeps and the native I-beam returns.
 * - The pill rides offset to the side of the pointer so it never covers
 *   the words under it.
 */

const DOT = 10; // px, resting dot diameter
const GROW = 18; // px, over unlabeled interactive targets
const PILL_H = 27; // px, labeled pill height
const PILL_PAD = 22; // px, label horizontal padding total
const PILL_GAP = 16; // px, pill offset right of the pointer
const EDGE = 4; // px, minimum clearance from the viewport's right/bottom edges
const LERP = 0.32; // per-frame catch-up fraction at 60fps

type Mode = "dot" | "grow" | "label" | "asleep";

export default function Cursor() {
  const [active, setActive] = useState(false);
  const [awakeInE, setAwakeInE] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Two effects: the first flips `active` so the pill renders at all;
  // the second wires events once the pill element exists.
  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      // The gate can only be read client-side (SSR has no matchMedia), so
      // this one deliberate post-mount setState is how the pill appears.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(true);
    }
  }, []);

  // The resurrection gate: asleep until the E.0 entrance scrubs the wake
  // store past its midpoint; scrubbing back re-sleeps it (native cursor
  // returns because the whole system unmounts, dropping the body attr).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAwakeInE(readCursorWake() >= 0.5);
    return subscribeCursorWake((value) => setAwakeInE(value >= 0.5));
  }, []);

  useEffect(() => {
    if (!active || !awakeInE) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Pointer state lives in refs mutated by events; the rAF loop reads it.
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let side = 0; // lerped 0..1: centered dot -> pill riding beside the pointer
    let sideGoal = 0;
    let mode: Mode = "dot";
    let label = "";
    let visible = false;
    let pressed = false;
    let raf = 0;
    let awake = false;
    let running = false;
    let birth = 1; // scale ramp for the resurrection pop; set to 0.35 on first appearance

    const el = pillRef.current;
    const labelEl = labelRef.current;
    if (!el || !labelEl) return;

    const applyMode = () => {
      if (!el || !labelEl) return;
      if (mode === "label") {
        labelEl.textContent = label;
        labelEl.style.opacity = "1";
        const w = labelEl.offsetWidth + PILL_PAD;
        el.style.width = `${w}px`;
        el.style.height = `${PILL_H}px`;
        sideGoal = 1;
      } else {
        labelEl.style.opacity = "0";
        const d = mode === "grow" ? GROW : DOT;
        el.style.width = `${d}px`;
        el.style.height = `${d}px`;
        sideGoal = 0;
      }
      el.style.opacity = mode === "asleep" || !visible ? "0" : "1";
      wake(); // width/sideGoal changed - the loop must run at least once
    };

    const readTarget = (t: Element | null) => {
      const labeled = t?.closest<HTMLElement>("[data-cursor]");
      if (labeled) {
        const next = labeled.dataset.cursor ?? "";
        if (mode !== "label" || label !== next) {
          mode = "label";
          label = next;
          applyMode();
        }
        return;
      }
      let next: Mode = "dot";
      if (t?.closest("input, textarea, select")) next = "asleep";
      else if (t?.closest('a, button, [role="button"], label'))
        next = "grow";
      if (next !== mode) {
        mode = next;
        applyMode();
      }
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!awake) {
        awake = true;
        document.body.setAttribute("data-cursor-awake", "");
        pos.x = target.x;
        pos.y = target.y;
        // The resurrection beat: the dot's first appearance blooms in.
        birth = reduced ? 1 : 0.35;
      }
      if (!visible) {
        visible = true;
        // Reappear under the pointer: without this snap, re-entering the
        // window after a pointerleave lerps the pill in from wherever it
        // faded out - a comet-dash across the whole page.
        pos.x = target.x;
        pos.y = target.y;
        applyMode();
      }
      readTarget(e.target as Element);
      wake();
    };

    const onOver = (e: PointerEvent) => readTarget(e.target as Element);

    const onLeave = () => {
      visible = false;
      applyMode();
    };

    const onDown = () => {
      pressed = true;
      wake(); // scale change is painted by the loop
    };
    const onUp = () => {
      pressed = false;
      wake();
    };

    const frame = () => {
      const k = reduced ? 1 : LERP;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      side += (sideGoal - side) * (reduced ? 1 : 0.25);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      // Centered when a dot; slides out to ride right of the pointer as a
      // pill so the label never sits on top of what it points at. Clamped
      // to the right/bottom viewport edges so the label stays readable on
      // narrow windows (the pill compresses toward the pointer there).
      const x = Math.min(
        pos.x - w / 2 + side * (w / 2 + PILL_GAP),
        window.innerWidth - w - EDGE
      );
      const y = Math.min(pos.y - h / 2, window.innerHeight - h - EDGE);
      birth += (1 - birth) * 0.14;
      const scale = (pressed ? 0.86 : 1) * birth;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      // Sleep when settled: once the lerp has caught up there is nothing
      // left to animate, so stop re-queueing instead of ticking forever on
      // an idle tab. Every input path below calls wake() to restart.
      if (
        Math.abs(target.x - pos.x) < 0.1 &&
        Math.abs(target.y - pos.y) < 0.1 &&
        Math.abs(sideGoal - side) < 0.01 &&
        Math.abs(1 - birth) < 0.01
      ) {
        pos.x = target.x;
        pos.y = target.y;
        side = sideGoal;
        birth = 1;
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    // Resize moves the viewport-edge clamps out from under a sleeping pill.
    const onResize = () => wake();

    applyMode();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.body.removeAttribute("data-cursor-awake");
    };
  }, [active, awakeInE]);

  if (!active || !awakeInE) return null;

  return (
    <div ref={pillRef} aria-hidden="true" className="cursor-pill font-mono">
      <span
        ref={labelRef}
        style={{ opacity: 0, transition: "opacity 0.12s ease-out" }}
      />
    </div>
  );
}
