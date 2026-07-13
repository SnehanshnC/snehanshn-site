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
  skins: { at: 0.3, dur: 0.08 }, // 3a. pill chrome dies -> quiet text links...
  ctas: { at: 0.36, dur: 0.14 }, // 3b. ...which leave with the decoration
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
  // Decorative emoji only: rung C's aria-hidden BUTTON SKINS (stacked
  // bevel/pill paint layers) also match a bare span[aria-hidden], and
  // evaporating them stripped the pills at the seam's opening pixel
  // (integration finding) - the :not()s keep this a no-op change for any
  // dress without those hooks.
  const emoji = Array.from(
    from.querySelectorAll(
      'span[aria-hidden="true"]:not([data-c-skin-bevel]):not([data-c-skin-pill])',
    ),
  );
  const cards = Array.from(from.querySelectorAll("li"));
  const skins = Array.from(from.querySelectorAll("[data-c-skin-pill]"));
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

  // 3a. Gradient pills -> quiet text links (the ADR's beat, now targetable
  // against rung C's real skin layers): the pill chrome fades off first...
  if (skins.length) {
    tl.fromTo(
      skins,
      { opacity: 1 },
      {
        opacity: 0,
        duration: BEAT.skins.dur,
        ease: "none",
        immediateRender: false,
      },
      BEAT.skins.at,
    );
  }

  // 3b. ...then the quiet links leave with the rest of the decoration
  // (D has no hero links to become).
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
  // shared data-rail-dress attribute from C's value to ours (the rail
  // dress protocol - one attribute, one owner per scroll position).
  // Explicit fromTo endpoints, not set(): set() captures the prior state
  // lazily, and a captured value cannot be trusted across the reduced-
  // motion force-jump wiring; a micro-duration fromTo renders exactly
  // "c"/"d" at its endpoints in both scrub directions (rung B's engine
  // finding). The label color rides inline alongside, template white ->
  // D's gray - chaining with the neighbor seams' label tweens.
  tl.fromTo(
    rail.root,
    { attr: { "data-rail-dress": "c" } },
    {
      attr: { "data-rail-dress": "d" },
      duration: BEAT.rail.dur,
      immediateRender: false,
    },
    BEAT.rail.at,
  );
  tl.fromTo(
    [rail.labelLess, rail.labelMore],
    { color: "#ffffff" },
    {
      color: "#666666",
      duration: BEAT.rail.dur,
      ease: "none",
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
