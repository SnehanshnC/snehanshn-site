import type { RungId, RungMeta } from "./types";
import { meta as rungA } from "./rungs/a/meta";
import { meta as rungB } from "./rungs/b/meta";
import { meta as rungC } from "./rungs/c/meta";
import { meta as rungD } from "./rungs/d/meta";
import { meta as rungE } from "./rungs/e/meta";

/*
 * The journey's scroll geometry - the single source of truth (ADR 0002).
 *
 * Native scroll is the only input. The CSS-sticky stage, the rail, and
 * every seam timeline all read the same native scroll position mapped
 * through this segment table; nothing else may define journey offsets.
 * The numbers themselves live in each rung's meta.ts, so a rung task tunes
 * its spans without touching this file.
 *
 * Layout: [dwell A][seam A->B][dwell B][seam B->C][dwell C][seam C->D]
 * [dwell D][seam D->E], all inside the pinned span of the sticky stage.
 * The track is one viewport taller than the pinned span, so the stage's
 * natural sticky release lands exactly at the end of the D->E seam - the
 * detonation's act 3 "the stage unpins" (~87% of the track with the
 * placeholder seam spans; ADR 0002 sketches ~80%, rung tasks tune).
 */

/** Journey order - declared exactly once. */
export const JOURNEY: readonly RungMeta[] = [rungA, rungB, rungC, rungD, rungE];

/** The rungs dressed as layers inside the pinned stage (A-D). */
export const STAGE_RUNGS: readonly RungMeta[] = JOURNEY.filter((r) => r.stage);

export type Segment = {
  kind: "dwell" | "seam";
  /** The rung dwelling - or, for a seam, the rung being ARRIVED at. */
  rung: RungId;
  /** Offsets in vh units from the start of the pinned span. */
  startVh: number;
  endVh: number;
};

export const SEGMENTS: readonly Segment[] = (() => {
  const segments: Segment[] = [];
  let cursor = 0;
  for (const rung of JOURNEY) {
    if (rung.arrivalSeamVh > 0) {
      segments.push({
        kind: "seam",
        rung: rung.id,
        startVh: cursor,
        endVh: cursor + rung.arrivalSeamVh,
      });
      cursor += rung.arrivalSeamVh;
    }
    if (rung.stage && rung.dwellVh > 0) {
      segments.push({
        kind: "dwell",
        rung: rung.id,
        startVh: cursor,
        endVh: cursor + rung.dwellVh,
      });
      cursor += rung.dwellVh;
    }
  }
  return segments;
})();

/** Total pinned scroll span in vh units: every dwell plus every seam. */
export const SPAN_VH = SEGMENTS[SEGMENTS.length - 1].endVh;

/**
 * The scroll track's CSS height: pinned span + one viewport for the sticky
 * stage itself (a 100vh-tall sticky element in a track of height H pins for
 * exactly H - 100vh of scroll).
 */
export const TRACK_VH = SPAN_VH + 100;

export function seamSegment(rung: RungId): Segment | undefined {
  return SEGMENTS.find((s) => s.kind === "seam" && s.rung === rung);
}

/**
 * Which rung "owns" a given position on the pinned span (drives the rail's
 * label voice). A rung takes over at its arrival seam's midpoint; past the
 * span's end the journey is rung E's.
 */
export function rungAtVh(vh: number): RungId {
  let active: RungId = JOURNEY[0].id;
  for (const segment of SEGMENTS) {
    if (segment.kind === "dwell") {
      if (vh >= segment.startVh) active = segment.rung;
    } else {
      if (vh >= (segment.startVh + segment.endVh) / 2) active = segment.rung;
    }
  }
  return active;
}
