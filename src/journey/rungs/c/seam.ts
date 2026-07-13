import type { BuildArrivalSeam } from "../../types";

/*
 * The B->C seam - "motion dies first" (docs/adr/rung-c-ai-bland.md): the
 * template sanitizes the chaos piece by piece, mirroring A->B where motion
 * arrived last.
 *
 * The parallel-build contract (rungs are built concurrently in isolated
 * tasks) means this seam may treat the outgoing rung B layer ONLY as an
 * opaque root - never reach into its DOM. So the renovation is staged on
 * THIS rung's own elements: they enter wearing a chaos costume (magenta
 * wash, lime comic shout-stack, silver bevel skins, jitter transforms -
 * all explicit fromTo/set pre-states) and are sanitized beat by beat:
 *
 *   1. [0.00-0.30] Motion dies first: the chaos-costumed template fades in
 *      OVER B (C's layer stacks above B's), smothering the marquee; B's
 *      root fades out beneath once fully covered. The eager->buzzword copy
 *      crossfade IS this handoff.
 *   2. [0.28-0.46] Background: the magenta wash fades, revealing the
 *      purple->blue gradient beneath (opacity-only).
 *   3. [0.44-0.58] Text: lime -> white; mid-morph the font SNAPS to the
 *      Inter-alike and the shout drops its uppercase (discrete beats are
 *      legitimate per ADR 0002).
 *   4. [0.56-0.73] Buttons: bevel skins yield to rounded gradient pills
 *      (pure opacity swap between stacked skins), staggered per button.
 *   5. [0.70-0.84] Layout: the shout-stack's jitter transforms settle to
 *      the tidy hero grid (transform-only).
 *   6. [0.82-1.00] The emoji sub-line and the three feature cards fade in
 *      last, cards staggered.
 *
 * Rail re-dress at 0.50 (with the label re-voice, which flips at the seam
 * midpoint): gradient pill wash, rounded, soft shadow, generic sans - via
 * lazily-recorded set()s so whatever rung B left on the shared rail is
 * restored exactly on scrub-back.
 *
 * Everything is fromTo/set with immediateRender: false, normalized to a
 * total duration of exactly 1 (types.ts contract), so the reduced-motion
 * force-jump to progress 0/1 renders pure B / pure C.
 */

/**
 * Chaos-era costume values - the explicit pre-states, matched EXACTLY to
 * rung B's dress (b/dress.module.css, b/seam.ts) so the smother handoff
 * never shifts hue or voice mid-crossfade.
 */
const CHAOS = {
  lime: "#aaff00",
  font: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive',
  buttonInk: "#cc0000",
} as const;

const TEMPLATE = {
  white: "#ffffff",
} as const;

