import type { RungMeta } from "../../types";

/*
 * RUNG E - PRISTINE (docs/adr/rung-e-pristine.md). STUB - the rung E task
 * implements it entirely inside this directory plus the journeyRungE block
 * in src/content.ts:
 *   - dress.tsx: the real portfolio in document flow (E.0 hero through
 *     E.6 contact), scroll-triggered reveals per section
 *   - seam.ts: the D->E climax seam - the three-act detonation
 *   - meta.ts (this file): scroll spans - tune arrivalSeamVh here, it is a
 *     local edit (the stage derives the track from these)
 */
export const meta: RungMeta = {
  id: "e",
  name: "PRISTINE",
  stage: false, // E is normal document flow after the stage unpins
  dwellVh: 0, // E flows freely; dwell is a pinned-stage concept
  // Placeholder span for the D->E detonation (three acts want more room
  // than the earlier seams). The seam's end coincides with the stage's
  // natural sticky release, so act 3's "the stage unpins" lands at the
  // seam's final beats. Rung E task tunes.
  arrivalSeamVh: 140,
};
