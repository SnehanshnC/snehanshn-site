import type { BuildArrivalSeam } from "../../types";

/*
 * The D->E seam - the three-act detonation (docs/adr/rung-e-pristine.md):
 *   Act 1 - COLOR: hue floods from one point outward; grayscale dies.
 *   Act 2 - VOICE: neutral sans -> editorial serif snap; copy rewrites to
 *           max hard sell.
 *   Act 3 - LIFE: micro-motion wakes, the cursor pill wakes, the stage
 *           unpins (the seam's end coincides with the sticky release -
 *           see ./meta.ts), and E.0 rises into view.
 * The rung E task authors that beat list here (plus the rail's refined
 * final dress via ctx.rail), normalized to [0, 1] with explicit endpoints
 * (fromTo / set) and `immediateRender: false` - see SeamContext in
 * src/journey/types.ts. Note `to` is rung E's FLOW root below the stage,
 * not a stage layer - it is already visible in document flow (SSR/SEO)
 * and must never default to hidden.
 *
 * STUB: the outgoing stage dress fades late in the seam so the stage
 * hands the viewport to E's flowing content as it unpins.
 */
export const buildArrivalSeam: BuildArrivalSeam | null = ({ tl, from }) => {
  tl.fromTo(
    from,
    { autoAlpha: 1 },
    { autoAlpha: 0, duration: 0.4, ease: "none", immediateRender: false },
    0.6,
  );
};
