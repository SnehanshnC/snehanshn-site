"use client";

import { useEffect, useRef, useState } from "react";
import {
  journeyShared,
  journeyRungA,
  journeyRungB,
  journeyRungC,
  journeyRungD,
  journeyRungE,
  type RailLabels,
} from "@/content";
import type { RungId } from "./types";
import { subscribeJourneyProgress } from "./progress";
import styles from "./Rail.module.css";

/*
 * The progress rail - the journey's primary navigation (ADR 0002).
 *
 * A native <input type="range"> carries the whole accessibility contract:
 * slider semantics, keyboard operation, and percentage announcements for
 * free - and its UA-default look IS rung A's rail dress. Shared scaffold:
 * rung tasks re-dress it from their seams (SeamContext.rail) and re-voice
 * the pole labels from their content block's `rail` field - never here.
 *
 * Scrub rules (ADR: click/drag smooth-scrolls there - user-initiated, so
 * never scroll jacking; the scrollbar never lies):
 *   - keyboard -> smooth scroll (instant under prefers-reduced-motion)
 *   - pointer drag -> continuous instant scrub (the page tracks the thumb)
 *   - pointer click without drag -> smooth scroll
 * Between interactions the thumb follows the progress store; it never
 * fights the user's pointer.
 */

const RAIL_MAX = 100;

const LABELS: Record<RungId, RailLabels> = {
  a: journeyRungA.rail,
  b: journeyRungB.rail,
  c: journeyRungC.rail,
  d: journeyRungD.rail,
  e: journeyRungE.rail,
};

export default function Rail() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeRung, setActiveRung] = useState<RungId>("a");
  // Pointer-interaction state. Refs, not state: none of it should re-render.
  const pointerDown = useRef(false);
  const dragged = useRef(false);
  const pendingValue = useRef<number | null>(null);

  useEffect(() => {
    return subscribeJourneyProgress(({ progress, activeRung: rung }) => {
      setActiveRung(rung);
      if (!pointerDown.current && inputRef.current) {
        inputRef.current.value = String(Math.round(progress * RAIL_MAX));
      }
    });
  }, []);

  const scrollToValue = (value: number, smooth: boolean) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: (value / RAIL_MAX) * maxScroll,
      behavior: smooth && !reduceMotion ? "smooth" : "auto",
    });
  };

  const labels = LABELS[activeRung];

  return (
    <nav
      aria-label={journeyShared.railLandmarkLabel}
      data-journey-rail
      data-rung={activeRung}
      className={styles.root}
    >
      <div className={styles.labels} aria-hidden="true">
        <span data-journey-rail-label="less">{labels.less}</span>
        <span data-journey-rail-label="more">{labels.more}</span>
      </div>
      <input
        ref={inputRef}
        data-journey-rail-input
        className={styles.input}
        type="range"
        min={0}
        max={RAIL_MAX}
        step={1}
        defaultValue={0}
        aria-label={journeyShared.railAriaLabel}
        onPointerDown={() => {
          pointerDown.current = true;
          dragged.current = false;
          pendingValue.current = null;
        }}
        onPointerMove={(event) => {
          if (!pointerDown.current || event.buttons === 0) return;
          dragged.current = true;
          if (pendingValue.current !== null) {
            scrollToValue(pendingValue.current, false);
            pendingValue.current = null;
          }
        }}
        onInput={(event) => {
          const value = Number(event.currentTarget.value);
          if (!pointerDown.current) {
            // Keyboard (or assistive tech) - always smooth.
            scrollToValue(value, true);
          } else if (dragged.current) {
            // Mid-drag - track the thumb instantly.
            scrollToValue(value, false);
          } else {
            // First jump after pointerdown: hold it until we know whether
            // this is a click (smooth on release) or a drag (instant).
            pendingValue.current = value;
          }
        }}
        onPointerUp={() => {
          if (!dragged.current && pendingValue.current !== null) {
            scrollToValue(pendingValue.current, true);
          }
          pointerDown.current = false;
          pendingValue.current = null;
        }}
        onPointerCancel={() => {
          pointerDown.current = false;
          pendingValue.current = null;
        }}
      />
    </nav>
  );
}
