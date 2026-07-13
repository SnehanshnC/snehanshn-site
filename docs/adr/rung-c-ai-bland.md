# Rung C - AI-BLAND (website 3 of 5)

Status: fully specified except final copy polish
Date: 2026-07-12
Self-contained brief: an agent building this rung should need only this file.

## Character

Competent, soulless, template-grade - the universally recognizable AI-generated portfolio.
Purely generic parody: NO winks at the outgoing snehanshn.com (almost no visitor saw it; the joke lands on generic recognition alone - "I've seen this exact template a thousand times").
Rejected: private old-site winks (dilute the template read), literal blandified old-site cameo (illegible to strangers, breaks the monotonic bad->great arc).

## Composition - gradient hero + three feature cards

```
        (purple -> blue gradient background)

   🚀 Results-driven engineer shipping impactful solutions.

        [Get in touch]   [Learn more]

   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │   ✨    │  │   💡    │  │   ⚡    │
   │ Clean   │  │ Innov-  │  │ Fast    │
   │ code    │  │ ation   │  │ shipping│
   └─────────┘  └─────────┘  └─────────┘
```

- The three-emoji-card row is the signature template tell; cards stack vertically at 390px.
- Typography: generic sans (Inter-alike), white/near-black on gradient, pill buttons with soft shadows.
- Semantics under the costume: h1 hero, real buttons/links, cards as a list.

## Buttons - the journey's first working interactions

The functionality arc across the journey: A inert -> B fake press-effect -> C works, hollowly -> E works beautifully.

- [Get in touch] is a real `mailto:` link.
- [Learn more] smooth-scrolls the journey forward into the C->D seam - the template CTA literally means "keep scrolling". User-initiated, so not scroll jacking.

Rejected: still-decorative (three rungs of dead buttons reads as the SITE broken, not the characters), gag chatbot popups (throwaway UI, steals attention from the scroll story).

## Arrival seam (B -> C) - "motion dies first"

One scrubbed, exactly-reversible GSAP ScrollTrigger timeline; the template sanitizes the chaos piece by piece (mirror of A->B, where motion arrived last):

1. Marquee decelerates -> stops.
2. Background: magenta -> purple->blue gradient.
3. Text: lime -> white/near-black; font snaps to Inter-alike.
4. Bevel buttons -> rounded gradient pills.
5. Shout-stack -> tidy hero grid alignment.
6. Emoji sub-line + three feature cards fade in (arrive last).

Copy swaps eager -> buzzword mid-seam (crossfade), consistent with A->B.

## Dwell - ~75vh

Same as B; the card row carries the joke instantly.
Then the C->D seam (owned by `rung-d-safe.md`) begins.

## Rail dress - gradient pill

Rounded track, purple->blue gradient fill, soft drop shadow, Title Case labels: "Less Hard Sell · More Hard Sell ✨".

## Position in the journey

Third dress of the pitch block inside the pinned sticky stage (which owns rungs A-D).

## Global constraints (restated)

- Native scroll only; no wheel/touch re-interpretation; smoothness via `scrub: ~0.8`.
- Mobile first-class at 390px; cards stack; no horizontal scroll; tap targets >= 44px.
- prefers-reduced-motion: seam beats collapse to end states at the threshold.
- Semantics stay correct under the costume.
- Copy lives typed in `src/content.ts`.

## Open items

- Final copy polish (hero line, card titles).
