import type { RungMeta } from "../../types";

/*
 * RUNG B - KITSCH (docs/adr/rung-b-kitsch.md). Everything rung B lives in
 * this directory plus the journeyRungB block in src/content.ts:
 *   - dress.tsx: the centered shout-stack (marquee headline, bevel buttons,
 *     lime-on-magenta)
 *   - seam.ts: the A->B seam, "color first, motion last"
 *   - meta.ts (this file): scroll spans (the stage derives the track from
 *     these)
 */
export const meta: RungMeta = {
  id: "b",
  name: "KITSCH",
  stage: true,
  dwellVh: 75, // ADR: ~75vh - the visual joke reads instantly
  // Six staggered beats need room to read one at a time (~13vh each); 60
  // rushed the piece-by-piece comedy, more drags the punchline.
  arrivalSeamVh: 80,
};
