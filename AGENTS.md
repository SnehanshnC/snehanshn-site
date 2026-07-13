<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# snehanshn.com - agent notes

Personal portfolio for Snehanshn Chowdhury.
Next.js App Router + TypeScript + Tailwind v4. Light theme only, no toggle.

## The organizing idea

THE JOURNEY IS THE SITE.
One scroll from *intentionally bad* to *genuinely great* (ADR 0001/0002; glossary in CONTEXT.md): a full-viewport sticky stage re-dresses the same pitch block through four authored designs - A RAW (unstyled HTML), B KITSCH (effort without taste), C AI-BLAND (the soulless SaaS template), D SAFE (Swiss grayscale competence) - then detonates into E PRISTINE, the real portfolio: warm paper, editorial serif, amber moments, wodniack-grade scroll motion.
The hard-sell copy axis rises with design quality: timid at A, max hard sell at E.
Rungs A-D are costumes on ONE pitch block; the full portfolio (who-i-am, projects, experience, awards, hobbies, contact) lives only inside rung E's document flow.
D banks two absences - color and motion - and the D->E seam spends them as separate payoffs: COLOR (radial flood), VOICE (serif snap), LIFE (motion wakes, cursor resurrects, stage unpins).
Deliberate badness only: under every costume the semantics stay correct (real headings, real paragraphs, working links only where the arc says they work: A inert -> B fake press -> C works hollowly -> E works beautifully).
The ADRs are law; where this file and an ADR disagree, the ADR wins.

## The journey's physics (shared scaffold - `src/journey/`)

- `Journey.tsx` (server) renders the stage with rungs A-D as stacked layers + rung E in flow + `Rail` + `JourneyDriver`. Rung A is the SSR default paint (first paint needs no JS); every rung E section is SSR'd and crawlable. A noscript block collapses the track so no-JS reads rung A then rung E.
- Scroll geometry has ONE source of truth: `track.ts` builds the segment table ([dwell][seam][dwell]...) from each rung's `meta.ts`; the pinned span is every dwell + seam, and the track is one viewport taller so the sticky release lands exactly at the D->E seam's end. Nothing else may define journey offsets.
- `JourneyDriver.tsx` mounts each seam timeline as a child of ONE master scrubbed timeline (scrub 0.8) spanning the pinned range. Independent per-seam scrubbed triggers clobber each other's clamped states on shared targets - do not "simplify" back to them. No Lenis, no wheel re-interpretation, ever; glide comes from scrub lag alone.
- Reduced motion: the driver builds no master; each seam is force-jumped to progress 0/1 as scroll crosses its midpoint. Seam beats therefore collapse to end states - builders MUST author explicit endpoints (`fromTo`/`set`, `immediateRender: false`) and no tween-side effects.
- Attribute flips inside seams are micro-duration (~0.01) `fromTo` tweens with explicit start values, never zero-duration sets: a zero-duration attr tween does not re-render its start value when the scrubbed master crosses it backward (verified in-browser; comments in the seam files say the same - do not "simplify").
- `progress.ts` is the client store (driver writes, rail and rung E consumers subscribe): `{ progress, activeRung }`, with `activeRung` flipping at seam midpoints (`track.rungAtVh`).

### The rung contract

Each rung lives entirely in `src/journey/rungs/<id>/` - `meta.ts` (dwell + arrival-seam scroll spans), `dress.tsx` (visuals; a stage layer for A-D, document flow for E), `seam.ts` (the prev->this beat list) - plus its `journeyRung<Id>` block in `src/content.ts`.
The full contract lives in `src/journey/types.ts`; the stage, rail, and driver consume rungs only through it.
Dwells are ADR-fixed (A 100vh, B 75, C 75, D 100); arrival seams are tuned per rung (A->B 80vh, B->C 70, C->D 90, D->E 100) - tuning a span is a local `meta.ts` edit.
Seams are staggered-renovation beat lists, normalized to [0, 1], exactly reversible, scrubbed by the master. Discrete snaps (font family, layout mode) are legitimate beats.
Seams may reach into the OUTGOING rung's DOM through stable hooks (the parallel-build era that forbade it is over), but each such beat must no-op harmlessly if the hook is absent.

### The rail

