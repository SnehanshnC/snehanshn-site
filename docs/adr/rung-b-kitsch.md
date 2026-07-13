# Rung B - KITSCH (website 2 of 5)

Status: fully specified except final copy polish
Date: 2026-07-12
Self-contained brief: an agent building this rung should need only this file.

## Character

Effort has arrived; taste has not.
Discovered-CSS energy: clashing colors, everything centered, marquee movement, beveled buttons.
Restraint even in tastelessness: two artifacts only (marquee headline, bevel+clash backbone).
Rejected artifacts: hit counter (extra markup for one gag), sparkle cursor trail (costs a pointer-effects system, muddies a potential rung-E custom cursor).

## Composition - centered shout-stack

```
<- WELCOME TO MY AWESOME SITE!! <-   (marquee headline)

   I build projects! I write code!
   And I live in [city]!!

  [ MY PROJECTS ]  [ EMAIL ME!! ]    (gray 3D bevel buttons)
```

- The same five facts as rung A, now SHOUTED; dead-centered with tacky text-shadow.
- Buttons are decorative: they have a press-effect on click but perform no action - nothing works well on the bad side of the journey (consistent with rung A's inert non-link).
- Semantics under the costume: h1 headline, paragraphs, real `<button>`s (disabled semantics handled accessibly - they must not trap or confuse SR users; aria-disabled with the joke intact).

## Palette - the lime-on-magenta crime

- background: #ff00cc (hot magenta)
- text: #aaff00 (lime)
- accents: #00ffff (cyan)
- buttons: silver bevel with red text

Canonical "discovered the color picker" crime; maximum distance from A's white and C's slick purple, so both adjacent seams read loudly.
Rejected: rainbow gradient text (drifts GeoCities-era; gradient text is C's slick move), red-on-teal (reads "old", and era-cosplay is not B's job).

## Arrival seam (A -> B) - "color first, motion last"

One scrubbed, exactly-reversible GSAP ScrollTrigger timeline; the fictional author discovers powers one at a time:

1. Background: white -> #ff00cc floods.
2. Text: black -> lime; size inflates.
3. Alignment: top-left -> dead center.
4. Buttons: plain text lines -> 3D bevels pop.
5. Copy swaps timid -> eager (crossfade).
6. Headline lurches into marquee motion - motion arrives LAST, as the punchline.

Rejected: copy-swap-first (mid-seam state reads as a bug at fast scroll), single all-at-once ramp (loses the piece-by-piece comedy).

## Dwell - ~75vh

Shorter than A's 100vh: the visual joke reads instantly, A's deadpan needed more silence.
Then the B->C seam (owned by `rung-c-ai-bland.md`) begins.

## Rail dress - bevel-kitsch

Re-dressed during the A->B seam alongside everything else: silver bevel track, chunky 3D thumb, lime labels, shouting case:
"LESS HARD SELL!!" / "MORE HARD SELL!!".

## Position in the journey

Second dress of the pitch block inside the pinned sticky stage (which owns rungs A-D).

## Global constraints (restated)

- Native scroll only; no wheel/touch re-interpretation; smoothness via `scrub: ~0.8`.
- Mobile first-class at 390px; the shout-stack must fit without horizontal scroll; tap targets >= 44px.
- prefers-reduced-motion: seam beats collapse to end states at the threshold; the marquee is STATIC under reduced motion (never loops).
- Semantics stay correct under the costume.
- Copy lives typed in `src/content.ts`.
- Privacy: city-level location only; never street address or phone.

## Open items

- Final copy polish.
