<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# snehanshn.com - agent notes

Personal portfolio for Snehanshn Chowdhury.
Next.js App Router + TypeScript + Tailwind v4 + Framer Motion. Dark theme only, no toggle.

## Design tokens (the night-desk palette)

Defined once in `src/app/globals.css`, exposed to Tailwind via `@theme inline` (`text-noise`, `bg-surface`, etc).
Six tokens, no more:

| Token | Hex | Use |
| --- | --- | --- |
| `--void` | `#0a0e16` | page background, blue-tinted night |
| `--surface` | `#101622` | raised panels, cards, terminal |
| `--trace` | `#2a3550` | hairlines, borders |
| `--noise` | `#8b93a7` | secondary text, canvas particles |
| `--glow` | `#e8ecf4` | primary text |
| `--signal` | `#f2a33c` | the single accent (amber). Spend it sparingly: pulses, focus rings, badges. |

Type: `font-display` = Archivo (name + section headers only), `font-sans` = IBM Plex Sans (body), `font-mono` = IBM Plex Mono (kickers, labels, numbers, terminal).

Rules of taste: one accent color, at most one playful line per section, hovers are 150ms-ish and quiet.
The hero canvas is the only bold element on the page; everything else stays disciplined.

## The signature (`src/components/MarketFlow.tsx`)

Raw canvas 2D field: particles drifting along bezier arcs between three unlabeled nodes, with a periodic amber "arbitrage pulse" tracing a two-hop route.
Tuning constants live at the top of the file:

- `DESKTOP_PARTICLES` 520 / `MOBILE_PARTICLES` 110 (breakpoint 768px)
- `PULSE_EVERY_MS` 4.2-7.5s apart, `PULSE_DURATION_MS` 1500, trail = 22% of route
- `DRIFT_SPEED` 0.000016 progress/ms - keep it slow; the mood is calm, not screensaver
- `DPR_CAP` = 2

Behavior contracts (do not regress): static frame under `prefers-reduced-motion`; a synchronous first frame is painted on resize so the canvas is never blank even where rAF stalls (headless screenshots); animation pauses when the tab is hidden or the canvas leaves the viewport.

Entrance reveals use the CSS `.rise` keyframe in `globals.css`, not Framer Motion - rAF-driven entrance animations freeze at opacity 0 in headless capture environments (screenshots, Lighthouse). Framer Motion is reserved for interactive/scroll work.

## Content

Every word of copy and every data item lives in `src/content.ts`, typed.
Anything mocked carries a `// TODO(snehanshn)` marker - swapping mock for real is a single-file edit.
Privacy: phone number and street address must never appear in the repo or the site.
Awards render as badges on project cards, never as a separate trophy section.

## Dev

- `npm run dev` / `npm run build && npm run start`
- Screenshots for review live under `docs/screenshots/`.
