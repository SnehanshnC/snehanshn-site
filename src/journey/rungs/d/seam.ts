import type { BuildArrivalSeam } from "../../types";

/*
 * The C->D seam - "strip decoration, drain color last"
 * (docs/adr/rung-d-safe.md "Arrival seam"). Normalized [0, 1]; every beat
 * is an explicit fromTo/set with immediateRender: false, so the timeline
 * is exactly reversible under both wirings (scrubbed master timeline, and
 * the reduced-motion force-jump to progress 0/1 - types.ts).
 *
 * The C side belongs to a different task, so its beats target semantic
 * hooks that any correct AI-BLAND dress has (ADR 0002 constraint 6 keeps
 * semantics real under every costume): decorative emoji are aria-hidden
 * spans, the feature cards are list items, the pill CTAs are real
 * links/buttons. Each C-side beat no-ops harmlessly if its hook is absent.
 *
 * The color story: rung C's world is never faded out mid-seam - rung D
 * paints in OVER it (opaque #fafafa), arriving under a purple->blue veil
 * ([data-d-tint], part of this rung's dress) that keeps the template's
 * hue hanging over the recomposed Swiss grid. The veil drains as the
 * FINAL beat: arriving at D is the exact moment color leaves the world,
 * loading the spring for rung E's flood. (C's layer is tidy-hidden at the
 * very end, invisibly under the already-opaque D, purely so the browser
 * stops painting it through D's dwell.)
 */

/** Beat map - positions/durations in the seam's normalized [0, 1] time. */
const BEAT = {
  emoji: { at: 0, dur: 0.1, spread: 0.08 }, // 1. emoji evaporate
  cards: { at: 0.1, dur: 0.16, spread: 0.1 }, // 2. feature cards dissolve
  ctas: { at: 0.3, dur: 0.14 }, // 3. gradient pills fall quiet
  layer: { at: 0.42, dur: 0.26 }, // 4. Swiss world paints over the template
  pieces: { at: 0.46, dur: 0.2, spread: 0.2 }, // 4. ...and its grid settles
  type: { at: 0.6, dur: 0.26 }, // 5. display scale gains confidence
  drain: { at: 0.86, dur: 0.14 }, // 6. FINAL - all hue leaves the world
  fromHide: { at: 0.88, dur: 0.06 }, // housekeeping under opaque D
  rail: { at: 0.94, dur: 0.02 }, // the rail goes hairline as the world completes
} as const;

export const buildArrivalSeam: BuildArrivalSeam | null = ({
  tl,
  from,
  to,
  rail,
}) => {
  const emoji = Array.from(from.querySelectorAll('span[aria-hidden="true"]'));
  const cards = Array.from(from.querySelectorAll("li"));
  const ctas = Array.from(from.querySelectorAll("a, button"));
  const pieces = Array.from(to.querySelectorAll("[data-d-piece]"));
  const name = to.querySelector("[data-d-name]");
  const tint = to.querySelector("[data-d-tint]");

  // 1. Emoji evaporate - fade/pop out.
  if (emoji.length) {
    tl.fromTo(
      emoji,
      { autoAlpha: 1, scale: 1 },
      {
        autoAlpha: 0,
        scale: 0.3,
        duration: BEAT.emoji.dur,
        ease: "power1.in",
        stagger: { amount: BEAT.emoji.spread },
        immediateRender: false,
      },
      BEAT.emoji.at,
    );
  }

  // 2. The three feature cards dissolve.
  if (cards.length) {
    tl.fromTo(
      cards,
      { autoAlpha: 1, y: 0 },
      {
        autoAlpha: 0,
        y: 14,
        duration: BEAT.cards.dur,
        stagger: { amount: BEAT.cards.spread },
        immediateRender: false,
      },
      BEAT.cards.at,
    );
  }

  // 3. Gradient pills -> quiet: D has no hero links, so the CTAs simply
  // stop shouting and leave with the rest of the decoration.
  if (ctas.length) {
    tl.fromTo(
      ctas,
      { autoAlpha: 1, scale: 1 },
      {
        autoAlpha: 0,
        scale: 0.97,
        duration: BEAT.ctas.dur,
        immediateRender: false,
      },
      BEAT.ctas.at,
    );
  }

  // 4. Layout re-composes: centered template -> Swiss grid. The opaque D
  // layer fades in over C (the copy crossfade, buzzword -> professional)
  // while the five composition pieces settle - transforms only, so
  // nothing double-fades against the layer's own opacity.
  tl.fromTo(
    to,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: BEAT.layer.dur, immediateRender: false },
    BEAT.layer.at,
  );
  if (pieces.length) {
    tl.fromTo(
      pieces,
      { y: 22 },
      {
        y: 0,
        duration: BEAT.pieces.dur,
        ease: "power2.out",
        stagger: { amount: BEAT.pieces.spread },
        immediateRender: false,
      },
      BEAT.pieces.at,
    );
  }

  // 5. Type: generic sans -> confident display scale. The family snap IS
  // the layer crossfade; this beat is the scale earning its size.
  if (name) {
    tl.fromTo(
      name,
      { scale: 0.94 },
      {
        scale: 1,
        transformOrigin: "left top",
        duration: BEAT.type.dur,
        ease: "power1.out",
        immediateRender: false,
      },
      BEAT.type.at,
    );
  }

  // Housekeeping: C's layer is fully covered by now - stop painting it.
  tl.fromTo(
    from,
    { autoAlpha: 1 },
    { autoAlpha: 0, duration: BEAT.fromHide.dur, immediateRender: false },
    BEAT.fromHide.at,
  );

  // This rung's rail re-dress (hairline - see ./rail-dress.css): flip the
  // D-namespaced attribute the stylesheet keys on. Explicit NUMERIC
  // endpoints, not set(): set() captures the prior state lazily, and a
  // captured absent-attribute cannot be restored (verified: the attribute
  // stuck at "d" after scrubbing back). 0 -> 1 renders exactly "0"/"1" at
  // the endpoints in both directions; the stylesheet matches only "1", so
  // the sliver of interpolated values inside this beat's window - and the
  // "0" it leaves behind when scrubbed back out - keep the dress off.
  tl.fromTo(
    rail.root,
    { attr: { "data-rail-d": 0 } },
    {
      attr: { "data-rail-d": 1 },
      duration: BEAT.rail.dur,
      immediateRender: false,
    },
    BEAT.rail.at,
  );

  // 6. FINAL BEAT: the gradient and ALL hue drain - color leaves the
  // world exactly as D arrives. Ends at t=1 so the seam's duration maps
  // 1:1 onto its scroll span.
  if (tint) {
    tl.fromTo(
      tint,
      { autoAlpha: 1 },
      { autoAlpha: 0, duration: BEAT.drain.dur, immediateRender: false },
      BEAT.drain.at,
    );
  }
};
