# Rung E - PRISTINE (website 5 of 5)

Status: character accepted; open items below
Date: 2026-07-12
Self-contained brief: an agent building this rung should need only this file.

## Character

The Great Pole - the real portfolio.
Editorial craft, wodniack.dev-grade scroll motion (open-source reference: github.com/AntoineW/AW-2025-Portfolio), Coleman swagger.
Copy voice: max hard sell.

## Content - section order (decided)

- E.0 statement hero (max-sell sentence)
- E.1 portrait / who i am
- E.2 projects (sticky showcase)
- E.3 experience
- E.4 awards
- E.5 hobbies
- E.6 contact (the close)

Persuasion arc: the journey just proved the craft -> meet the human -> strongest evidence -> career backbone -> trophy case -> humanity -> the ask.
All data comes typed from `src/content.ts` (projects with ticker/metric/awards/link, wins, experience, bio already exist there).

## Projects - sticky showcase with plug-and-play media slots (decided)

Each project gets a full-viewport-ish sticky moment: title/ticker/metric/award copy on one side, a media slot on the other; the next project slides up over it.
The media slot is BLANK plug-and-play: a tasteful placeholder (wash panel) carrying a `// TODO(snehanshn): real screenshot` marker, sized and framed so a real screenshot/video drops in as a single-file edit.
The old deterministic SVG cover-motif system is NOT revived for these slots.
Scroll drives the showcase (wodniack-style reveals), never hijacks it.

## Salvaged components (decided)

Returning at E only:
- Cursor pill - the talking amber cursor (desktop fine-pointer only, as before). It WAKES during the D->E seam - its arrival is itself a resurrection beat.
- Terminal + press "/" - E's easter egg; nav doorway + footer hint; stays dark regardless of identity choice.
- Ledger + Sparkline - mono experience ledger furniture for E.3, sparkline available for hobbies/currently.

## Section treatments (decided)

- E.1 portrait / who i am - words lead: a modest framed portrait beside real bio paragraphs. Deliberately underplayed after the climax; the writing carries the section. (Full-bleed and editorial-split treatments rejected.)
- E.3 experience - salvaged mono Ledger as the backbone.
- E.4 awards - big-type honor roll: each win one huge serif line (placement + event + year, tabular mono numbers), staggering in on scroll; a "N wins and counting" ticker. The terminal's `cat awards` remains the mirror easter egg. (Tile wall and single-counter flex rejected - grids belong to C/D, and recruiters want the list.)
- E.5 hobbies - photo dump + currently strip + micro-toys: a loose photo-dump grid (plug-and-play TODO slots like the project media slots), the "currently" strip with the salvaged Sparkline, AND small per-hobby interactive micro-toys (e.g. a strummable string, a playable chess move). Scope caution: each toy is bespoke; build them last, cut freely - the section must stand without them.
- E.6 contact - full Coleman close: a huge final statement in the site's voice ("You've seen the glow-up. Imagine what I'd do for you." energy), one enormous email CTA, socials in mono (github = github.com/SnehanshnC, linkedin, x). Email and socials only - NEVER phone or street address (privacy rule). As the close enters, the rail's marker finally rests at "more hard sell" - the axis completes as the page ends.

## Position in the journey

Begins when the pinned stage (rungs A-D) unpins; E is normal document flow with scroll-triggered reveals per section (GSAP ScrollTrigger, scrub or toggle per moment).

## Arrival seam (D -> E) - three-act detonation (decided)

The climax seam, scrubbed:

- Act 1 - COLOR: hue floods from one point outward; grayscale dies.
- Act 2 - VOICE: neutral sans -> editorial serif snap; copy rewrites from professional to max hard sell.
- Act 3 - LIFE: micro-motion wakes everywhere (chars settle, elements ease), the cursor pill wakes, the stage unpins, and E.0 rises into view.

D deliberately banked two absences (color, motion); the seam spends them as separate payoffs, with voice between them.

## Rail dress

The rail in its refined final form; at journey end the marker rests at "more hard sell".

## Global constraints (restated)

- Native scroll only; no wheel/touch re-interpretation; smoothness via `scrub: ~0.8`.
- Mobile first-class at 390px; tap targets >= 44px.
- prefers-reduced-motion: reveals collapse to visible end states; page reads complete and static.
- Full keyboard operability; focus visible; real semantics.
- Copy lives typed in `src/content.ts`.

## Decided: identity chosen by prototype

The visual identity is deliberately NOT decided on paper.
Before building rung E, prototype the D->E seam twice with the same content and pick the resurrection that hits harder:

1. Night-desk: near-black void, warm text, bright amber (--flare) accents, editorial serif statements in the dark - the terminal's existing palette promoted to the whole finale.
2. Evolved paper: warm ivory, ink, amber moments, editorial serif - the current identity pushed much further with real motion.

The bar either way: E must look REALLY pristine - unambiguously the best thing the visitor has seen all journey.

## Open items

- Run the two D->E seam prototypes; pick the identity (night-desk dark vs evolved paper).
- Portrait asset (the photo itself).
- Hero statement + max-sell copy; bio paragraphs.
- Which hobby micro-toys make the cut (build last, cut freely).
- Real screenshots/videos for the project and photo-dump media slots.
