import type { RungMeta } from "../../types";

/*
 * RUNG A - RAW (docs/adr/rung-a-raw.md). Everything rung A lives in this
 * directory plus the journeyRungA block in src/content.ts:
 *   - dress.tsx: the visual layer (this rung ships real - it is the SSR
 *     default paint)
 *   - seam.ts: arrival seam - rung A has none, it IS the opening
 *   - meta.ts (this file): scroll spans
 */
export const meta: RungMeta = {
  id: "a",
  name: "RAW",
  stage: true,
  dwellVh: 100, // ADR: ~100vh of stable hold before the A->B seam
  arrivalSeamVh: 0, // no arrival seam - the journey opens here
};
