<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# snehanshn.com - agent notes

Personal portfolio for Snehanshn Chowdhury.
Next.js App Router + TypeScript + Tailwind v4. Light theme only, no toggle.

## The organizing idea

QUIET PAGE, LIVE FINGERTIPS.
The page is calm - warm paper, editorial serif statements, generous air, zero background motion.
All the personality lives where the visitor's hands are: a custom cursor that talks, cards that answer hover, and a dark terminal behind `/`.
The site's market-desk history survives only as whispers: mono labels, tabular numbers, one amber thread, a tiny sparkline on /fun, and the terminal as the single dramatic dark moment.
Never reintroduce background noise (canvases, tickers, particle fields).

## TRANSITIONAL: the journey rebuild (ADRs win over this file)

The site is being replaced by a single scroll journey (docs/adr/0001, 0002, and the five rung briefs; glossary in CONTEXT.md).
Where those ADRs contradict this file - the organizing idea above, the page map, the motion rules - the ADRs win; this file gets rewritten once the journey's stages settle (a later phase's job).
What is already true on `/`:

- `app/page.tsx` renders `src/journey/Journey.tsx`: a sticky full-viewport stage re-dresses the pitch block through rungs A-D as native scroll advances, then unpins into rung E's document flow. Rung A ships real (the SSR default paint); B-E are stubs.
- `/fun` and `/about` are gone: 301 -> `/#hobbies` and `/#who-i-am` in next.config.ts (statusCode 301 per ADR 0002, not Next's default 308). The sitemap is `/` only. `template.tsx` is gone (single route; its transform also breaks the rail's `position: fixed` while animating).
- Rung contract: each rung lives entirely in `src/journey/rungs/<id>/` (meta.ts spans, dress.tsx visuals, seam.ts arrival beats) plus its `journeyRung<Id>` block in `src/content.ts`. Rung tasks never touch the stage, the rail, `track.ts`, or another rung. The full contract is in `src/journey/types.ts`.
- Scroll geometry has one source of truth (`src/journey/track.ts`, built from the rung metas); `JourneyDriver.tsx` mounts each seam timeline as a child of ONE master scrubbed timeline (scrub 0.8) - independent per-seam scrubbed triggers clobber each other's clamped states on shared targets, so do not "simplify" back to them. No Lenis, no wheel re-interpretation, ever.
- Reduced motion: the driver force-jumps each seam to progress 0/1 at its scroll midpoint - beats collapse to end states; seam builders must use explicit endpoints (`fromTo`/`set`, `immediateRender: false`).
- The rail (`src/journey/Rail.tsx`) is a native range input: keyboard + slider semantics for free; per-rung re-dress happens from seam files via `SeamContext.rail`, label re-voicing via each content block's `rail` field.
- `Nav`, `Footer`, `Terminal`, `Cursor` are unmounted salvage (rung E rewires them); their `/fun`, `/about` references are dormant, not live bugs.
- E.0's statement is the document h1 and matches the OG image + Fraunces italic subset; changing it means regenerating both (see "The site's edges" + "Type" below).

## Page map

| Route | File | What it is |
| --- | --- | --- |
| `/` | `app/page.tsx` | Statement hero + experience ledger (`Ledger.tsx`), work grid of six cards (`WorkCard.tsx` + `Cover.tsx`) |
| `/fun` | `app/fun/page.tsx` | The wall (all wins as tiles), photo-dump placeholders, currently strip with `Sparkline.tsx` |
| `/about` | `app/about/page.tsx` | Bio, education, now-building, TODO-gated contact block |

