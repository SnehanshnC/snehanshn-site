"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  protoD,
  protoE,
  protoGround,
  variantLabels,
  type ProtoVariant,
} from "./content";
import styles from "./PristineProto.module.css";

/*
 * TEMPORARY PROTOTYPE AREA - the D->E detonation seam, built twice so the
 * captain picks rung E's identity (docs/adr/rung-e-pristine.md).
 *
 * One self-contained scroll scene per variant: a sticky stage shows a
 * rung D replica, then the three-act detonation plays as ONE scrubbed
 * GSAP timeline (scrub 0.8, native scroll only - ADR 0002 physics):
 *
 *   Act 1 - COLOR: the identity floods from a point via clip-path circle;
 *           grayscale dies.
 *   Act 2 - VOICE: the professional sans copy fades; the editorial serif
 *           statement snaps in, unsettled.
 *   Act 3 - LIFE: chars settle with stagger, the emphasis ignites, the
 *           amber rule draws, the kicker eases in, the cursor pill wakes.
 *
 * Then the stage unpins into a short ground strip (where rung E's real
 * portfolio would begin - deliberately NOT built here).
 *
 * This file never touches the journey's stage/rail/driver/track or any
 * rung directory. Deleted once rung E adopts the winning identity.
 */

/**
 * Beat map, normalized over the 300vh scroll span (the .track is 400vh =
 * 100vh stage + span) - dwell / act 1 / act 2 / act 3 / settle.
 */
const BEAT = {
  flood: { at: 0.24, dur: 0.22 }, // act 1 - COLOR
  copyOut: { at: 0.47, dur: 0.09 }, // act 2 - VOICE (professional fades)
  voiceIn: { at: 0.52, dur: 0.07 }, // act 2 - VOICE (serif snaps in)
  settle: { at: 0.6, dur: 0.12, each: 0.003 }, // act 3 - LIFE (chars)
  ignite: { at: 0.68, dur: 0.08 }, // act 3 - LIFE (emphasis)
  rule: { at: 0.72, dur: 0.09 }, // act 3 - LIFE (the amber thread)
  kicker: { at: 0.76, dur: 0.09 }, // act 3 - LIFE (details ease in)
  pill: { at: 0.82, dur: 0.05 }, // act 3 - LIFE (the cursor wakes)
} as const;

const FLOOD_FROM = "circle(0% at 30% 34%)";
const FLOOD_TO = "circle(150% at 30% 34%)";

/** Split a word into per-char spans (act 3's settle targets). */
function Chars({ word }: { word: string }) {
  return (
    <>
      {Array.from(word).map((ch, i) => (
        <span key={i} className={styles.char} data-proto-char>
          {ch}
        </span>
      ))}
    </>
  );
}

function SplitWords({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className={styles.word}>
            <Chars word={word} />
          </span>{" "}
        </span>
      ))}
    </>
  );
}

