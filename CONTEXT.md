# CONTEXT

Glossary of the domain language for snehanshn.com's journey redesign.

## Terms

- **Journey** - the single scroll-based experience that IS the site. Carries the visitor from the Bad Pole to the Great Pole.
- **Pole** - one of the two ends of the journey: *intentionally bad* and *genuinely great*. The journey is defined by its poles, not by web-design eras.
- **Rung** - one authored version of the site along the journey. Five exist: A (RAW), B (KITSCH), C (AI-BLAND), D (SAFE), E (PRISTINE). Each rung is a complete, deliberate design.
- **Seam** (also "morph") - the scroll-driven staggered-renovation transition between two adjacent rungs. Owned by the ADR of the rung being arrived at.
- **Beat** - one property flip or short tween inside a seam, tied to a scroll offset. Scrubbed and exactly reversible.
- **Stage** - the full-viewport `position: sticky` region that owns rungs A-D; it unpins into rung E's normal document flow.
- **Dwell** - the scroll distance a rung holds stable before its departure seam begins (A ~100vh, B ~75vh, C ~75vh, D ~100vh).
- **Rail** - the persistent bottom-edge progress affordance, labeled at the poles, scrubbable (click/drag smooth-scrolls). Re-dressed at every rung.
- **Hard-sell axis** - the copy dimension borrowed from getcoleman.com: as design quality rises, self-promotion intensity rises. Timid at the Bad Pole, max hard sell at the Great Pole.
- **Pitch block** - the shared content unit rungs A-D each re-dress: who I am plus the sell, rewritten per rung.
- **Detonation** - the D->E climax seam's three acts: COLOR (hue floods), VOICE (serif + max-sell copy), LIFE (motion wakes, stage unpins).
- **Plug-and-play slot** - a blank, framed media placeholder (projects, photo dump) carrying a `// TODO(snehanshn)` marker so a real asset drops in as a single-file edit.
