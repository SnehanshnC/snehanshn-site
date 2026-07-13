"use client";

import type { ReactNode } from "react";
import { SPAN_VH, seamSegment } from "../../track";

/*
 * [Learn more] - the template CTA that literally means "keep scrolling"
 * (docs/adr/rung-c-ai-bland.md "Buttons"). It smooth-scrolls the journey
 * forward to the start of the C->D seam, nudged 10% in so the departure
 * visibly begins. User-initiated, so never scroll jacking (ADR 0002);
 * instant under prefers-reduced-motion, mirroring the rail's rule.
 *
 * Geometry comes read-only from track.ts (the single source of truth) and
 * the driver's own px-per-vh mapping: the pinned span in px is the track
 * height minus one stage height. Client component so the dress itself can
 * stay server-rendered markup.
 */
export default function LearnMoreButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const onClick = () => {
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";

    const track = document.querySelector<HTMLElement>("[data-journey-track]");
    const stage = document.querySelector<HTMLElement>("[data-journey-stage]");
    const seam = seamSegment("d");
    if (!track || !stage || !seam) {
      // Degraded fallback (should not happen): still move the journey on.
      window.scrollBy({ top: window.innerHeight, behavior });
      return;
    }

    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const pxPerVh = (track.offsetHeight - stage.offsetHeight) / SPAN_VH;
    const targetVh = seam.startVh + 0.1 * (seam.endVh - seam.startVh);
    window.scrollTo({ top: trackTop + targetVh * pxPerVh, behavior });
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
