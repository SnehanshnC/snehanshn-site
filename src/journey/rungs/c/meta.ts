import type { RungMeta } from "../../types";

/*
 * RUNG C - AI-BLAND (docs/adr/rung-c-ai-bland.md). STUB - the rung C task
 * implements it entirely inside this directory plus the journeyRungC block
 * in src/content.ts:
 *   - dress.tsx: gradient hero + three emoji feature cards, pill buttons
 *     (the journey's first WORKING interactions: mailto + smooth-scroll)
 *   - seam.ts: the B->C seam, "motion dies first"
 *   - meta.ts (this file): scroll spans - tune arrivalSeamVh here, it is a
 *     local edit (the stage derives the track from these)
 */
export const meta: RungMeta = {
  id: "c",
  name: "AI-BLAND",
  stage: true,
  dwellVh: 75, // ADR: ~75vh - the card row carries the joke instantly
  arrivalSeamVh: 60, // placeholder span for the B->C seam; rung C task tunes
};
