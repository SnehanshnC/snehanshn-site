/*
 * TEMPORARY PROTOTYPE AREA - the D->E detonation seam identity prototype
 * (docs/adr/rung-e-pristine.md "Decided: identity chosen by prototype").
 *
 * This file is the prototype's OWN copy of the pitch-block content: the
 * rung contract forbids a prototype from leaning on the journeyRungD /
 * journeyRungE blocks in src/content.ts (those belong to the live rungs).
 * The words deliberately mirror them so the captain compares identities,
 * not copy. Everything under src/journey/proto/ plus the /proto-pristine
 * route is deleted once rung E's real task adopts the winning identity.
 */

/** Rung D's professional voice - the pre-detonation scene. */
export const protoD = {
  name: ["SNEHANSHN", "CHOWDHURY"],
  role: ["Software engineer.", "Selected work below."],
  meta: { index: "·001", location: "New Jersey", year: "2026" },
} as const;

/**
 * Rung E's voice for the settled scene. The statement matches the proven
 * site statement so the Fraunces italic subset already holds the emphasis
 * word's glyphs ("wait" spells from ` -06abiklntw`).
 */
export const protoE = {
  statement: {
    pre: "I’m Snehanshn. I build systems that don’t ",
    emphasis: "wait",
    post: ".",
  },
  kicker: "Rutgers CS + Math · Founding engineer @ NovaFlow (YC S25)",
  /** The cursor pill's latency joke - its waking is act 3's LIFE beat. */
  pill: "~2ms",
} as const;

export type ProtoVariant = "night" | "paper";

export const variantLabels: Record<ProtoVariant, string> = {
  night: "night-desk",
  paper: "evolved paper",
};

/** The ground strip below the unpinned stage. */
export const protoGround = {
  line: "The seam settles here. Rung E’s portfolio unfolds from this point (rung E task).",
} as const;
