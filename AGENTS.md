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

## Page map

| Route | File | What it is |
| --- | --- | --- |
| `/` | `app/page.tsx` | Statement hero + experience ledger (`Ledger.tsx`), work grid of six cards (`WorkCard.tsx` + `Cover.tsx`) |
| `/fun` | `app/fun/page.tsx` | The wall (all wins as tiles), photo-dump placeholders, currently strip with `Sparkline.tsx` |
| `/about` | `app/about/page.tsx` | Bio, education, now-building, TODO-gated contact block |

`Nav.tsx` (name + one-word role, Work / Fun / About, the `>_` terminal doorway) and `Footer.tsx` (sign-off + links + "press /") frame every page via `layout.tsx`.
`template.tsx` gives each route change a fast transform-only rise (`.page-in`); a fade there would delay the LCP paint.
`ScrollRestorer.tsx` (mounted in `layout.tsx`) restores scroll positions on back/forward - Next 16's async re-render defeats the browser's native restore, so it records scrollY per history entry (index stamped into `history.state`, positions in `sessionStorage`) and re-applies after popstate once the document is tall enough. Link navigations still start at top.
Every page's h1 is a `.statement` sentence with ONE italic emphasis word (`<em>`, amber).

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
- Two-effect wiring: the first effect flips `active` so the pill renders; the second (dep `[active]`) attaches listeners once the element exists. Collapsing them back to one effect silently kills the whole system (the ref is null before the first render with `active`).

## The terminal (`src/components/Terminal.tsx`)

Press `/` anywhere; doorways: the `>_` button in the nav and "press /" in the footer (`TerminalHint.tsx`), both dispatching `terminal:open`.
Commands: help, ls projects, open <slug>, goto <work|fun|about> (client-side `router.push`), cat awards, whoami, sudo hire-me, clear, exit.
Night-desk styling (surface/void/grid tokens, `--flare` prompt) - on the light site it is the one dramatic contrast moment. Keep it dark.
Fully keyboard operable: Tab completes commands and arguments (ambiguous → candidates printed), Enter runs, ArrowUp/Down recall history (persisted in `sessionStorage`), Escape or `exit` closes and focus returns to the pre-open element (`goto` skips the focus restore - the element belongs to the page being left).
The input suppresses the global focus outline (`[data-terminal-input]` rule in globals.css); the amber prompt + caret carry focus. Command data all comes from `content.ts`.
Body scroll is locked while the terminal is open (`overflow: hidden` effect on `open`; the output pane scrolls itself with `overscroll-contain`) - Escape must land you exactly where you pressed `/`.

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
Reduced motion: pages render complete and static; cursor follows without trail.
Screenshots for review live under `docs/screenshots/` (all pages at 390/768/1440 + cursor states).

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
