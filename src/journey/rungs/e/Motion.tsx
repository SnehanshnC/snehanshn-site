"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SlowMo } from "gsap/EasePack";
import { readJourneyProgress, subscribeJourneyProgress } from "../../progress";
import { setCursorWake } from "./wake";
import styles from "./dress.module.css";

/*
 * Rung E's motion driver (rung-e-pristine.md "The motion language" -
 * binding). Renderless client component; the DOM it drives is
 * server-rendered by dress.tsx whose CSS is the settled truth, so every
 * tween here REWINDS an element into its pre-arrival state (fromTo,
 * immediateRender: false) and scrubs it back in. Native scroll only -
 * glide comes from scrub: 0.8, never wheel re-interpretation.
 *
 * These are dress-level triggers inside E's document flow, all targeting
 * elements this rung owns exclusively - the master-timeline rule exists
 * for seams sharing stage targets, which none of these touch.
 *
 * What runs here:
 *   - Acts 2+3 of the detonation (VOICE + LIFE), scrubbed by E.0's own
 *     rise through the viewport right as the stage unpins: sliced-type
 *     chars land like letterpress, the flare marker swipes the emphasis
 *     word, the amber thread draws, mono labels slide in from
 *     alternating sides, and the cursor wakes LAST (./wake.ts).
 *   - The E.2 SlowMo hang-time engine (decided mechanic 1): one scrubbed
 *     timeline, one progress number per project on slow(0.15, 0.6), CSS
 *     composes the whole transform; media panes take content-visibility
 *     and links take tabindex outside their scroll window (the words
 *     column stays in the accessibility tree - stricter than wodniack).
 *   - Hairline draw-ins from the edges + gentle rises for every section.
 *   - The honor roll's clipped line reveals + the scrubbed win counter.
 *   - The emphasis word's split-flap idle roll: one letter, every
 *     20-40s, hero in view, tab visible - the page is alive without
 *     background motion.
 *
 * Reduced motion: none of the above is built; the page reads complete
 * and static from CSS alone. The cursor still wakes at rung E (it snaps
 * instead of lerping) via a threshold on the journey's progress store.
 */