`Rail.tsx` is a native `<input type="range">` - slider semantics, keyboard operation, and SR announcements for free; its UA-default look IS rung A's dress.
Keyboard -> smooth scroll; pointer drag -> instant scrub; click -> smooth scroll; between interactions the thumb follows the progress store. Never scroll jacking: every rail scroll is user-initiated.
THE RAIL DRESS PROTOCOL (types.ts): each re-dressing rung ships a global `rail-dress.css` keyed on the ONE shared attribute `[data-rail-dress="<id>"]`; the arrival seam flips the attribute from the previous rung's value (micro-duration attr fromTo). One attribute, one owner per scroll position - no resets, no specificity wars. Label COLOR is the exception: seams tween it inline as choreography, each fromTo starting exactly where the previous seam's ended (ink -> lime -> white -> #666 -> faint).
The input's 44px box (the tap floor) and focus outline are never touched by any dress.
Pole labels re-voice per rung from each content block's `rail` field at seam midpoints (via `activeRung`); the landmark and slider names live in `journeyShared`.

## Page map

One route. The journey is the site.

| Where | What |
| --- | --- |
| `/` | `app/page.tsx` -> `src/journey/Journey.tsx` - the whole journey, rung A through the endcap |
| `/#who-i-am` | rung E.1 (301 target of the old `/about`) |
| `/#projects` `/#experience` `/#awards` | rung E.2-E.4 (terminal `goto` targets) |
| `/#hobbies` | rung E.5 (301 target of the old `/fun`) |
| `/#contact` | rung E.6 - the Coleman close |

`/fun` and `/about` 301 (statusCode 301 in next.config.ts, not Next's default 308) to their anchors; the sitemap is `/` only.
Section ids double as terminal `goto` targets and are load-bearing: never rename `who-i-am` or `hobbies`.
Each section heading carries `id="<section>-title" tabIndex={-1}` so `goto` can land focus where the scroll goes.
`not-found.tsx` is the 404 in the site's voice (statement + mono sub-line + link home); its emphasis word must be spellable from the italic subset's glyphs (currently ` -06abiklntw`) or it silently falls back to Georgia italic - "blank" is the current word.
`ScrollRestorer.tsx` (in `layout.tsx`) restores scroll on back/forward and reload - Next's async re-render defeats the browser's native restore; fresh navigations still start at top (scroll 0 IS rung A, every visit rides the journey - no seen-it cookies).

## The site's edges (favicon, unfurl, robots)

The mark is the terminal doorway: `>_` in flare amber on an ink rounded square (`src/app/icon.svg`, hand-drawn geometry - no font text, it must stay crisp at 16px).
`favicon.ico` (16/32/48, generated from the SVG) and `apple-icon.png` (180px, full-bleed ink because iOS rounds corners itself) sit beside it; regenerate all three from icon.svg if the mark changes, and eyeball the 16px rendering on light AND dark tab strips.
Unfurl contract (ADR 0002 "SEO"): metadata sells, the page jokes - document title, description, and the OG image are straight max-sell with no bit, because a recruiter's first impression in Google/Slack must not be the joke without the punchline.
`layout.tsx` owns the root metadata (metadataBase off `site.url`, canonical, complete openGraph + twitter). Any future page that overrides openGraph must spell the object out in full including `images` - Next replaces, never deep-merges it.
`opengraph-image.png` (1200x630) is the E.0 statement ink-on-paper with the amber italic; the document h1 IS that statement (server-rendered), so changing `journeyRungE.statement` means regenerating the OG image AND the italic subset (see "Type").
`robots.ts` and `sitemap.ts` derive from `site.url`; new routes (if any ever return) must be added to sitemap.ts by hand.

## Design tokens (the day-desk palette)

Defined once in `src/app/globals.css`, exposed to Tailwind via `@theme inline` (`text-faint`, `bg-paper`, etc).
Seven light tokens + the night-desk set scoped to the terminal; no more:

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#faf8f3` | page background - warm ivory, never pure white |
| `--ink` | `#211d16` | primary text - warm near-black |
| `--faint` | `#6d6558` | secondary text (5.2:1 on paper - AA) |
| `--line` | `#e5dfd2` | hairlines, dividers, card borders |
| `--wash` | `#f1ede4` | raised tint panels, media/photo placeholders |
| `--signal` | `#9c5a00` | text-safe amber: links, active states, focus rings (5.1:1 on paper) |
| `--flare` | `#f2a33c` | bright amber fills: cursor pill, award tags, rail thumb at E, selection - always ink text on top (7.8:1) |

Terminal-only night-desk tokens: `--void`, `--surface`, `--trace`, `--noise`, `--glow`, `--grid`.
Inside the terminal the accent is `--flare` (bright amber on dark); `--signal` is too dark there.
Contrast rule: `--signal` is the darkest amber that passes AA on paper - never lighten it for text; `--flare` is fill-only.
Rungs B/C/D deliberately do NOT use the tokens - their palettes are costumes (B's lime-on-magenta crime, C's purple->blue template, D's raw grayscale hexes); borrowing `--paper`/`--signal` there would dilute the parody. Color begins its real life at the D->E flood.

## Type

- `.statement` = Fraunces (variable, `opsz` axis only), weight 480 - the editorial display voice of rung E; its true italic carries the emphasis word.
- `font-sans` = IBM Plex Sans 400/500 (prose).
- `font-mono` = IBM Plex Mono 400/500 (labels, serials, ledger years, terminal, rail at D/E).
- Use `tabular-nums` wherever numbers align vertically.
- Rung costumes pin their own stacks locally (A's Times New Roman, B's Comic Sans, C/D's system Inter-alikes) - zero font bytes; only rung E speaks the loaded families.

LCP contract (do not regress - the h1 is the LCP element):
The document h1 is rung E.0's statement. Fraunces loads without the SOFT/WONK axes (they double the bytes).
The italic is a SEPARATE local family (`--font-fraunces-italic`, applied by `.statement em` and the flap chars): `src/app/fraunces-italic-subset.woff2`, a ~10KB Google Fonts `text=`-subset holding ONLY the emphasis words' glyphs (` -06abiklntw`).
If an emphasis word changes anywhere (E.0, ledes, close, 404), re-fetch the subset with the new glyphs (curl command in `layout.tsx` above the `localFont` call) - a missing glyph silently falls back to Georgia italic.
Adding weights/axes/subsets to any preloaded font must be justified against Lighthouse mobile LCP.

## The cursor (`src/journey/rungs/e/salvage/Cursor.tsx`) - the signature, resurrected at E

A 10px amber dot follows the pointer (rAF + lerp); over a target carrying `data-cursor="label"` it morphs into a mono pill speaking that label, riding right of the pointer, clamped inside the viewport.
It WAKES as the LIFE act's last beat (`wake.ts`: the E.0 entrance timeline scrubs it 0 -> 1; reduced motion wakes it at the `activeRung === "e"` threshold instead) - rungs A-D keep the native cursor; scrolling back to D puts it back to sleep. Its arrival is itself a resurrection beat, with a small birth pop.
Label conventions: project links say the link kind ("devpost ↗", "live ↗", "github ↗", "dorahacks ↗"), ledger companies "visit ↗", socials "<name> ↗".

Rules (do not break):
- `(hover: hover) and (pointer: fine)` only - touch and keyboard get the native experience untouched. The native cursor hides only while awake at E.
- Focus outlines are never hidden; the cursor is pointer-only garnish.
- Reduced motion: the dot still follows (snap, no lerp); morph transitions are disabled in globals.css.
- Forced colors (Windows High Contrast): the `@media (forced-colors: active)` block in globals.css restores the native cursor and hides `.cursor-pill`. It must stay AFTER the base `.cursor-pill` rule (cascade order decides).
- The rAF loop sleeps when settled; every input path calls `wake()` - any new code path that changes what `frame()` paints must too.

## The terminal (`src/journey/rungs/e/salvage/Terminal.tsx`) - E's easter egg

Press `/` at rung E (the key answers only there - the terminal belongs to the destination, not the costumes); doorways: the "press /" button on E.0's meta row and the endcap hint, both dispatching `terminal:open`.
Commands: help, ls projects, open <slug>, goto <section> (scrolls + lands focus on the section heading once the scroll ends - focusing earlier hits a still-hidden heading and drops focus to body), cat awards, whoami, sudo hire-me, clear, exit.
Night-desk styling (surface/void/grid tokens, `--flare` prompt) - the one dramatic dark moment. Keep it dark.
Fully keyboard operable: Tab completes commands and arguments (ambiguous -> candidates printed), Enter runs, ArrowUp/Down recall history (persisted in `sessionStorage`), Escape or `exit` closes and focus returns to the pre-open element (`goto` skips the restore - the visitor asked to leave).
The input suppresses the global focus outline (`[data-terminal-input]` rule in globals.css); the amber prompt + caret carry focus. Command data all comes from `content.ts`.
Body scroll is locked while open; the output pane scrolls itself with `overscroll-contain`.
The output pane carries `role="log"` so SRs announce command output (WCAG 4.1.3); the banner types itself OUTSIDE that region so it is heard once. History recall stays quiet (ArrowUp only edits the input's value).

## Motion rules

Motion answers the visitor - their scroll, their hover, their keystroke - and nothing else.
- The journey's motion is scroll-scrubbed: seam beats and rung E's reveals are pure f(scroll), exactly reversible, riding `scrub: 0.8`. Native scroll is sacred: no Lenis, no wheel/touch re-interpretation; sticky pinning and user-initiated smooth scrolls (rail, Learn more, goto) are the only scroll effects.
- Rung E's engineering doctrine (rung-e-pristine.md, binding): JS writes numbers (CSS custom properties), CSS owns geometry via calc()-composed transforms; `content-visibility` on offscreen showcase panes always pairs with `contain-intrinsic-size`; hover beats fire on `:focus-visible` too.
- Free-running loops are caged: B's marquee runs only while `data-b-on` (seam punchline) AND `data-b-live` (activeRung === "b") both hold - and the B->C seam freezes it at its first pixel (`data-b-frozen`, "motion dies first"). The split-flap idle roll ticks one letter every 20-40s only while the hero is in view and the tab visible. Nothing else self-runs, ever.
- Reduced motion: every rung renders complete, legible, and static from base CSS; seams collapse to end states at their midpoints; the marquee stays a wrapped static shout; the showcase collapses to stacked flow; no scroll traps. Author the collapse from day one - explicit endpoints, no onComplete state.
- CSS keyframe entrances that remain (`.rise`, `.rise-move` on the 404, `.terminal-in`) are disabled under reduced motion in globals.css.
- No animation libraries in initial-load components beyond GSAP itself (ScrollTrigger + EasePack); anything heavier must be gated behind interaction and justified against the perf floor.

## Verification floors (ADR 0002 - keep these when changing anything)

Lighthouse mobile on `/`: accessibility >= 95 (non-negotiable), performance >= 90 (GSAP + pinned stage acknowledged; rung A's near-empty HTML keeps LCP fast - re-check after any hero/font change).
Zero console messages; hydration-clean; `scrollWidth - clientWidth = 0` at 390px at every journey position - including CDP font-scale (`Page.setFontSizes`) standard 24 and 32 for the rail and other chrome.
Tap targets >= 44px, authored in px (a physical-ergonomics constant that must not inflate with text scale): the rail input's 44px box, buttons, and inline links via `::after` hit-area expansion (see Ledger).
Full keyboard walk: the rail (ArrowLeft/Right scrub the journey with focus retained and visible), C's buttons, the terminal (`/` gate at E, Tab completion, goto focus handoff, Escape restore), every rung E link; focus visible always.
prefers-reduced-motion: every rung complete and legible; seams collapse to end states at midpoints in BOTH scrub directions; no scroll trap.
Exact seam reversibility: any scroll position renders a deterministic state; scrub each seam both ways after touching one (the rail dress attribute and label color must land exactly at every dwell).
Print: no showcase card straddles a page break (`[data-e-card]` rule in globals.css).
Screenshots for review live under `docs/screenshots/` (per-rung sets from phase 3; integration set incl. floor evidence under `integration/`).

## Content

Every word of copy and every data item lives in `src/content.ts`, typed.
The journey blocks (`journeyShared`, `journeyRungA`..`E`) are clearly bounded: a rung's copy lives in its own block, voiced per its ADR; each block's `rail` field re-voices the pole labels.
Statements are `pre/emphasis/post` objects; the emphasis word is the only italic and must exist in the italic subset.
Projects carry `ticker`, `metric` (`fromAward: true` means the metric IS the placement, so the award tag is not rendered again), `awards`, `link`, and optional `media` - the rung E showcase's plug-and-play slot: add `{ src, alt }` and the blank wash panel becomes a real screenshot, single-file edit.
`wins` is E.4's honor roll; `otherWins` remains the terminal's one-liner.
Anything mocked carries a `// TODO(snehanshn)` marker (portrait, photo dump, media slots, contact links) - swapping mock for real is a single-file edit; TODO-gated contact links (`href: "#todo"`) are not rendered anywhere.
Privacy: phone number and street address must never appear in the repo or the site; location stays city/state-level. No invented URLs; GitHub = https://github.com/SnehanshnC. No analytics.

## Dev

- `npm run dev` / `npm run build && npm run start`
- Restarting the prod server: kill by port (`lsof -ti :3000 | xargs kill`), not by `pkill -f "next start"` - Next detaches a `next-server` process the pkill misses, and a half-replaced serve 500s on hashed chunks (looks like a broken site; it is a broken serve).
- No Chrome stable on this machine: browser verification uses the Playwright **chrome-headless-shell** under `~/Library/Caches/ms-playwright/chromium_headless_shell-*/` launched with `--remote-debugging-port`, then `CHROME_DEVTOOLS_AXI_BROWSER_URL=http://127.0.0.1:<port> chrome-devtools-axi ...`. The full Chrome-for-Testing binary freezes its frame pipeline headless (NO_FCP) - use the shell for Lighthouse too (`CHROME_PATH` pointed at it; the axi lighthouse omits the performance category). `--force-prefers-reduced-motion` for reduced-motion runs.
- Scrub-settling: after a programmatic `scrollTo`, wait ~1.5s before screenshotting (scrub 0.8 lags by design).
- chrome-devtools-axi `eval` takes a single expression - wrap multi-statement probes in an IIFE, and remember `hover` does not synthesize pointer events (dispatch `PointerEvent`s via `eval` to exercise the cursor).
