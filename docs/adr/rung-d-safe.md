# Rung D - SAFE (website 4 of 5)

Status: fully specified except final copy polish
Date: 2026-07-12
Self-contained brief: an agent building this rung should need only this file.

## Character

Genuinely well-made.
NOT dead, NOT mediocre: D is the site a skilled engineer would ship and be proud of - roughly the caliber of the outgoing snehanshn.com (well-crafted editorial minimalism), executed in grayscale.
Its job in the arc: be good enough that the visitor thinks "oh, this is the real site now" - and then rung E does 10x better and mogs it.
The gap D->E is the whole point of the journey: personality and craft beyond competence.

Two structural tells keep D distinguishable from E without making D bad:
1. Strictly grayscale - color belongs to E.
2. Completely static - motion belongs to E.

## Composition - Swiss editorial hero

```
┌────────────────────────────────┐
│ SNEHANSHN                 ·001 │
│ CHOWDHURY                      │
│                                │
│ Software engineer.             │
│ Selected work below.           │
│                                │
│ [city]                   2026  │
└────────────────────────────────┘
```

- ~#fafafa background, ~#111 text, disciplined grid, tiny mono meta labels (location, year, index number).
- "Selected work below." aims the visitor at rung E's projects - D is a doorway, not a dead end.
- Semantics: h1 name, role paragraph, meta as definition-ish details.

## Typography - one neutral sans, real scale

- Display: Inter-class 600, clamp(3rem -> 5.5rem), tracking -0.03em.
- Body: Inter-class 400, 1rem/1.6.
- Meta: mono 400, 0.75rem, uppercase.

One quality neutral sans wielded with genuine skill - beautiful, confident, deliberately voiceless in personality.
Keeps D's font distinct from E's editorial serif voice, so the D->E seam gets its type snap.
Rejected: a quiet serif (pre-spends "serif = voice" before E's arrival).

## Arrival seam (C -> D) - "strip decoration, drain color last"

One scrubbed, exactly-reversible GSAP ScrollTrigger timeline:

1. Emoji evaporate (🚀✨💡⚡ fade/pop out).
2. Three feature cards dissolve.
3. Gradient pills -> quiet text links.
4. Layout re-composes: centered template -> Swiss grid.
5. Type: generic sans -> confident display scale.
6. Gradient and ALL hue drains -> grayscale (final beat).

Arriving at D = the exact moment color leaves the world, loading the spring for E's color flood.
Copy swaps buzzword -> professional (crossfade), consistent with prior seams.

## Dwell - ~100vh

Longer than B/C: D is the quiet before the storm.
Let the visitor sit in the well-made silence so the D->E resurrection detonates.
The D->E climax seam is owned by `rung-e-pristine.md`.

## Rail dress - hairline

1px hairline track, small square thumb, letterspaced gray uppercase labels:
"LESS HARD SELL" / "MORE HARD SELL".

## Position in the journey

Fourth and final dress of the pitch block inside the pinned sticky stage; after D the stage unpins into rung E's flowing content.

## Global constraints (restated)

- Native scroll only; no wheel/touch re-interpretation; smoothness via `scrub: ~0.8`.
- Mobile first-class at 390px; the display type clamps down without overflow; tap targets >= 44px.
- prefers-reduced-motion: seam beats collapse to end states at the threshold.
- Semantics stay correct under the costume.
- Copy lives typed in `src/content.ts`.
- Privacy: city-level location only; never street address or phone.

## Open items

- Final copy polish.
