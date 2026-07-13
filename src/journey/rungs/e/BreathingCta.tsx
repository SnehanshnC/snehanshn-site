"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./dress.module.css";

/*
 * The close's primary ask (rung-e-pristine.md E.6 + delicacy menu item 7):
 * it BREATHES - a slow heartbeat scale, in-view only, never under reduced
 * motion - and answers hover/keyboard focus with a one-shot budgeted
 * hairline ripple (three flare outlines, CSS keyframes, ~1.3s, then
 * still). Wodniack's GO detonation translated to paper volume.
 *
 * The enormous email CTA renders once contact.email is real (`#todo`
 * links are never rendered - repo law). Until then the ask stays honest:
 * the terminal doorway, full size - `sudo hire-me` is a real command.
 */
export default function BreathingCta({
  emailHref,
  emailLabel,
}: {
  emailHref?: string;
  emailLabel: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const rippleTimer = useRef(0);
  const [breathing, setBreathing] = useState(false);
  const [rippling, setRippling] = useState(false);

  // The breath runs only while the close is actually on screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => setBreathing(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(rippleTimer.current);
  }, []);

  const ripple = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRippling(false);
    // Restart cleanly on re-entry: next frame re-adds the class.
    requestAnimationFrame(() => setRippling(true));
    window.clearTimeout(rippleTimer.current);
    rippleTimer.current = window.setTimeout(() => setRippling(false), 1500);
  };

  const className = `${styles.cta} ${breathing ? styles.ctaBreathing : ""} ${
    rippling ? styles.rippling : ""
  }`;
  const rings = (
    <>
      <span aria-hidden="true" className={styles.ring} />
      <span aria-hidden="true" className={styles.ring} />
      <span aria-hidden="true" className={styles.ring} />
    </>
  );

  if (emailHref) {
    return (
      <span ref={wrapRef}>
        <a
          href={emailHref}
          data-cursor="email ↗"
          className={className}
          onPointerEnter={ripple}
          onFocus={ripple}
        >
          {rings}
          {emailLabel}
        </a>
      </span>
    );
  }

  return (
    <span ref={wrapRef}>
      <button
        type="button"
        data-cursor="press /"
        title="open the terminal"
        className={className}
        onClick={() => window.dispatchEvent(new Event("terminal:open"))}
        onPointerEnter={ripple}
        onFocus={ripple}
      >
        {rings}
        press <span className="text-signal">/</span>
      </button>
    </span>
  );
}
