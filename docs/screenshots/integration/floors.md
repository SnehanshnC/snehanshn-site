# Phase 4 integration - verification floor evidence

Run 2026-07-13 against the final integration build (`npm run build && npm run start`), Playwright chrome-headless-shell 149 (Chrome-for-Testing freezes its frame pipeline headless - NO_FCP - so the shell is the house browser for Lighthouse too).

## Lighthouse mobile on `/` (floor: a11y >= 95, perf >= 90)

`lighthouse-mobile.json` in this directory (chrome-headless-shell via CHROME_PATH).

| Category | Score |
| --- | --- |
| Performance | 96 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

LCP 2.9s (mobile throttling) · CLS 0 · TBT 50ms.

## Console / hydration

Zero console messages across a full production scroll walk at 1440 and 390, full-motion and reduced-motion sessions (fresh profiles).
Hydration-clean (a mismatch always logs; none did).

## Horizontal overflow

`scrollWidth - clientWidth = 0` at 390x844 at every probed journey position - and at CDP `Page.setFontSizes` standard 24 AND 32 (nine positions each, rung A through the endcap).

## Keyboard walk

- Rail: focusable range input (44px box), ArrowLeft/Right scrub the journey with focus retained and a visible outline; value tracks the store; labels re-voice per rung.
- Terminal: `/` answers only at rung E (gate verified at rung A: refuses); Tab completion ("go" -> "goto ", "hob" -> "hobbies"); `goto hobbies` closes, smooth-scrolls, and lands focus on the risen `hobbies-title` heading - INCLUDING long jumps (integration fix: focus now lands at scrollend; focusing earlier hit the still-hidden heading and dropped focus to body); Escape restores focus to the pre-open doorway button.
- Tap targets: every visible interactive element >= 44px in both dimensions or carrying the house `::after` hit-area expansion (ledger links: 18px anchor + 13px vertical inset = 44px hit box).

## Reduced motion (`--force-prefers-reduced-motion`)

`1440-reduced-*.png`: every rung renders complete, legible, and static.
- Seams collapse to end states at their scroll midpoints in both directions (probed: rail dress attribute walks "" -> b -> c -> d -> e and back; label colors ink -> lime -> white -> #666 -> faint and back).
- B's marquee is a static wrapped shout (animation: none, white-space normal).
- E's showcase collapses to stacked flow; all six projects readable; document just gets shorter - no scroll trap anywhere (native scroll only).
- `goto` jumps instantly (behavior: auto) and still lands focus on the heading.

## Site edges

- `/fun` -> 301 `/#hobbies`, `/about` -> 301 `/#who-i-am` (statusCode 301, not 308); anchors exist and land.
- robots.txt + sitemap.xml (single `/` entry) serve from `site.url`.
- favicon.ico / icon.svg / apple-icon.png / opengraph-image.png all 200 with correct types.
- OG/twitter/canonical tags complete; og:image present; the OG composition still matches the live h1 (E.0 kept the pre-journey statement, so no regeneration was needed).
- 404 stays on-voice ("This page came back *blank*.") with the subsetted emphasis word.

## Screenshot key

- `1440-rail-{a,b,c,d}-dwell.png`, `1440-rail-e-hero.png` - the rail dress protocol landing per rung (bevel -> gradient pill -> grayscale hairline -> warm hairline + flare dot), each dwell now wearing ONLY its own rung's chrome.
- `1440-bc-handoff-frozen.png` - the B->C smother with the marquee frozen at the seam's first pixel ("motion dies first") and the chaos costume in B's exact colors.
- `1440-cd-strip-skins-survive.png` - emoji evaporate while the pill chrome survives (skin spans excluded from the emoji beat).
- `1440-cd-pills-quiet-links.png` - the ADR's beat 3: pill chrome gone, quiet text links remain, about to leave.
- `1440-de-flood.png` - the detonation's COLOR act over a clean grayscale D.
- `1440-e-close-rest.png` - the close with the rail marker resting at "more hard sell".
- `390-*.png` - the same fixed rail dresses + B dwell at mobile width; overflow 0.
- `1440-reduced-*.png` - the reduced-motion collapse states.
