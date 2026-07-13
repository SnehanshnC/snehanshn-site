import type { RungMeta } from "../../types";

/*
 * RUNG B - KITSCH (docs/adr/rung-b-kitsch.md). STUB - the rung B task
 * implements it entirely inside this directory plus the journeyRungB block
 * in src/content.ts:
 *   - dress.tsx: the centered shout-stack (marquee headline, bevel buttons,
 *     lime-on-magenta)
 *   - seam.ts: the A->B seam, "color first, motion last"
 *   - meta.ts (this file): scroll spans - tune arrivalSeamVh here, it is a
 *     local edit (the stage derives the track from these)
 */
export const meta: RungMeta = {
  id: "b",
  name: "KITSCH",
  stage: true,
  dwellVh: 75, // ADR: ~75vh - the visual joke reads instantly
  arrivalSeamVh: 60, // placeholder span for the A->B seam; rung B task tunes
};
