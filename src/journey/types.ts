/*
 * The journey's shared contract (docs/adr/0002-journey-architecture.md).
 *
 * A rung is implemented entirely inside src/journey/rungs/<id>/ plus its
 * journeyRung<Id> block in src/content.ts:
 *   - meta.ts   -> RungMeta (dwell + arrival-seam scroll spans)
 *   - dress.tsx -> the rung's visual layer (stage layer for A-D, flow for E)
 *   - seam.ts   -> BuildArrivalSeam (the prev->this beat list)
 * The stage, the rail, and the driver consume these through this contract;
 * a rung task never edits them.
 */

export type RungId = "a" | "b" | "c" | "d" | "e";

export type RungMeta = {
  id: RungId;
  /** Display name, e.g. "RAW" - used in comments/tooling only. */
  name: string;
  /**
   * True for rungs living as dress layers inside the pinned sticky stage
   * (A-D); false for rung E, which is normal document flow after the stage.
   */
  stage: boolean;
  /**
   * Scroll distance (vh units) the rung holds stable before the NEXT rung's
   * arrival seam begins. ADR-fixed dwells: A ~100, B ~75, C ~75, D ~100.
   * E flows freely: 0.
   */
  dwellVh: number;
  /**
   * Scroll distance (vh units) of this rung's ARRIVAL seam (previous rung ->
   * this rung). 0 for rung A: it has no arrival seam, it IS the opening.
   * Placeholder values are tuned by the rung's own task - this file lives in
   * the rung's directory precisely so that stays a local edit.
   */
  arrivalSeamVh: number;
};

/** The rail's live elements, exposed to seams for per-rung rail re-dress beats. */
export type RailElements = {
  /** The fixed bottom-edge wrapper. */
  root: HTMLElement;
  /** The native range input (track + thumb). */
  input: HTMLInputElement;
  labelLess: HTMLElement;
  labelMore: HTMLElement;
};

/**
 * Everything an arrival seam gets to work with. Beats are added to `tl`,
 * which the driver wires to scroll:
 *   - normal motion: scrubbed ScrollTrigger, scrub ~0.8 (ADR 0002)
 *   - prefers-reduced-motion: the timeline is force-jumped to progress 0/1
 *     when scroll crosses the seam's midpoint - beats collapse to end states
 * So beats must be exactly reversible and must not rely on running
 * tween-side effects (no onComplete state, no autonomous loops - a rung that
 * needs a self-running loop, e.g. B's marquee, owns pausing/starting it from
 * beats that behave under both wirings).
 *
 * Convention: the timeline is normalized so its FULL duration maps onto the
 * seam's whole scroll span. Author beats with position parameters in [0, 1]
 * and durations that keep the total at 1 (e.g. `tl.to(x, { duration: 0.3 }, 0.5)`).
 */
export type SeamContext = {
  tl: gsap.core.Timeline;
  /** The outgoing rung's dress root (previous rung in journey order). */
  from: HTMLElement;
  /** The arriving rung's dress root (this rung; for E, its flow root). */
  to: HTMLElement;
  /** The sticky stage element (owns rungs A-D). */
  stage: HTMLElement;
  /** Rail elements - each rung re-dresses the rail in its arrival seam. */
  rail: RailElements;
  /** True under prefers-reduced-motion (threshold wiring, see above). */
  reducedMotion: boolean;
};

export type BuildArrivalSeam = (ctx: SeamContext) => void;
