# 0001 - The hard-sell journey replaces the quiet-page site

Status: accepted
Date: 2026-07-12

## Context

The existing site is a calm, editorial, light-theme portfolio built around the
organizing idea "QUIET PAGE, LIVE FINGERTIPS" (zero background motion, no
animation libraries, all personality at the fingertips).
The owner judges it bland and AI-generated-feeling.
The desired concept is the opposite: a single scroll-based journey inspired by
getcoleman.com's "less hard sell → more hard sell" axis, where the site itself
visually evolves from deliberately bad to pristine as the sell intensifies,
with wodniack.dev-grade scroll animation quality at the pristine end and no
scroll jacking anywhere.

Alternatives considered:

1. Full replacement - the journey becomes the site.
2. Journey at a side route (/story), old site stays at /.
3. Journey replaces / but /fun, /about, terminal survive unchanged.

## Decision

Full replacement.
The journey is the site.
The quiet-page organizing idea is retired; CLAUDE.md's organizing idea will be
rewritten once the journey's stages are decided.
Content in `src/content.ts` (projects, awards, experience, bio) is retained as
the single typed content source and feeds the journey's stages.

## Consequences

- The "never reintroduce background motion" and "no animation libraries in
  initial-load components" rules are void for the new design; new performance
  floors must be re-established per stage instead.
- Existing components (Cursor, Terminal, Cover, Ledger, Nav, Footer) are
  salvage candidates for the final pristine stage, not constraints.
- Each journey stage gets its own ADR file
  (`docs/adr/stage-<n>-<slug>.md`) recording that stage's design decisions.
- Old routes (/fun, /about) have no guaranteed future; their fate is a later
  decision.
