import type { BuildArrivalSeam } from "../../types";

/*
 * The B->C seam - "motion dies first" (docs/adr/rung-c-ai-bland.md): the
 * marquee decelerates to a stop, magenta yields to the purple->blue
 * gradient, type snaps to the Inter-alike, bevels become pills, the
 * shout-stack tidies into the hero grid, and the emoji cards fade in last.
 * The rung C task authors that beat list here (plus this rung's rail
 * re-dress via ctx.rail), normalized to [0, 1] with explicit endpoints
 * (fromTo / set) and `immediateRender: false` - see SeamContext in
 * src/journey/types.ts.
 *
 * STUB: a plain crossfade so the scaffold scrolls end to end.
 */
export const buildArrivalSeam: BuildArrivalSeam | null = ({ tl, from, to }) => {
  tl.fromTo(
    from,
    { autoAlpha: 1 },
    { autoAlpha: 0, duration: 1, ease: "none", immediateRender: false },
    0,
  );
  tl.fromTo(
    to,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 1, ease: "none", immediateRender: false },
    0,
  );
};