`Nav.tsx` (name + one-word role, Work / Fun / About, the `>_` terminal doorway) and `Footer.tsx` (sign-off + links + "press /") frame every page via `layout.tsx`.
`template.tsx` gives each route change a fast transform-only rise (`.page-in`); a fade there would delay the LCP paint.
`ScrollRestorer.tsx` (mounted in `layout.tsx`) restores scroll positions on back/forward and reload - Next 16's async re-render defeats the browser's native restore, so it records scrollY per history entry (index stamped into `history.state`, positions in `sessionStorage`) and re-applies after popstate once the document is tall enough.
y=0 is restored too: with `scrollRestoration` forced to "manual", skipping it would strand the visitor at the leaving page's scroll position.
Positions are captured at user-intent time (capture-phase click/keydown on `document`), not inside the pushState wrapper, and scroll-driven saves are muted briefly after an intent save - the viewport can move programmatically between the user's action and pushState, which would clobber the saved value with 0.
Fresh link navigations still start at top.
Every page's h1 is a `.statement` sentence with ONE italic emphasis word (`<em>`, amber).
`not-found.tsx` is the 404 in the same voice (statement + mono sub-line + link home); its emphasis word must be spellable from the italic subset's glyphs (currently ` -06abiklntw`) or it silently falls back to Georgia italic - "blank" is the current word.

## The site's edges (favicon, unfurl, robots)

The mark is the terminal doorway: `>_` in flare amber on an ink rounded square (`src/app/icon.svg`, hand-drawn geometry - no font text, it must stay crisp at 16px).
`favicon.ico` (16/32/48, generated from the SVG) and `apple-icon.png` (180px, full-bleed ink because iOS rounds corners itself and would fill transparent ones with black) sit beside it; regenerate all three from icon.svg if the mark changes, and eyeball the 16px rendering on light AND dark tab strips.
Unfurl contract: `layout.tsx` sets `metadataBase` off `site.url` plus openGraph/twitter; every page metadata export carries its own `alternates.canonical` and a COMPLETE `openGraph` object (Next replaces, never deep-merges it), including an explicit `images: ["/opengraph-image.png"]` - the root segment's `opengraph-image.png` file convention does not survive a page-level openGraph override.
`opengraph-image.png` (1200x630) is the home statement ink-on-paper with the amber italic; rebuild it if the hero statement changes (it is a rendered composition, not a screenshot).
`robots.ts` and `sitemap.ts` derive from `site.url`; new routes must be added to sitemap.ts by hand.

## Design tokens (the day-desk palette)

Defined once in `src/app/globals.css`, exposed to Tailwind via `@theme inline` (`text-faint`, `bg-paper`, etc).
Seven light tokens + the night-desk set scoped to the terminal; no more:

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#faf8f3` | page background - warm ivory, never pure white |
| `--ink` | `#211d16` | primary text - warm near-black |
| `--faint` | `#6d6558` | secondary text (5.2:1 on paper - AA) |
| `--line` | `#e5dfd2` | hairlines, dividers, card borders |
| `--wash` | `#f1ede4` | raised tint panels, photo placeholders |
| `--signal` | `#9c5a00` | text-safe amber: links, active nav, focus rings (5.1:1 on paper) |
| `--flare` | `#f2a33c` | bright amber fills: cursor pill, award tags, selection - always ink text on top (7.8:1) |

Terminal-only night-desk tokens: `--void`, `--surface`, `--trace`, `--noise`, `--glow`, `--grid`.
Inside the terminal the accent is `--flare` (bright amber on dark); `--signal` is too dark there.
Contrast rule: `--signal` is the darkest amber that passes AA on paper - never lighten it for text; `--flare` is fill-only.

## Type

- `.statement` = Fraunces (variable, `opsz` axis only), weight 480 - the editorial display voice; its true italic carries the emphasis word.
- `font-sans` = IBM Plex Sans 400/500 (prose).
- `font-mono` = IBM Plex Mono 400/500 (labels, ledger years, card metadata, terminal, footer).
- Use `tabular-nums` wherever numbers align vertically.

