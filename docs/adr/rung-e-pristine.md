# Rung E - PRISTINE (website 5 of 5)

Status: character and identity accepted; open items below
Date: 2026-07-12 (identity decided 2026-07-13)
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

## Decided: identity = EVOLVED PAPER (prototype verdict, 2026-07-13)

Both candidates were built as the D->E seam with identical content behind a temporary route and compared at the seam's beats (PR #15; comparison screenshots in `docs/screenshots/pristine-proto/`).
Winner: **evolved paper** - warm ivory, ink, amber moments, editorial serif; the current identity pushed much further with real motion.
Captain's rationale: "I like envelope paper better."
Night-desk dark (the terminal's palette promoted to the whole finale) was built, compared, and removed.
The winning seam prototype stays behind the temporary `/proto-pristine` route (`src/journey/proto/`) until the rung E build adopts it; the rung E task deletes that route.

The bar, raised with the pick: breathtaking, very delicate, elegant visuals and motion in the spirit of wodniack.dev - translated into the paper voice, never cloned.
E must look REALLY pristine - unambiguously the best thing the visitor has seen all journey.

## The motion language (binding law, distilled from the wodniack study)

Translation rule: **borrow the grammar (staggers, hang-time, doorways, springs, data-whispers), keep the paper voice (hairlines not letter-walls, amber not crimson, one accent at a time).**

### Decided mechanics

1. E.2 projects run on a SlowMo hang-time showcase engine.
   One scrubbed timeline tweens ONE progress number per project with `slow(0.15, 0.6)` and a stagger; CSS composes the whole transform from that variable (rotation subtle, 2-4deg; a soft shadow that fades as the card settles flat - "a print laid on the desk"); `content-visibility: hidden` outside the active range.
   Each project rushes in, hangs readable through its dwell, rushes out - scroll never stops being native.
2. Detonation Act 1 is a scrubbed radial flood detonating from D's emphasis word.
   A transform-scaled, pre-painted bloom layer accelerates open with power4.in - a point-source zoom, not a crossfade.
   No animated `clip-path` at mobile sizes, no filters.
3. Detonation Act 3 is the LIFE entrance grammar for E.0.
   Statement chars rise inside clipped lines (0.02 stagger, expo.inOut), the amber thread draws itself in, mono labels slide in from alternating sides, and the cursor pill wakes last.

### Engineering doctrine (rung E build law)

- One shared ticker; components subscribe on view-enter and unsubscribe on view-exit (IntersectionObserver pause).
- JS writes numbers (CSS custom properties or one attribute); CSS owns geometry via calc()-composed transforms.
- `content-visibility` on offscreen members, always with `contain-intrinsic-size` set so scroll geometry never shifts.
- Media loads through a sequential chain (one `canplaythrough` at a time), nothing before first intersect; placeholders first.
- No Lenis, no wheel or touch re-interpretation, ever - glide comes from `scrub: 0.8` alone.
- Reduced-motion collapse is authored from day one (explicit `fromTo`/`set` endpoints; every reveal reads complete and static).
- Every hover-triggered beat fires on `:focus-visible` too; interactive elements are real semantics.

### Recommended delicacy menu (builder's discretion; floors first, micro-toys last and cut freely)

- Hairline draw-ins from the edges for every E section arrival.
- Split-flap idle roll on the emphasis word: one letter ticks every 20-40s, in-view only (the italic subset already holds the word's own glyphs); disabled under reduced motion.
- Awards honor-roll mask reveals plus a scrubbed "N wins and counting" counter (tabular mono; screen readers get the static final count).
- Breathing email CTA with a one-shot, budgeted hairline ripple (hover/focus-gated, never free-running).
- Sliced-type materialization for the VOICE snap (2-3 slices per char aligning as the serif lands).
- Binary whisper tape above the footer (hover-lit, `aria-hidden`).
- (Stretch) thrown-photos catcher as ONE E.5 micro-toy - build last, cut freely; the section must stand without it.

Non-normative pointers: the design study at `data/wodniack-study-h3/report.md` (screenshots in `shots/`) maps every mechanic above to working source in github.com/AntoineW/AW-2025-Portfolio.

## Open items

- Portrait asset (the photo itself).
- Hero statement + max-sell copy; bio paragraphs.
- Which hobby micro-toys make the cut (build last, cut freely).
- Real screenshots/videos for the project and photo-dump media slots.