export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.querySelector<HTMLElement>("[data-e-root]");
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const apply = ({ activeRung }: { activeRung: string }) =>
        setCursorWake(activeRung === "e" ? 1 : 0);
      apply(readJourneyProgress());
      const unsubscribe = subscribeJourneyProgress(apply);
      return () => {
        unsubscribe();
        setCursorWake(0);
      };
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: Array<() => void> = [];

      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);

        /* ---- E.0: VOICE + LIFE, scrubbed by the hero's rise ---------- */
        const hero = root.querySelector<HTMLElement>("[data-e-hero]");
        if (hero) {
          const tl = gsap.timeline({ defaults: { ease: "none" } });
          // The serif lands as letterpress: bottom half-glyphs rise while
          // top halves drop, 0.007 per-char stagger (the study's 0.02
          // grammar compressed onto a scrubbed unit timeline).
          tl.fromTo(
            q("[data-e-slice-b]"),
            { yPercent: 135 },
            {
              yPercent: 0,
              duration: 0.34,
              ease: "expo.inOut",
              stagger: { each: 0.007 },
              immediateRender: false,
            },
            0,
          );
          tl.fromTo(
            q("[data-e-slice-a]"),
            { yPercent: -135 },
            {
              yPercent: 0,
              duration: 0.34,
              ease: "expo.inOut",
              stagger: { each: 0.007 },
              immediateRender: false,
            },
            0.045,
          );
          // The emphasis word arrives whole (its flap boxes rise as
          // units) and earns its marker swipe.
          tl.fromTo(
            q("[data-e-flap-rise]"),
            { yPercent: 135 },
            {
              yPercent: 0,
              duration: 0.3,
              ease: "expo.inOut",
              stagger: 0.02,
              immediateRender: false,
            },
            0.3,
          );
          tl.fromTo(
            q("[data-e-highlight]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.12,
              ease: "power2.inOut",
              immediateRender: false,
            },
            0.6,
          );
          // The amber thread draws itself in...
          tl.fromTo(
            q("[data-e-thread]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.14,
              ease: "power3.inOut",
              immediateRender: false,
            },
            0.66,
          );
          // ...mono labels slide in from alternating sides...
          tl.fromTo(
            q("[data-e-meta-l]"),
            { x: -28, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.12,
              ease: "power2.out",
              immediateRender: false,
            },
            0.74,
          );
          tl.fromTo(
            q("[data-e-meta-r]"),
            { x: 28, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.12,
              ease: "power2.out",
              immediateRender: false,
            },
            0.78,
          );
          // ...and the cursor pill wakes last. A scrubbed proxy, so
          // scrolling back toward D reverses the resurrection.
          const wakeProxy = { v: 0 };
          tl.fromTo(
            wakeProxy,
            { v: 0 },
            {
              v: 1,
              duration: 0.12,
              onUpdate: () => setCursorWake(wakeProxy.v),
              immediateRender: false,
            },
            0.86,
          );
          tl.to({}, { duration: 0 }, 1);
          ScrollTrigger.create({
            animation: tl,
            trigger: hero,
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          });
        }

        /* ---- E.2: the SlowMo hang-time showcase ---------------------- */
        const track = root.querySelector<HTMLElement>("[data-e-showcase]");
        if (track) {
          const cards = Array.from(
            track.querySelectorAll<HTMLElement>("[data-e-card]"),
          );
          const cardLinks = cards.map((card) =>
            Array.from(card.querySelectorAll<HTMLElement>("a, button")),
          );
          const SLOW = SlowMo.config(0.15, 0.6) as (t: number) => number;
          const DUR = 1;
          const STEP = 0.8;
          const HOLD = 0.3; // seated hold on the last print before unpin
          const windows: Array<[number, number]> = [];
          const tl = gsap.timeline({ defaults: { ease: "none" } });

          cards.forEach((card, k) => {
            const at = k * STEP;
            const last = k === cards.length - 1;
            if (last) {
              // The last print stays on the desk: only the entry half of
              // the SlowMo curve, re-scaled so it still rushes in and
              // eases into its hang - then holds seated through unpin.
              tl.fromTo(
                card,
                { "--p": 1 },
                {
                  "--p": 0,
                  duration: DUR / 2,
                  ease: (t: number) => 2 * SLOW(t * 0.5),
                  immediateRender: true,
                },
                at,
              );
              tl.fromTo(
                card,
                { "--lift": 1 },
                { "--lift": 0, duration: DUR / 2, immediateRender: true },
                at,
              );
              windows.push([at, at + DUR / 2 + HOLD]);
            } else {
              // Rush in fast, hang readable, rush out - one tween, one
              // number, the ease is the whole trick.
              tl.fromTo(
                card,
                { "--p": 1 },
                {
                  "--p": -1,
                  duration: DUR,
                  ease: SLOW,
                  immediateRender: true,
                },
                at,
              );
              // The soft shadow dies as the print settles flat, returns
              // as it lifts away under the next one.
              tl.fromTo(
                card,
                { "--lift": 1 },
                { "--lift": 0, duration: DUR / 2, immediateRender: true },
                at,
              );
              tl.to(card, { "--lift": 1, duration: DUR / 2 }, at + DUR / 2);
              windows.push([at, at + DUR]);
            }
          });
          tl.to({}, { duration: HOLD }, (cards.length - 1) * STEP + DUR / 2);

          // Outside its scroll window a card's decorative pane stops
          // rendering (content-visibility) and its link leaves the tab
          // order (focus must never land on a clipped-away card). The
          // words stay in the accessibility tree throughout. Pure
          // f(scroll) - deterministic and reversible.
          const MARGIN = 0.12;
          const applyWindows = (self: ScrollTrigger) => {
            const t = self.progress * tl.duration();
            cards.forEach((card, k) => {
              const [a, b] = windows[k];
              const active = t >= a - MARGIN && t <= b + MARGIN;
              card.classList.toggle(styles.cardOff, !active);
              for (const el of cardLinks[k]) {
                el.tabIndex = active ? 0 : -1;
              }
            });
          };
          ScrollTrigger.create({
            animation: tl,
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: applyWindows,
            onRefresh: applyWindows,
          });
          cleanups.push(() => {
            cards.forEach((card, k) => {
              card.classList.remove(styles.cardOff);
              for (const el of cardLinks[k]) el.removeAttribute("tabindex");
            });
          });
        }

        /* ---- section hairlines: drawn from the edges inward ----------- */
        for (const rule of q("[data-e-rule]")) {
          gsap.fromTo(
            rule.children,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "power2.inOut",
              immediateRender: false,
              scrollTrigger: {
                trigger: rule,
                start: "top 96%",
                end: "top 74%",
                scrub: 0.8,
              },
            },
          );
        }

        /* ---- gentle typeset rises, one trigger per element ------------ */
        for (const el of q("[data-e-rise]")) {
          gsap.fromTo(
            el,
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: el,
                start: "top 94%",
                end: "top 76%",
                scrub: 0.8,
              },
            },
          );
        }

        /* ---- E.3: the ledger's rows surface in sequence ---------------- */
        const ledger = root.querySelector<HTMLElement>("[data-e-ledger]");
        if (ledger) {
          gsap.fromTo(
            ledger.querySelectorAll("li"),
            { y: 18, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.06,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: ledger,
                start: "top 90%",
                end: "top 55%",
                scrub: 0.8,
              },
            },
          );
        }

        /* ---- E.4: honor-roll mask reveals + the counting ticker -------- */
        for (const line of q("[data-e-roll]")) {
          gsap.fromTo(
            line,
            { yPercent: 112 },
            {
              yPercent: 0,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: line.closest("[data-e-roll-line]") ?? line,
                start: "top 96%",
                end: "top 80%",
                scrub: 0.8,
              },
            },
          );
        }

        const counter = root.querySelector<HTMLElement>("[data-e-counter]");
        if (counter) {
          const target = Number(counter.dataset.count ?? "0");
          const proxy = { n: target };
          gsap.fromTo(
            proxy,
            { n: 0 },
            {
              n: target,
              ease: "none",
              immediateRender: false,
              onUpdate: () => {
                counter.textContent = String(Math.round(proxy.n));
              },
              scrollTrigger: {
                trigger: counter,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.8,
              },
            },
          );
        }

        /* ---- E.5: prints tossed onto the desk -------------------------- */
        for (const slot of q("[data-e-toss]")) {
          const rot = Number((slot as HTMLElement).dataset.rot ?? "0");
          gsap.fromTo(
            slot,
            { y: 36, rotation: rot * 3, autoAlpha: 0 },
            {
              y: 0,
              rotation: rot,
              autoAlpha: 1,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: slot,
                start: "top 96%",
                end: "top 78%",
                scrub: 0.8,
              },
            },
          );
        }

        /* ---- E.6: the close's statement rises through its clip --------- */
        const closeInner = root.querySelector<HTMLElement>("[data-e-close]");
        if (closeInner) {
          gsap.fromTo(
            closeInner,
            { yPercent: 115 },
            {
              yPercent: 0,
              ease: "expo.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: closeInner,
                start: "top 95%",
                end: "top 70%",
                scrub: 0.8,
              },
            },
          );
        }
      }, root);

      /* ---- the split-flap idle roll (plain DOM, no timeline) ---------- */
      const flaps = Array.from(
        root.querySelectorAll<HTMLElement>("[data-e-flap]"),
      );
      const heroEl = root.querySelector<HTMLElement>("[data-e-hero]");
      let flapTimer = 0;
      let heroInView = false;
      let io: IntersectionObserver | null = null;
      const onFlapEnd = (e: Event) => {
        (e.currentTarget as HTMLElement).classList.remove(styles.flapRolling);
      };
      if (flaps.length && heroEl) {
        for (const flap of flaps) {
          flap.addEventListener("animationend", onFlapEnd);
        }
        io = new IntersectionObserver(
          ([entry]) => {
            heroInView = entry.isIntersecting;
          },
          { threshold: 0.3 },
        );
        io.observe(heroEl);
        const tick = () => {
          if (heroInView && !document.hidden) {
            const flap = flaps[Math.floor(Math.random() * flaps.length)];
            flap.classList.add(styles.flapRolling);
          }
          flapTimer = window.setTimeout(tick, 20000 + Math.random() * 20000);
        };
        flapTimer = window.setTimeout(tick, 14000);
      }

      return () => {
        ctx.revert();
        for (const cleanup of cleanups) cleanup();
        window.clearTimeout(flapTimer);
        io?.disconnect();
        for (const flap of flaps) {
          flap.removeEventListener("animationend", onFlapEnd);
          flap.classList.remove(styles.flapRolling);
        }
        setCursorWake(0);
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return null;
}