LCP contract (do not regress - the h1 is the LCP element on every page):
Fraunces loads without the SOFT/WONK axes (they double the bytes).
The italic is a SEPARATE local family (`--font-fraunces-italic`, applied by `.statement em`): `src/app/fraunces-italic-subset.woff2`, a ~10KB Google Fonts `text=`-subset holding ONLY the emphasis words' glyphs.
The italic's swap repaints the h1 and is therefore a fresh LCP candidate - the full 80KB italic was the last thing gating LCP (Lighthouse 93 vs 96 with the subset).
If an emphasis word changes, re-fetch the subset with the new glyphs (curl command in `layout.tsx` above the `localFont` call) - a missing glyph silently falls back to Georgia italic.
Adding weights/axes/subsets to any preloaded font must be justified against Lighthouse mobile LCP.

## The cursor (`src/components/Cursor.tsx`) - the signature

A 10px amber dot follows the pointer (rAF + lerp, `LERP` 0.32); over a target carrying `data-cursor="label"` it morphs into a mono pill speaking that label, riding `PILL_GAP` 16px right of the pointer so it never covers what it points at.
The pill is clamped inside the viewport's right and bottom edges (`EDGE` 4px, in `frame()`) so labels stay readable on laptop-width windows; when the pointer re-enters the window the position snaps to the pointer instead of lerping in from where it faded out.
Label conventions: work cards say the link kind ("devpost ↗", "live ↗", "github ↗", "dorahacks ↗" - derived in `WorkCard.tsx`), contact links "<name> ↗", the terminal doorways "press /", the nav name the latency joke (`identity.latencyJoke`, "~2ms").
Plain links/buttons without `data-cursor` just grow the dot (`GROW` 18px); text fields put it to sleep (native I-beam returns via CSS).

Rules (do not break):
- `(hover: hover) and (pointer: fine)` only - touch and keyboard get the native experience untouched. The gate is checked once on mount; the native cursor hides only while `body[data-cursor-awake]` is set (first pointermove).
- Focus outlines are never hidden; the cursor is pointer-only garnish.
- Reduced motion: the dot still follows (snap, no lerp) and morph transitions are disabled in globals.css.
- Forced colors (Windows High Contrast): the browser repaints the dot/pill to Canvas while `cursor: none` survives, so the `@media (forced-colors: active)` block in globals.css restores the native cursor and hides `.cursor-pill`. It must stay AFTER the base `.cursor-pill` rule (same specificity - cascade order decides `display: none`).
- Two-effect wiring: the first effect flips `active` so the pill renders; the second (dep `[active]`) attaches listeners once the element exists. Collapsing them back to one effect silently kills the whole system (the ref is null before the first render with `active`).
- The rAF loop sleeps when settled (pos≈target, side≈sideGoal) instead of ticking forever on an idle tab; every input path (`onMove`, `applyMode`, press, release, resize) calls `wake()`. Any new code path that changes what `frame()` paints must call `wake()` too, or its change waits for the next pointer move.

## The terminal (`src/components/Terminal.tsx`)

Press `/` anywhere; doorways: the `>_` button in the nav and "press /" in the footer (`TerminalHint.tsx`), both dispatching `terminal:open`.
Commands: help, ls projects, open <slug>, goto <work|fun|about> (client-side `router.push`), cat awards, whoami, sudo hire-me, clear, exit.
Night-desk styling (surface/void/grid tokens, `--flare` prompt) - on the light site it is the one dramatic contrast moment. Keep it dark.
Fully keyboard operable: Tab completes commands and arguments (ambiguous → candidates printed), Enter runs, ArrowUp/Down recall history (persisted in `sessionStorage`), Escape or `exit` closes and focus returns to the pre-open element (`goto` skips the focus restore - the element belongs to the page being left).
The input suppresses the global focus outline (`[data-terminal-input]` rule in globals.css); the amber prompt + caret carry focus. Command data all comes from `content.ts`.
Body scroll is locked while the terminal is open (`overflow: hidden` effect on `open`; the output pane scrolls itself with `overscroll-contain`) - Escape must land you exactly where you pressed `/`.
The output pane carries `role="log"` (implicit polite live region) so screen readers announce each command's echo and output as they are appended - keep it; without it the terminal is completely silent for SR users (WCAG 4.1.3).
History recall stays quiet because ArrowUp only edits the input's value, never the log.

