import type { BuildArrivalSeam } from "../../types";

/*
 * The A->B seam - "color first, motion last" (docs/adr/rung-b-kitsch.md):
 * the fictional author discovers powers one at a time. Beats 1-4 renovate
 * rung A's OWN dress (the timid copy gets kitsch-dressed in place - rung A
 * shipped final in phase 1, so its DOM is a stable target); beat 5 is the
 * layer crossfade that swaps the copy itself; beat 6, the punchline, is
 * the only motion.
 *
 * Every beat is an explicit fromTo/set with immediateRender: false, so the
 * timeline behaves identically under both driver wirings (scrubbed master,
 * and the reduced-motion 0/1 force-jump - see SeamContext in
 * src/journey/types.ts). The one running loop (the marquee) is CSS-owned;
 * this timeline only flips its gate attribute, and skips even that under
 * reduced motion (the marquee must be STATIC - never loops).
 *
 * The scale-punch version of "bevels pop" was dropped on purpose: a fromTo
 * overshoot (1.14 -> 1) parks the overshoot value when scrubbed back below
 * the beat, and a set+to pair reintroduces recorded-start coupling. The
 * hard snap IS the pop, and it is exactly reversible for free.
 */

/** Beat map, normalized over the seam's [0, 1] span (meta.arrivalSeamVh). */
const BEAT = {
  flood: { at: 0.0, dur: 0.2 }, // 1. the background floods magenta
  lime: { at: 0.2, dur: 0.16 }, // 2a. text discovers color (rail labels ride along)
  inflate: { at: 0.3 }, // 2b. ...then font size/family/shadow (snap)
  center: { at: 0.44 }, // 3. top-left -> dead center (layout snap)
  bevel: { at: 0.56 }, // 4. bevels pop - proto-buttons + the rail's chrome (snap)
  swap: { at: 0.68, dur: 0.2 }, // 5. copy crossfades timid -> eager (B in over A)
  fromOff: { at: 0.92 }, // A fully under opaque B: release the layer
  lurch: { at: 0.96 }, // 6. the marquee wakes - motion arrives LAST
} as const;

const MAGENTA = "#ff00cc";
const LIME = "#aaff00";
const CYAN = "#00ffff";
/** --ink: what the rail labels inherit at rung A (explicit reverse endpoint). */
const INK = "#211d16";
const COMIC = '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive';

export const buildArrivalSeam: BuildArrivalSeam | null = ({
  tl,
  from,
  to,
  rail,
  reducedMotion,
}) => {
  // Rung A's dress root (owns the white background) and its five timid
  // lines; the last two ("email me...", "my projects...") are the plain
  // text lines beat 4 dresses as proto-buttons.
  const aRoot = from.querySelector<HTMLElement>(":scope > div");
  const aLines = Array.from(from.querySelectorAll<HTMLElement>("p"));
  const aButtonish = aLines.slice(-2);
  const marquee = to.querySelector<HTMLElement>("[data-b-marquee]");
  const railLabels = [rail.labelLess, rail.labelMore];

  // 1. Background: white -> #ff00cc floods (paint-only tween, solid fill).
  if (aRoot) {
    tl.fromTo(
      aRoot,
      { backgroundColor: "#ffffff" },
      {
        backgroundColor: MAGENTA,
        duration: BEAT.flood.dur,
        immediateRender: false,
      },
      BEAT.flood.at,
    );
  }

  // 2a. Text: black -> lime (the rail's pole labels turn with it).
  if (aLines.length) {
    tl.fromTo(
      aLines,
      { color: "#000000" },
      { color: LIME, duration: BEAT.lime.dur, immediateRender: false },
      BEAT.lime.at,
    );
  }
  tl.fromTo(
    railLabels,
    { color: INK },
    { color: LIME, duration: BEAT.lime.dur, immediateRender: false },
    BEAT.lime.at,
  );

  // 2b. ...and size inflates - font discovery is discrete in real life, so
  // it snaps (ADR 0002: layout-affecting properties only as snap beats).
  if (aLines.length) {
    tl.set(
      aLines,
      {
        fontFamily: COMIC,
        fontSize: "clamp(20px, 4.5vw, 34px)",
        fontWeight: 700,
        textShadow: `3px 3px 0 ${CYAN}`,
        immediateRender: false,
      },
      BEAT.inflate.at,
    );
  }

  // 3. Alignment: top-left -> dead center ("discovered the center tag").
  if (aRoot) {
    tl.set(
      aRoot,
      {
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        textAlign: "center",
        padding: "24px",
        immediateRender: false,
      },
      BEAT.center.at,
    );
  }

  // 4. Buttons: plain text lines -> 3D bevels pop (snap), and the rail's
  // bevel-kitsch chrome flips on the same beat (data-rail-dress keys the
  // attribute-scoped rules in dress.module.css - later rungs overwrite the
  // value; GSAP attr reversal restores "b" on scroll-back).
  //
  // Attribute flips are micro-duration fromTo tweens, NOT zero-duration
  // sets, on purpose: a zero-duration AttrPlugin tween does not re-render
  // its start value when the scrubbed master crosses it backward (verified
  // in-browser - the attribute stayed flipped all the way back to rung A),
  // while CSS-plugin sets reverse fine. A ~1%-span duration makes the
  // backward crossing render ratio 0 and restore the explicit "" start;
  // forward, a no-number string tween renders its end value from the first
  // tick, so the flip still reads as a snap.
  if (aButtonish.length) {
    tl.set(
      aButtonish,
      {
        width: "fit-content",
        padding: "10px 24px",
        border: "4px outset #e3e3e3",
        borderRadius: "3px",
        background: "linear-gradient(180deg, #fdfdfd, #b0b0b0)",
        color: "#cc0000",
        textShadow: "1px 1px 0 #ffffff",
        fontSize: "clamp(17px, 2vw, 21px)",
        immediateRender: false,
      },
      BEAT.bevel.at,
    );
  }
  tl.fromTo(
    rail.root,
    { attr: { "data-rail-dress": "" } },
    {
      attr: { "data-rail-dress": "b" },
      duration: 0.01,
      immediateRender: false,
    },
    BEAT.bevel.at,
  );

  // 5. Copy swaps timid -> eager: B fades in OVER still-opaque A (no
  // half-transparent dip), then A's layer is released once fully covered.
  tl.fromTo(
    to,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: BEAT.swap.dur, immediateRender: false },
    BEAT.swap.at,
  );
  tl.set(from, { autoAlpha: 0, immediateRender: false }, BEAT.fromOff.at);

  // 6. The headline lurches into marquee motion - the punchline. Skipped
  // under reduced motion: the strip stays a static wrapped shout.
  if (!reducedMotion && marquee) {
    tl.fromTo(
      marquee,
      { attr: { "data-b-on": "" } },
      { attr: { "data-b-on": "on" }, duration: 0.01, immediateRender: false },
      BEAT.lurch.at,
    );
  }

  // Pad to exactly 1 so the driver's timeScale maps beat positions onto the
  // seam's full vh span (types.ts convention).
  tl.to({}, { duration: 0 }, 1);
};
