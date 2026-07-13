import type { BuildArrivalSeam } from "../../types";

/*
 * The C->D seam - "strip decoration, drain color last" (docs/adr/rung-d-safe.md):
 * emoji evaporate, the cards dissolve, pills become quiet text links, the
 * layout re-composes onto the Swiss grid, type gains real display scale,
 * and the gradient plus ALL hue drains to grayscale as the FINAL beat -
 * arriving at D is the exact moment color leaves the world. The rung D
 * task authors that beat list here (plus this rung's rail re-dress via
 * ctx.rail), normalized to [0, 1] with explicit endpoints (fromTo / set)
 * and `immediateRender: false` - see SeamContext in src/journey/types.ts.
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