/** The rung D pitch block - rendered twice (grayscale, then re-hued). */
function DPitch() {
  return (
    <div className={styles.dPitch}>
      <div className={styles.dRow}>
        <p className={styles.dName}>
          {protoD.name[0]}
          <br />
          {protoD.name[1]}
        </p>
        <p className={`${styles.dMeta} ${styles.dIndex}`}>{protoD.meta.index}</p>
      </div>
      <div className={styles.dRole}>
        {protoD.role.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className={styles.dRow}>
        <p className={styles.dMeta}>{protoD.meta.location}</p>
        <p className={styles.dMeta}>{protoD.meta.year}</p>
      </div>
    </div>
  );
}

export default function PristineProto({ variant }: { variant: ProtoVariant }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: the CSS media block already shows the settled scene
    // statically (no timelines, no trap) - build nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const isNight = variant === "night";

    const ctx = gsap.context((self) => {
      const q = self.selector;
      if (!q) return;
      const chars = q("[data-proto-char]");

      // Rewind the settled CSS truth to each beat's pre-state. Explicit
      // sets (not CSS) so the base stylesheet stays the no-JS/reduced-
      // motion settled truth.
      gsap.set(chars, {
        yPercent: 28,
        rotate: (i: number) => (i % 2 ? 2.2 : -2.2),
      });
      gsap.set(q("[data-proto-rule]"), { scaleX: 0 });
      gsap.set(q("[data-proto-kicker]"), { autoAlpha: 0, y: 14 });
      gsap.set(q("[data-proto-pill]"), { autoAlpha: 0, scale: 0.4 });
      if (isNight) {
        // Ignite tweens the em from body-glow to flare (tokens are fixed
        // hexes - GSAP interpolates literals, not var() strings).
        gsap.set(q("[data-proto-em]"), {
          color: "#e8ecf4",
          textShadow: "0 0 0 rgba(242,163,60,0)",
        });
      } else {
        gsap.set(q("[data-proto-highlight]"), { scaleX: 0 });
      }

      const tl = gsap.timeline({ defaults: { ease: "none" }, paused: true });

      // Act 1 - COLOR
      tl.fromTo(
        q("[data-proto-hued]"),
        { clipPath: FLOOD_FROM },
        {
          clipPath: FLOOD_TO,
          duration: BEAT.flood.dur,
          immediateRender: false,
        },
        BEAT.flood.at,
      );

      // Act 2 - VOICE
      tl.to(
        q("[data-proto-hued-copy]"),
        { autoAlpha: 0, y: -12, duration: BEAT.copyOut.dur },
        BEAT.copyOut.at,
      );
      tl.fromTo(
        q("[data-proto-e]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: BEAT.voiceIn.dur, immediateRender: false },
        BEAT.voiceIn.at,
      );

      // Act 3 - LIFE
      tl.to(
        chars,
        {
          yPercent: 0,
          rotate: 0,
          duration: BEAT.settle.dur,
          ease: "power2.out",
          stagger: { each: BEAT.settle.each },
        },
        BEAT.settle.at,
      );
      if (isNight) {
        tl.to(
          q("[data-proto-em]"),
          {
            color: "#f2a33c",
            textShadow: "0 0 28px rgba(242,163,60,0.4)",
            duration: BEAT.ignite.dur,
          },
          BEAT.ignite.at,
        );
      } else {
        tl.to(
          q("[data-proto-highlight]"),
          { scaleX: 1, duration: BEAT.ignite.dur },
          BEAT.ignite.at,
        );
      }
      tl.to(
        q("[data-proto-rule]"),
        { scaleX: 1, duration: BEAT.rule.dur },
        BEAT.rule.at,
      );
      tl.to(
        q("[data-proto-kicker]"),
        { autoAlpha: 1, y: 0, duration: BEAT.kicker.dur },
        BEAT.kicker.at,
      );
      tl.to(
        q("[data-proto-pill]"),
        {
          autoAlpha: 1,
          scale: 1,
          duration: BEAT.pill.dur,
          ease: "back.out(2.5)",
        },
        BEAT.pill.at,
      );
      // Pad to 1 so the settle dwell maps onto the last stretch of scroll.
      tl.to({}, { duration: 0 }, 1);

      ScrollTrigger.create({
        animation: tl,
        trigger: q("[data-proto-track]")[0],
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8, // ADR 0002: glide comes from scrub lag, never wheel easing
        invalidateOnRefresh: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  const s = protoE.statement;
  const other: ProtoVariant = variant === "night" ? "paper" : "night";

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${styles[variant]}`}
      data-proto-variant={variant}
    >
      <Link href="/proto-pristine" className={styles.badge}>
        proto · {variantLabels[variant]} · D→E seam
      </Link>

      <div className={styles.track} data-proto-track>
        <div className={styles.stage}>
          <div className={styles.dGray} data-proto-d-gray aria-hidden>
            <DPitch />
          </div>

          <div className={styles.dHued} data-proto-hued aria-hidden>
            <div className={styles.floodGlow} />
            <div data-proto-hued-copy>
              <DPitch />
            </div>
          </div>

          <div className={styles.eVoice} data-proto-e>
            <h1 className={`statement ${styles.eStatement}`}>
              <span aria-hidden>
                <SplitWords text={s.pre} />
                <span className={styles.word}>
                  <em className={styles.em} data-proto-em>
                    {variant === "paper" && (
                      <span
                        className={styles.highlight}
                        data-proto-highlight
                      />
                    )}
                    <Chars word={s.emphasis} />
                  </em>
                  <Chars word={s.post} />
                  <span className={styles.pill} data-proto-pill>
                    {protoE.pill}
                  </span>
                </span>
              </span>
              <span className="sr-only">
                {s.pre}
                {s.emphasis}
                {s.post}
              </span>
            </h1>
            <div className={styles.eRule} data-proto-rule />
            <p className={styles.eKicker} data-proto-kicker>
              {protoE.kicker}
            </p>
          </div>
        </div>
      </div>

      <section className={styles.ground}>
        <p className={styles.groundLine}>{protoGround.line}</p>
        <nav className={styles.groundNav} aria-label="Prototype navigation">
          <Link href={`/proto-pristine/${other}`} className={styles.groundLink}>
            view the {variantLabels[other]} variant
          </Link>
          <Link href="/proto-pristine" className={styles.groundLink}>
            back to the prototype index
          </Link>
        </nav>
      </section>

      {/*
       * No JS: mirror the reduced-motion block - collapse the track, drop
       * the D layers, show the settled scene (same pattern as Journey.tsx).
       */}
      <noscript>
        <style>{`
          [data-proto-track] { height: auto !important; }
          [data-proto-track] > div { position: static !important; height: auto !important; overflow: visible !important; }
          [data-proto-d-gray], [data-proto-hued] { display: none !important; }
          [data-proto-e] { position: relative !important; inset: auto !important; min-height: 100svh; opacity: 1 !important; visibility: visible !important; }
          [data-proto-variant="night"] [data-proto-e] { background: var(--void); }
          [data-proto-variant="paper"] [data-proto-e] { background: var(--paper); }
        `}</style>
      </noscript>
    </div>
  );
}
