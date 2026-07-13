# 0002 - Journey architecture (the shared physics of all five websites)

Status: accepted
Date: 2026-07-12

This is the single cross-cutting ADR for the journey.
Everything website-specific lives in the five self-contained rung ADRs (`rung-a-raw.md` ... `rung-e-pristine.md`); an agent building one rung should only need its own rung ADR.
This doc exists so those briefs have one canonical source to restate from.

## Two poles, not eras

The journey runs from *intentionally bad* to *genuinely great*.
It is NOT a history-of-web-design timeline.
The hard-sell copy axis (borrowed from getcoleman.com) rises with design quality: timid at the bad pole, max hard sell at the great pole.

## Five rungs, hybrid gradient

"Design quality" cannot be interpolated automatically, so the gradient is authored: five discrete rungs joined by scroll-driven morphs.

| Rung | Character | Copy voice |
| --- | --- | --- |
| A | RAW - unstyled HTML, no design at all | Timid: "hi. i'm snehanshn." |
| B | KITSCH - effort without taste | Eager: "Check out my AWESOME projects!!" |
| C | AI-BLAND - soulless SaaS template (parody of the old site) | Buzzword sell |
| D | SAFE - genuinely well-made (current-site caliber), grayscale and static | Professional-LinkedIn sell |
| E | PRISTINE - editorial craft, wodniack-grade motion; must outclass D 10x | Max hard sell; the real portfolio |

Rung D exists so the final jump is about personality and craft beyond competence, not just polish; D is good, E mogs it.

## Content skeleton

Rungs A-D are each ONLY the pitch block (identity + the sell) rewritten in that rung's voice - Coleman's mechanic.
The full portfolio (portrait/who-I-am, awards, experience, projects, hobbies, contact) lives only inside rung E.

## Spatial structure: pinned stage, then flow

A single `position: sticky` full-viewport stage owns rungs A-D: scroll progress re-dresses the same pitch block through the four characters, then the stage unpins (~80% of the stage's scroll span) and rung E unfolds as normal document flow.
Native scroll only; the scrollbar never lies.

## Morphs: staggered renovation

Each seam (A-B, B-C, C-D, D-E) is a choreographed beat list: individual properties flip or short-tween at staggered scroll offsets (background flattens, font snaps, buttons restyle, layout re-aligns...).
All beats are scroll-scrubbed and exactly reversible.
Discrete snaps (font family, layout mode) are legitimate beats.
Each seam's beat list lives in the ADR of the rung being arrived at.

## Progress rail

A slim persistent rail at the bottom edge, labeled at the poles (working labels: "less hard sell" / "more hard sell"), marker tracks scroll progress.
Click/drag smooth-scrolls there (user-initiated - not jacking).
The rail is primary navigation: keyboard-operable, slider semantics for screen readers.
The rail's own styling upgrades per rung (crusty at A, refined at E); each rung ADR specifies its rail dress.

## Engine and smoothness

- GSAP ScrollTrigger (free incl. plugins) on the existing Next.js App Router + TypeScript + Tailwind v4 stack.
- One scrubbed timeline per seam; pinning and rail read the same progress source.
- Scroll input is sacred: NO Lenis or any wheel re-interpretation. Smoothness comes from scrub lag (`scrub: ~0.8`) so animations glide even on clicky wheels.
- Main-thread discipline: beats prefer transform/opacity/CSS-variable changes; layout-thrashing properties only as deliberate snap beats.
- SSR: the server-rendered stage defaults to rung A's dress; timelines attach client-side.

## Global constraints (every rung ADR restates these)

1. No scroll jacking: nothing intercepts or re-eases wheel/touch input; sticky pinning and user-initiated smooth-scroll are the only allowed scroll effects.
2. Mobile is first-class: the journey must work on touch at 390px - stage, seams, and rail included; tap targets >= 44px; the rail must not collide with browser UI chrome.
3. prefers-reduced-motion: seam beats collapse to end states at thresholds (no tweens); every rung stays legible.
4. Accessibility: pitch text reachable non-visually at every rung; keyboard traversal of the whole journey; focus visible always.
5. Content lives typed in `src/content.ts`; no copy hardcoded in components.
6. Deliberate badness only: rungs A-D are authored designs, not broken pages - underneath the costume, semantics stay correct (real headings, real links, real alt text).

## Routes, SEO, repeat visits (decided)

- Old routes: 301 `/fun` -> `/#hobbies`, `/about` -> `/#who-i-am` (rung E anchors). Sitemap shrinks to `/`. Keeping standalone pages was rejected (contradicts "the journey is the site"); hard 404s were rejected (breaks inbound links for no reason).
- SEO/unfurls: metadata sells, the page jokes. Document `<title>`, meta description, and OG image are straight max-sell with no bit; the document h1 is E.0's statement (server-rendered); rung A's timid lines are semantically paragraphs. All rung E content is SSR'd and crawlable. "Full commitment to the bit" in metadata was rejected - recruiters' first impression in Google/Slack must not be the joke without the punchline.
- Repeat visits: stateless - every visit rides the journey from rung A. No seen-it cookies. The scrubbable rail (and C's "Learn more") is the skip mechanism.

## Verification floors (decided)

Lighthouse mobile on `/`: accessibility >= 95 (non-negotiable), performance >= 90 (GSAP + pinned stage acknowledged; rung A's near-empty HTML keeps LCP fast).
Zero console messages; hydration-clean; no horizontal scroll at 390px; tap targets >= 44px.
Full keyboard walk: rail, C's buttons, terminal, all E sections.
prefers-reduced-motion: every rung renders complete and legible; seam beats collapse to end states.

## Superseded

- The "8ish websites" idea (superseded by five rungs).
- ADRs 0003-0008 from an earlier pass were merged into this doc to keep the doc set small: one architecture doc + five rung briefs.
