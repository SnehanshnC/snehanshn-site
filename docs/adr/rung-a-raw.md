# Rung A - RAW (website 1 of 5)

Status: fully specified except final copy polish
Date: 2026-07-12
Self-contained brief: an agent building this rung should need only this file.

## Character

The Bad Pole.
Unstyled HTML as the browser renders it: Times New Roman, no layout, left-hugging text on white.
The badness is "no design at all", deliberate and authentic - not random ugliness.
No retro artifacts (visitor counters, under-construction GIFs, broken-image winks were all rejected - they drift toward the era-timeline framing the journey rejected, and kitsch is rung B's territory).
The timid copy carries the humor alone.

## Composition - five timid lines, top-left

```
hi. i'm snehanshn.
i write code sometimes.
i live in [city].
email me if you want i guess
my projects (i'll add these later, sorry)
```

- Text hugs the top-left like a file opened in a browser; the empty white remainder of the viewport IS the design.
- Semantics under the costume: the name line is the h1; the rest are paragraphs.
- Privacy: city-level location only - never street address or phone (site-wide rule). Email rendering (plain text vs mailto) is a copy-phase detail; if linked, it is the page's only live link.
- "my projects (i'll add these later, sorry)" is the timid non-link gag. Do NOT mark it up as `<a>` (a dead anchor is an accessibility failure); it is plain text. The alternative - a real link scrolling the journey down to E's projects - was rejected: nothing on the bad pole works well, including navigation.
- This is the first thing every visitor sees at scroll 0 and the server-rendered default dress (first paint must be rung A without JS).

## Typography - pinned, not user-agent

Explicitly `font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: normal;` plus UA-default-looking margins, pinned so every platform renders identically and the A->B seam starts from a known baseline.
True user-agent defaults were rejected: Android/iOS defaults differ, and the joke must be art-directed.

## Dwell - ~100vh before the A->B seam

Rung A holds stable for about one viewport-height of scroll from scroll 0, then the A->B seam (owned by `rung-b-kitsch.md`) begins.
Long enough for "wait, is this the whole site?", short enough to beat bounce risk.

## Rail - present from scroll 0, dressed as a default range input

The progress rail (bottom edge) exists at rung A dressed as a bare unstyled `<input type="range">` look, with plain-text pole labels "less hard sell" / "more hard sell".
It participates in the no-design joke while signposting "this is an axis, keep scrolling" - the anti-bounce insurance.
Its dress upgrades at each rung like everything else.

## Position in the journey

Occupies the start of the pinned sticky stage (a full-viewport `position: sticky` stage that owns rungs A-D).
Rung A has no arrival seam - it IS the opening.

## Global constraints (restated)

- Native scroll only; no wheel/touch re-interpretation; smoothness via GSAP ScrollTrigger `scrub: ~0.8`.
- Mobile first-class at 390px; tap targets >= 44px (the rail thumb included, even in its crusty dress).
- prefers-reduced-motion: any beats collapse to end states.
- Semantics stay correct under the costume: real heading, real paragraphs, alt text.
- Copy lives typed in `src/content.ts`.

## Open items

- Final copy polish (working copy above is close; fill [city]).
