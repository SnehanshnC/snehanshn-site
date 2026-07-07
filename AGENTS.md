<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# snehanshn.com - agent notes

Personal portfolio for Snehanshn Chowdhury.
Next.js App Router + TypeScript + Tailwind v4. Dark theme only, no toggle.

## The organizing idea

THE PAGE IS A LIVE TRADING SURFACE, AND SNEHANSHN IS THE INSTRUMENT.
Every module behaves like a serious trading terminal: dense, precise, alive with data, zero decoration.
Structure (top to bottom, all inside a visible hairline frame in `page.tsx`):

| Module | File | What it is |
| --- | --- | --- |
| Tape | `Tape.tsx` | Sticky ticker streaming real metrics as instruments; seeded walk + CSS marquee |
| Hero | `Hero.tsx` + `OrderFlow.tsx` + `SessionClock.tsx` | Name as signage over the order-flow canvas; kicker + LIVE/UTC data rows |
| 01 / POSITIONS | `Positions.tsx` | The six projects as a book: ticker, prose, display-size metric in a fixed right rail |
| 02 / OPERATOR | `Operator.tsx` | Bio + education left rail, experience as session rows, FILLS line |
| 03 / OFF-HOURS | `OffHours.tsx` | Currently line (+ photo grid when content.ts has photos) |
| Footer | `Footer.tsx` | Status bar: links, session line, press / |

`ModuleHeader.tsx` renders every section's `NN / TITLE` bar with a right-side readout.
The rule of motion: everything that moves represents data (ticks, flows, pulses, a drawing line, a clock). Nothing fades/bounces/slides for decoration.

## Design tokens (the night-desk palette)

Defined once in `src/app/globals.css`, exposed to Tailwind via `@theme inline` (`text-noise`, `bg-surface`, etc).
Eight tokens, no more:

| Token | Hex | Use |
| --- | --- | --- |
| `--void` | `#0a0e16` | page background, blue-tinted night |
| `--surface` | `#101622` | raised panels, module header bars, terminal |
| `--trace` | `#2a3550` | inner hairlines, row dividers |
| `--noise` | `#8b93a7` | secondary text, canvas particles |
| `--glow` | `#e8ecf4` | primary text |
| `--signal` | `#f2a33c` | the single accent (amber): pulses, tape win-markers, award tags, focus rings |
| `--grid` | `#3a4a70` | the visible panel grid - page frame, module header rules, chart furniture |
| `--down` | `#dd7373` | reserved for down-is-bad readouts; currently unused (see tape semantics) |

Type: the display voice is Archivo (variable, `wdth` axis) set via the `.signage` class in globals.css - 125% width / 900 weight, trading-floor signage.
`font-sans` = IBM Plex Sans (prose), `font-mono` = IBM Plex Mono (labels, numbers, headers, tape, terminal).
Use `tabular-nums` wherever a value ticks or numbers align vertically.

## The tape (`src/components/Tape.tsx`)

Instruments come from `tape` in `content.ts` (symbol + static `text`, or `base/decimals/prefix/suffix/vol` for ticking values).
Values walk around the true figures via mulberry32 (seed `0x5eed1`), tick every `TICK_MS` 2100ms.
No `Math.random` in render paths: server render and first client render both show base values; ticking starts in an effect.
Semantics: up-is-good instruments mark up moves with amber ▲ and show nothing on down moves; `winDown: true` (cost-like, e.g. GPU COST) marks down moves with amber ▼. Nothing on the tape ever reads as bad news - achievements never downtick red.
The marquee is CSS (`.tape-track`, `--tape-duration` 60s); marquee and ticks both stop under reduced motion.

## The signature (`src/components/OrderFlow.tsx`)

Raw canvas 2D order-flow surface under the hero. Three systems, all data-shaped:

- Flow lanes: sine streamlines carrying particle currents across the full width; every `COUNTERFLOW_EVERY` 3rd lane runs right-to-left, dimmer.
- Arbitrage pulses: an amber streak races a lane end-to-end every `PULSE_EVERY_MS` 2.8-5.2s; a click on open canvas fires one on the nearest lane (guarded by `closest("h1, p, a, button")`); the terminal's `pulse` command dispatches `marketflow:pulse`.
- Depth chart: a seeded step line (`DEPTH_STEPS` 96) drawing in over `DEPTH_DRAW_MS` 8s, holding 6s, then rebuilding.

