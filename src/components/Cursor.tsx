"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The signature: a custom cursor for hover-capable fine-pointer devices.
 * A 10px amber dot follows the pointer (rAF + lerp, weightless); over a
 * target carrying `data-cursor="label"` it morphs into a pill speaking
 * that label ("devpost ↗", "press /", "copy", "~2ms"); over plain
 * links/buttons (`data-cursor-grow` or none) it just grows a little.
 *
 * Rules it never breaks:
 * - `(hover: hover) and (pointer: fine)` only - touch and keyboard users
 *   get the native experience, untouched.
 * - Focus outlines are never hidden; this is pointer-only garnish.
 * - Reduced motion: the dot still follows (snap, no lerp trail) and
 *   morphs are instant (transition removed in globals.css).
 * - Over text fields the dot sleeps and the native I-beam returns.
 * - The pill rides offset to the side of the pointer so it never covers
 *   the words under it.
 */

const DOT = 10; // px, resting dot diameter
const GROW = 18; // px, over unlabeled interactive targets
const PILL_H = 27; // px, labeled pill height
const PILL_PAD = 22; // px, label horizontal padding total
const PILL_GAP = 16; // px, pill offset right of the pointer
const LERP = 0.32; // per-frame catch-up fraction at 60fps

type Mode = "dot" | "grow" | "label" | "asleep";

export default function Cursor() {
  const [active, setActive] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Two effects: the first flips `active` so the pill renders at all;
  // the second wires events once the pill element exists.
  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (!active) return;

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
      }
      if (!visible) {
        visible = true;
        applyMode();
      }
      readTarget(e.target as Element);
    };

    const onOver = (e: PointerEvent) => readTarget(e.target as Element);

    const onLeave = () => {
      visible = false;
      applyMode();
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    const frame = () => {
      const k = reduced ? 1 : LERP;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      side += (sideGoal - side) * (reduced ? 1 : 0.25);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      // Centered when a dot; slides out to ride right of the pointer as a
      // pill so the label never sits on top of what it points at.
      const x = pos.x - w / 2 + side * (w / 2 + PILL_GAP);
      const y = pos.y - h / 2;
      const scale = pressed ? 0.86 : 1;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(frame);
    };

    applyMode();
    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.body.removeAttribute("data-cursor-awake");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={pillRef} aria-hidden="true" className="cursor-pill font-mono">
      <span
        ref={labelRef}
        style={{ opacity: 0, transition: "opacity 0.12s ease-out" }}
      />
    </div>
  );
}