export const buildArrivalSeam: BuildArrivalSeam | null = ({
  tl,
  from,
  to,
  rail,
}) => {
  const headline = to.querySelector<HTMLElement>("[data-c-headline]");
  const subline = to.querySelector<HTMLElement>("[data-c-subline]");
  const ctas = to.querySelector<HTMLElement>("[data-c-ctas]");
  const chaosWash = to.querySelector<HTMLElement>("[data-c-chaos-wash]");
  const bevelSkins = Array.from(
    to.querySelectorAll<HTMLElement>("[data-c-skin-bevel]"),
  );
  const pillSkins = Array.from(
    to.querySelectorAll<HTMLElement>("[data-c-skin-pill]"),
  );
  const buttonLabels = Array.from(
    to.querySelectorAll<HTMLElement>("[data-c-button-label]"),
  );
  const cards = Array.from(to.querySelectorAll<HTMLElement>("[data-c-card]"));

  // "Marquee decelerates -> stops" (rung C ADR beat 1): the loop freezes at
  // the seam's very first pixel of scroll - motion dies FIRST, before the
  // smother even begins. A micro-duration attr fromTo (rung B's proven
  // engine pattern - zero-duration attr sets do not re-render their start
  // value on backward crossings), keyed on a dedicated freeze attribute so
  // B's own data-b-on / data-b-live gates stay untouched; the pause rule
  // lives beside them in b/dress.module.css. No-ops if the marquee is gone.
  const marquee = from.querySelector<HTMLElement>("[data-b-marquee]");
  if (marquee) {
    tl.fromTo(
      marquee,
      { attr: { "data-b-frozen": "" } },
      { attr: { "data-b-frozen": "1" }, duration: 0.01, immediateRender: false },
      0,
    );
  }

  // Layer crossfade first - it works even if the dress internals ever
  // change shape (then bail to plain crossfade, never a broken journey).
  tl.fromTo(
    to,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.18, ease: "none", immediateRender: false },
    0.02,
  );
  tl.fromTo(
    from,
    { autoAlpha: 1 },
    { autoAlpha: 0, duration: 0.18, ease: "none", immediateRender: false },
    0.12,
  );
  // Keep the total at exactly 1 whatever else is (not) added below.
  tl.set({}, {}, 1);

  if (
    !headline ||
    !subline ||
    !ctas ||
    !chaosWash ||
    bevelSkins.length === 0 ||
    pillSkins.length === 0 ||
    buttonLabels.length === 0 ||
    cards.length === 0
  ) {
    return;
  }

  /* -- Position 0: put the chaos costume on (reverses to the settled CSS
        truth when scrubbed back out of the seam). ------------------------- */
  tl.set(
    headline,
    {
      fontFamily: CHAOS.font,
      textTransform: "uppercase",
      color: CHAOS.lime,
      immediateRender: false,
    },
    0,
  );
  tl.set(
    headline,
    { rotate: -2.2, yPercent: 4, xPercent: -1.5, scale: 1.05, immediateRender: false },
    0,
  );
  tl.set(ctas, { rotate: 1.8, y: 10, immediateRender: false }, 0);
  tl.set(chaosWash, { opacity: 1, immediateRender: false }, 0);
  tl.set(bevelSkins, { opacity: 1, immediateRender: false }, 0);
  tl.set(pillSkins, { opacity: 0, immediateRender: false }, 0);
  tl.set(buttonLabels, { color: CHAOS.buttonInk, immediateRender: false }, 0);
  tl.set(subline, { autoAlpha: 0, immediateRender: false }, 0);
  tl.set(cards, { autoAlpha: 0, immediateRender: false }, 0);

  /* -- Beat 2: magenta -> purple->blue gradient. ------------------------- */
  tl.fromTo(
    chaosWash,
    { opacity: 1 },
    { opacity: 0, duration: 0.18, ease: "none", immediateRender: false },
    0.28,
  );

  /* -- Beat 3: text lime -> white; font + case snap mid-morph. ----------- */
  tl.fromTo(
    headline,
    { color: CHAOS.lime },
    { color: TEMPLATE.white, duration: 0.14, ease: "none", immediateRender: false },
    0.44,
  );
  tl.set(
    headline,
    { fontFamily: "", textTransform: "", immediateRender: false },
    0.51,
  );

  /* -- Rail re-dress: the gradient pill (rung C rail dress). --------------
     The rail dress protocol (see ./rail-dress.css): flip the shared
     data-rail-dress attribute from B's value to ours - B's bevel rules
     stop matching, this rung's pill rules take over, and the backward
     crossing restores "b" exactly. Micro-duration fromTo, never a set():
     zero-duration attr tweens do not re-render their start value when the
     scrubbed master crosses them backward (rung B's engine finding).
     The label COLOR rides inline, B's lime -> template white - explicit
     endpoints that chain with the neighboring seams' label tweens. */
  tl.fromTo(
    rail.root,
    { attr: { "data-rail-dress": "b" } },
    {
      attr: { "data-rail-dress": "c" },
      duration: 0.01,
      immediateRender: false,
    },
    0.5,
  );
  tl.fromTo(
    [rail.labelLess, rail.labelMore],
    { color: "#aaff00" },
    {
      color: TEMPLATE.white,
      duration: 0.06,
      ease: "none",
      immediateRender: false,
    },
    0.5,
  );

  /* -- Beat 4: bevels -> rounded gradient pills, staggered per button. --- */
  bevelSkins.forEach((skin, i) => {
    tl.fromTo(
      skin,
      { opacity: 1 },
      { opacity: 0, duration: 0.12, ease: "none", immediateRender: false },
      0.56 + i * 0.05,
    );
  });
  pillSkins.forEach((skin, i) => {
    tl.fromTo(
      skin,
      { opacity: 0 },
      { opacity: 1, duration: 0.12, ease: "none", immediateRender: false },
      0.56 + i * 0.05,
    );
  });
  buttonLabels.forEach((label, i) => {
    tl.fromTo(
      label,
      { color: CHAOS.buttonInk },
      { color: TEMPLATE.white, duration: 0.12, ease: "none", immediateRender: false },
      0.56 + i * 0.05,
    );
  });

  /* -- Beat 5: shout-stack -> tidy hero grid (transform-only settle). ---- */
  tl.fromTo(
    headline,
    { rotate: -2.2, yPercent: 4, xPercent: -1.5, scale: 1.05 },
    {
      rotate: 0,
      yPercent: 0,
      xPercent: 0,
      scale: 1,
      duration: 0.14,
      ease: "power2.out",
      immediateRender: false,
    },
    0.7,
  );
  tl.fromTo(
    ctas,
    { rotate: 1.8, y: 10 },
    { rotate: 0, y: 0, duration: 0.14, ease: "power2.out", immediateRender: false },
    0.7,
  );

  /* -- Beat 6: emoji sub-line + cards arrive last. ----------------------- */
  tl.fromTo(
    subline,
    { autoAlpha: 0, y: 12 },
    { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out", immediateRender: false },
    0.82,
  );
  cards.forEach((card, i) => {
    tl.fromTo(
      card,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out", immediateRender: false },
      0.84 + i * 0.03,
    );
  });
};
