"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BuildArrivalSeam, RailElements, RungId } from "./types";
import { JOURNEY, SEGMENTS, SPAN_VH, rungAtVh } from "./track";
import { publishJourneyProgress } from "./progress";
import { buildArrivalSeam as buildSeamA } from "./rungs/a/seam";
import { buildArrivalSeam as buildSeamB } from "./rungs/b/seam";
import { buildArrivalSeam as buildSeamC } from "./rungs/c/seam";
import { buildArrivalSeam as buildSeamD } from "./rungs/d/seam";
import { buildArrivalSeam as buildSeamE } from "./rungs/e/seam";

/*
 * The journey's engine (ADR 0002 "Engine and smoothness"). Renderless
 * client component; the DOM it drives is server-rendered by Journey.tsx.
 *
 * Native scroll is sacred: no Lenis, no wheel re-interpretation - the only
 * scroll effects anywhere are CSS-sticky pinning and the rail's
 * user-initiated smooth scrolls. Smoothness comes from scrub lag.
 *
 * "One scrubbed timeline per seam": each seam builder authors its own
 * timeline, and those are mounted as children of ONE master timeline whose
 * single scrubbed ScrollTrigger (scrub ~0.8) spans the stage's pinned
 * span. Independent per-seam scrubbed triggers were rejected on a
 * technicality: when two seams touch the same target (every layer fades in
 * during one seam, out during the next), out-of-range triggers all render
 * their clamped states on refresh in creation order - last writer wins,
 * regardless of scroll position. A master timeline seeks its children
 * strictly in playhead order, so any scroll position renders a
 * deterministic, exactly-reversible state.
 *
 * prefers-reduced-motion: seam timelines are not scrubbed at all - each is
 * force-jumped to progress 0/1 as scroll crosses the seam's midpoint, so
 * every beat collapses to its end state at a threshold (ADR 0002 global
 * constraint 3).
 */

const SEAM_BUILDERS: Record<RungId, BuildArrivalSeam | null> = {
  a: buildSeamA,
  b: buildSeamB,
  c: buildSeamC,
  d: buildSeamD,
  e: buildSeamE,
};

export default function JourneyDriver() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = document.querySelector<HTMLElement>("[data-journey-track]");
    const stage = document.querySelector<HTMLElement>("[data-journey-stage]");
    const railRoot = document.querySelector<HTMLElement>("[data-journey-rail]");
    const railInput = document.querySelector<HTMLInputElement>(
      "[data-journey-rail-input]",
    );
    const railLabelLess = document.querySelector<HTMLElement>(
      '[data-journey-rail-label="less"]',
    );
    const railLabelMore = document.querySelector<HTMLElement>(
      '[data-journey-rail-label="more"]',
    );
    if (!track || !stage || !railRoot || !railInput || !railLabelLess || !railLabelMore) {
      return;
    }
    const rail: RailElements = {
      root: railRoot,
      input: railInput,
      labelLess: railLabelLess,
      labelMore: railLabelMore,
    };

    const layerFor = (id: RungId) =>
      document.querySelector<HTMLElement>(`[data-rung-dress="${id}"]`);

    // Pinned-span px geometry, evaluated lazily so refreshes after resize
    // (and mobile URL-bar changes) re-measure. vh offsets from track.ts map
    // proportionally onto the real pinned distance.
    const trackTop = () => {
      const rect = track.getBoundingClientRect();
      return rect.top + window.scrollY;
    };
    const pxPerVh = () => (track.offsetHeight - stage.offsetHeight) / SPAN_VH;

    const publish = () => {
      const maxScroll = ScrollTrigger.maxScroll(window);
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const spanVhPos = (window.scrollY - trackTop()) / pxPerVh();
      publishJourneyProgress({
        progress: Math.min(1, Math.max(0, progress)),
        activeRung: rungAtVh(spanVhPos),
      });
    };

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        fullMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const reducedMotion = Boolean(context.conditions?.reduceMotion);

        // The single progress feed for the rail (and any future consumer).
        ScrollTrigger.create({
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          onUpdate: publish,
          onRefresh: publish,
        });

        // One timeline per seam, built by the arriving rung.
        const master = reducedMotion
          ? null
          : gsap.timeline({
              paused: true,
              defaults: { ease: "none" },
            });

        for (const rung of JOURNEY) {
          const builder = SEAM_BUILDERS[rung.id];
          const segment = SEGMENTS.find(
            (s) => s.kind === "seam" && s.rung === rung.id,
          );
          if (!builder || !segment) continue;

          const fromRung = JOURNEY[JOURNEY.findIndex((r) => r.id === rung.id) - 1];
          const from = layerFor(fromRung.id);
          const to = layerFor(rung.id);
          if (!from || !to) continue;

          // Builders author in normalized [0, 1] time (types.ts contract).
          const seam = gsap.timeline({ defaults: { ease: "none" } });
          builder({ tl: seam, from, to, stage, rail, reducedMotion });

          if (master) {
            // timeScale stretches the unit-length seam over its vh span.
            seam.timeScale(1 / (segment.endVh - segment.startVh));
            master.add(seam, segment.startVh);
          } else {
            // Reduced motion: collapse every beat to its end state when
            // scroll crosses the seam's midpoint (exactly reversible).
            seam.pause();
            const midpoint = () =>
              trackTop() +
              ((segment.startVh + segment.endVh) / 2) * pxPerVh();
            ScrollTrigger.create({
              start: midpoint,
              end: midpoint,
              invalidateOnRefresh: true,
              onEnter: () => seam.progress(1),
              onLeaveBack: () => seam.progress(0),
              onRefresh: (self) => seam.progress(self.progress > 0 ? 1 : 0),
            });
          }
        }

        if (master) {
          // Pad the master to the full pinned span so ScrollTrigger's
          // progress->time mapping matches track.ts offsets 1:1 even if the
          // last seam does not end exactly at SPAN_VH.
          master.to({}, { duration: 0 }, SPAN_VH);
          ScrollTrigger.create({
            animation: master,
            start: () => trackTop(),
            end: () => trackTop() + SPAN_VH * pxPerVh(),
            scrub: 0.8, // ADR 0002: glide comes from scrub lag, never wheel easing
            invalidateOnRefresh: true,
          });
        }
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return null;
}
