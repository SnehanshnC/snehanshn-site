import type { BuildArrivalSeam } from "../../types";

/*
 * The A->B seam - "color first, motion last" (docs/adr/rung-b-kitsch.md):
 * background floods magenta, text goes lime and inflates, alignment snaps
 * to center, bevels pop, copy crossfades timid->eager, and the marquee
 * lurches into motion LAST, as the punchline. The rung B task authors that
 * beat list here (plus this rung's rail re-dress via ctx.rail), normalized
 * to [0, 1] with explicit endpoints (fromTo / set) and
 * `immediateRender: false` - see SeamContext in src/journey/types.ts.
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
