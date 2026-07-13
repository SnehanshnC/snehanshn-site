import type { RungMeta } from "../../types";

/*
 * RUNG D - SAFE (docs/adr/rung-d-safe.md). Everything rung D lives in this
 * directory plus the journeyRungD block in src/content.ts:
 *   - dress.tsx: the Swiss editorial hero - grayscale, static, genuinely
 *     well-made (color and motion are banked for rung E)
 *   - seam.ts: the C->D seam, "strip decoration, drain color last"
 *   - meta.ts (this file): scroll spans
 */
export const meta: RungMeta = {
  id: "d",
  name: "SAFE",
  stage: true,
  dwellVh: 100, // ADR: ~100vh - the quiet before the storm
  /*
   * The C->D renovation is the journey's longest beat list (strip x3,
   * recompose, type, drain): 90vh gives the staggered strip room to read
   * beat by beat and keeps the final hue drain its own distinct movement
   * instead of a tail flicker.
   */
  arrivalSeamVh: 90,
};