Key constants: `DESKTOP_LANES` 10 / `MOBILE_LANES` 7, `DESKTOP_PARTICLES` 460 / `MOBILE_PARTICLES` 150 (breakpoint 768px), `LANE_BAND` [0.06, 0.66] desktop and `LANE_BAND_MOBILE` [0.05, 0.42] (pulses must stay clear of the hero copy at mobile widths), `DEPTH_BAND` [0.73, 0.92] (clear of the hero copy above and the status row below), `POINTER_RADIUS` 130 / `POINTER_BOOST` 2.2 (hover-capable devices only), `DPR_CAP` 2, PRNG seed `0x1a2b3c` (deterministic static frames).

Performance contract (do not regress - Lighthouse TBT budget): rendering is layered. Lanes + chart furniture paint once per resize into a static offscreen layer; the depth chart paints into its own layer only when its reveal advances; the rAF frame just blits both layers, draws particles batched into `ALPHA_BUCKETS`×2 fill calls, and strokes the active pulse. Never return to per-frame path drawing - it read as one long task under Lighthouse's simulated throttling and cost 26 performance points.

Behavior contracts (do not regress): a synchronous frame is painted on resize so the canvas is never blank in headless captures; the rAF loop is cancelled (not idled) when the tab is hidden or the canvas leaves the viewport, restarted by IntersectionObserver/visibilitychange; `prefers-reduced-motion` gets a composed static frame - full field, full depth line, one pulse frozen on an upper lane (above the name) - a terminal paused, not off.

All page animation is CSS (`.rise`, `.rise-move`, `.terminal-in`, `.tape-track`, `.live-dot` in `globals.css`) or raw canvas - rAF-driven JS entrance animations freeze in headless capture environments, and animation libraries in initial-load components regress TBT (framer-motion was dropped from the bundle for ~97KiB; if ever reintroduced, gate it behind interaction). The hero h1 uses `.rise-move` (transform-only, no fade): it is the LCP element and must paint immediately. `SessionClock` server-renders `--:--:--` and fills in an effect (frozen once under reduced motion; ticking 1s otherwise - a clock is data).

## The terminal (`src/components/Terminal.tsx`)

Press `/` anywhere; the "press /" hints in the footer and hero bottom row are real buttons (`TerminalHint.tsx`, optional `label` prop) dispatching `terminal:open`, so touch devices can reach it.
Commands: help, ls projects (shows tickers), open <slug>, cat awards, whoami, sudo hire-me, pulse, clear, exit.
Amber-on-surface, square corners, `--grid` borders, uppercase mono header (`▸ SNEHANSHN@DESK:~`) - it speaks the surface's voice, not the green-on-black cliché.
Fully keyboard operable: Tab completes commands and arguments (ambiguous → candidates printed), Enter runs, ArrowUp/Down recall history (persisted in `sessionStorage`), Escape or `exit` closes and focus returns to the pre-open element. `pulse` closes the terminal, scrolls to the hero, and fires a canvas pulse. The input suppresses the global focus outline (`[data-terminal-input]` rule in globals.css); the amber prompt + caret carry focus. Command data all comes from `content.ts`.

## Verification

Verified on this redesign (keep these floors when changing the hero, tape, or adding JS):
Lighthouse mobile performance 95 (TBT 0ms, LCP 2.9s - the hero h1 font swap; re-check after any hero change), accessibility 100.
Keyboard: first Tab lands on "the book", all interactive elements ≥44px, focus outlines visible.
No horizontal scroll at 390px. Hydration-clean console. Reduced-motion static frame composed (see docs/screenshots/hero-1440-reduced-motion.png).
Watch color-contrast: `noise` at reduced opacity on `void` fails AA (noise/60 is 2.96:1) - differentiate with size/weight/shape instead. `--down` at tape size passes AA on void if ever used.

## Content

Every word of copy and every data item lives in `src/content.ts`, typed.
Projects carry `ticker` (4-char instrument code), `metric` (the display-size number; `fromAward: true` means the metric IS the placement, so the award tag is not rendered again on that row), optional `stats` (secondary readout strip), and `awards`.
Anything mocked carries a `// TODO(snehanshn)` marker - swapping mock for real is a single-file edit.
Privacy: phone number and street address must never appear in the repo or the site.
Awards render as filled amber tags on position rows (or as the row's metric), never as a separate trophy section.

## Dev

- `npm run dev` / `npm run build && npm run start`
- Screenshots for review live under `docs/screenshots/`.
- No Chrome stable on this machine: browser verification uses the Playwright Chromium under `~/Library/Caches/ms-playwright/` launched with `--remote-debugging-port`, then `CHROME_DEVTOOLS_AXI_BROWSER_URL=http://127.0.0.1:9222 chrome-devtools-axi ...` (restart the axi bridge after setting the env). `--force-prefers-reduced-motion` for reduced-motion captures. Lighthouse performance via `npx lighthouse` with `CHROME_PATH` set to that Chromium (the axi lighthouse omits the performance category).
