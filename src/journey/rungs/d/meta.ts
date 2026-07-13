import type { RungMeta } from "../../types";

/*
 * RUNG D - SAFE (docs/adr/rung-d-safe.md). STUB - the rung D task
 * implements it entirely inside this directory plus the journeyRungD block
 * in src/content.ts:
 *   - dress.tsx: the Swiss editorial hero - grayscale, static, genuinely
 *     well-made (color and motion are banked for rung E)
 *   - seam.ts: the C->D seam, "strip decoration, drain color last"
 *   - meta.ts (this file): scroll spans - tune arrivalSeamVh here, it is a
 *     local edit (the stage derives the track from these)
 */
export const meta: RungMeta = {
  id: "d",
  name: "SAFE",
  stage: true,
  dwellVh: 100, // ADR: ~100vh - the quiet before the storm
  arrivalSeamVh: 60, // placeholder span for the C->D seam; rung D task tunes
};
