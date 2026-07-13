import type { RungMeta } from "../../types";

/*
 * RUNG E - PRISTINE (docs/adr/rung-e-pristine.md): the Great Pole, the
 * real portfolio. Implemented entirely inside this directory plus the
 * journeyRungE block in src/content.ts:
 *   - dress.tsx: the full portfolio in document flow (E.0 hero through
 *     the endcap), server-rendered; Motion.tsx drives its reveals
 *   - seam.ts: the D->E detonation's COLOR act + the rail's final dress
 *   - meta.ts (this file): scroll spans
 */
export const meta: RungMeta = {
  id: "e",
  name: "PRISTINE",
  stage: false, // E is normal document flow after the stage unpins
  dwellVh: 0, // E flows freely; dwell is a pinned-stage concept
  // The COLOR act needs exactly this: ignition, power4.in flood, cool-down
  // to blank paper. Voice and life ride E.0's own 100vh rise AFTER the
  // unpin (see seam.ts), so the pinned span stays tight - a longer span
  // here would be dead scroll on an empty sheet.
  arrivalSeamVh: 100,
};