## Covers (`src/components/Cover.tsx`)

The work grid never shows fake screenshots: each card gets a deterministic SVG composition - a warm gradient wash in the project's hue plus a thin-line motif that says what the thing does (depth chart, routed arrows, graph, parquet blocks, waveform, EKG) with a single `--flare` accent.
Hue + motif live on the project in `content.ts` (`cover`); new projects pick an unused motif or add one to the `CoverMotif` union in Cover.tsx.
No randomness anywhere - server render and client render must paint identical covers.
`// TODO(snehanshn): real screenshot` markers sit where a real image swaps in.

## Motion rules

All animation is CSS (`.rise`, `.rise-move`, `.page-in`, `.terminal-in`, cover hover scale, cursor-pill morph) or the cursor's rAF loop.
Nothing in the background ever moves; motion only ever answers the visitor (hover, click, keystroke, route change).
Every animation is disabled or reduced under `prefers-reduced-motion`.
No animation libraries in initial-load components (framer-motion was removed for ~97KiB; if ever reintroduced, gate it behind interaction).

## Verification floors (keep these when changing anything)

Lighthouse mobile on `/`: performance ≥95, accessibility ≥95 (re-check after any hero/font change - LCP is the h1 font swap).
Zero console messages, hydration-clean, no horizontal scroll at 390px, all interactive elements ≥44px, focus outlines visible, full keyboard walk incl. terminal and nav across pages.
Tap-target minimums (44px) and the nav row's paddings/gaps are authored in px, not rem, on purpose: the 44px floor is a physical-ergonomics constant, and rem-authored versions inflate under the browser's font-size setting (150/200% text scale) until the nav overflows 390px - keep new tap floors in px (`min-h-[44px]`), and keep the nav free of rem-based horizontal spacing.
Text itself may scale; check `scrollWidth - clientWidth = 0` at 390px with CDP `Page.setFontSizes` standard 24 and 32 after touching the nav, footer, or wall tiles (`break-words` on the wall placement keeps /fun from overflowing at 200%).
Reduced motion: pages render complete and static; cursor follows without trail.
Print / save-as-PDF: no work card may straddle a page break - the `@media print` block in globals.css (`.work-card { break-inside: avoid }`) guarantees it; the SVG covers are monolithic so Chromium happens to push them whole anyway, but text can still split without the rule.
Screenshots for review live under `docs/screenshots/` (all pages at 390/768/1440 + cursor states; print captures as `print-home-*.png`).

## Content

Every word of copy and every data item lives in `src/content.ts`, typed.
Statements (hero sentences) are `pre/emphasis/post` objects; the emphasis word is the only italic on the page.
Projects carry `ticker`, `metric` (`fromAward: true` means the metric IS the placement, so the award tag is not rendered again on that card), `awards`, `link`, and `cover` (hue + motif).
`wins` is the /fun wall (card awards + the "other wins"); `otherWins` remains the terminal's one-liner.
Anything mocked carries a `// TODO(snehanshn)` marker - swapping mock for real is a single-file edit.
Contact links whose href is `#todo` are not rendered anywhere.
Privacy: phone number and street address must never appear in the repo or the site. No invented URLs; GitHub = https://github.com/SnehanshnC.

## Dev

- `npm run dev` / `npm run build && npm run start`
- No Chrome stable on this machine: browser verification uses the Playwright Chromium under `~/Library/Caches/ms-playwright/` launched with `--remote-debugging-port`, then `CHROME_DEVTOOLS_AXI_BROWSER_URL=http://127.0.0.1:9222 chrome-devtools-axi ...` (restart the axi bridge after setting the env). `--force-prefers-reduced-motion` for reduced-motion captures. Lighthouse performance via `npx lighthouse` with `CHROME_PATH` set to that Chromium (the axi lighthouse omits the performance category).
- chrome-devtools-axi `hover` does not synthesize pointer events; to exercise the cursor system headlessly, dispatch `PointerEvent`s via `eval`.
