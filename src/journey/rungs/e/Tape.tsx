"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "./dress.module.css";

/*
 * The binary whisper tape (rung-e-pristine.md, delicacy menu item 9):
 * one line of market-desk archaeology above the endcap, encoding the
 * latency joke in binary. `aria-hidden` - it is texture, not content.
 * The digits flicker amber ONLY while a pointer rests on the tape
 * (hover-gated, never free-running; touch and keyboard simply see the
 * quiet tape). Encoding is charCode math - deterministic, so server and
 * client paint identical bits (hydration law); randomness exists only
 * inside pointer events, after paint.
 */
export default function Tape({ text }: { text: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef(0);

  const groups = useMemo(
    () =>
      Array.from(text).map((ch) =>
        ch.charCodeAt(0).toString(2).padStart(8, "0"),
      ),
    [text],
  );

  useEffect(() => {
    return () => window.clearInterval(timerRef.current);
  }, []);

  const stop = () => {
    window.clearInterval(timerRef.current);
    timerRef.current = 0;
    const root = rootRef.current;
    if (!root) return;
    for (const bit of root.querySelectorAll(`.${styles.tapeBitOn}`)) {
      bit.classList.remove(styles.tapeBitOn);
    }
  };

  const start = () => {
    if (timerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const bits = root.querySelectorAll<HTMLElement>("[data-tape-bit]");
    if (!bits.length) return;
    timerRef.current = window.setInterval(() => {
      const bit = bits[Math.floor(Math.random() * bits.length)];
      bit.classList.add(styles.tapeBitOn);
      window.setTimeout(() => bit.classList.remove(styles.tapeBitOn), 220);
    }, 90);
  };

  return (
    <div
      ref={rootRef}
      className={styles.tape}
      aria-hidden="true"
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      {groups.map((bits, gi) => (
        <span key={gi} className={styles.tapeGroup}>
          {Array.from(bits).map((b, bi) => (
            <span key={bi} className={styles.tapeBit} data-tape-bit>
              {b}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
