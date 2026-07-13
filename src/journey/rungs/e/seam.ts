import type { BuildArrivalSeam } from "../../types";

/*
 * The D->E seam - the three-act detonation (docs/adr/rung-e-pristine.md),
 * refined from the picked evolved-paper prototype (PR #15) per the ADR's
 * decided mechanics:
 *
 *   Act 1 - COLOR (this file). A transform-scaled, pre-painted bloom layer
 *   (paper core, amber wavefront - painted once in dress.module.css, no
 *   animated clip-path, no filters) detonates from D's name block with
 *   power4.in: warmth pools at the emphasis point, then floods the
 *   viewport. Grayscale dies underneath it. The flash then cools: the
 *   bloom fades into the body's own identical warm paper, so the stage is
 *   pristine blank sheet as it unpins - the unpin itself is invisible.
 *
 *   Act 2 - VOICE and Act 3 - LIFE live in the dress (Motion.tsx), scrubbed
 *   by E.0's own rise through the viewport: the serif statement's chars
 *   materialize from print slices inside clipped lines as the section
 *   arrives, the amber thread draws, mono labels slide in from alternating
 *   sides, and the cursor pill wakes last (../e/wake.ts). Splitting the
 *   acts across the unpin is what kills the "same statement twice" seam
 *   artifact: the stage never shows a statement, so E.0's h1 is the one
 *   and only voice moment. The ADR's ordering survives: color inside the
 *   pinned span, voice as the serif lands mid-rise, life as it settles.
 *
 * The rail takes its refined final dress here as discrete snap beats
 * (mono labels, amber accent) right as the flood peaks - legitimate snap
 * beats per ADR 0002. Everything is authored fromTo/set with
 * `immediateRender: false`, normalized to [0, 1], exactly reversible, and
 * collapses to end states under the driver's reduced-motion force-jump.
 */
export const buildArrivalSeam: BuildArrivalSeam | null = ({
  tl,
  from,
  to,
  rail,
}) => {
  // The bloom layers live in the dress (fixed, aria-hidden, CSS-hidden by
  // default so no-JS never sees them); `to` is rung E's flow root.
  const bloom = to.querySelector<HTMLElement>("[data-e-bloom]");
  const glow = to.querySelector<HTMLElement>("[data-e-glow]");

  if (bloom) {
    // Ignition: the fleck appears...
    tl.fromTo(
      bloom,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.02, immediateRender: false },
      0.04,
    );
    // ...then detonates - a point-source zoom, not a crossfade. The layer
    // is pre-painted at rest scale 1, so the end state is crisp and the
    // zoom is pure compositor work.
    tl.fromTo(
      bloom,
      { scale: 0.004 },
      { scale: 1, duration: 0.48, ease: "power4.in", immediateRender: false },
      0.06,
    );
    // The flash cools: paper fades into the body's identical paper, so
    // the world simply IS warm now. Scrubbed back, it re-ignites.
    tl.to(bloom, { autoAlpha: 0, duration: 0.22, ease: "none" }, 0.76);
  }

  if (glow) {
    // The warm lamp pooling at the detonation point - strongest while the
    // wavefront crosses the viewport, cooling away with the bloom.
    tl.fromTo(
      glow,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: "power2.in", immediateRender: false },
      0.12,
    );
    tl.to(glow, { autoAlpha: 0, duration: 0.24, ease: "power1.inOut" }, 0.74);
  }

  // Grayscale dies under the flood: D's layer fades while the opaque core
  // is passing over it, so the removal itself is never visible.
  tl.fromTo(
    from,
    { autoAlpha: 1 },
    { autoAlpha: 0, duration: 0.2, ease: "power2.in", immediateRender: false },
    0.4,
  );

  // The rail's refined final form (see ./rail-dress.css), snapped in as
  // the flood peaks (its labels re-voice at the seam midpoint via
  // activeRung, same moment). The rail dress protocol: flip the shared
  // data-rail-dress attribute from D's value to ours - D's hairline rules
  // stop matching, this rung's warm hairline + flare thumb take over, and
  // the backward crossing restores "d" exactly. Micro-duration fromTo per
  // rung B's engine finding (zero-duration attr tweens do not re-render
  // their start on backward crossings). The label color rides inline,
  // D's gray -> the paper's faint ink - the last link of the seams'
  // label-color chain.
  tl.fromTo(
    rail.root,
    { attr: { "data-rail-dress": "d" } },
    {
      attr: { "data-rail-dress": "e" },
      duration: 0.01,
      immediateRender: false,
    },
    0.5,
  );
  tl.fromTo(
    [rail.labelLess, rail.labelMore],
    { color: "#666666" },
    {
      color: "#6d6558", // --faint (GSAP color tweens want concrete endpoints)
      duration: 0.04,
      ease: "none",
      immediateRender: false,
    },
    0.5,
  );

  // Pad to 1 so the cool-down maps onto the seam's whole scroll span.
  tl.to({}, { duration: 0 }, 1);
};
