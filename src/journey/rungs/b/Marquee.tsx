"use client";

import { useEffect, useRef } from "react";
import { journeyRungB } from "@/content";
import { readJourneyProgress, subscribeJourneyProgress } from "../../progress";
import styles from "./dress.module.css";

/*
 * The marquee headline - rung B's one moving artifact (rung-b-kitsch.md).
 *
 * Two gates, both required before the strip animates (dress.module.css):
 *   - data-b-on: set by the arrival seam's LAST beat ("motion arrives
 *     last, as the punchline"); also flips the strip from a wrapped
 *     static shout into the nowrap loop.
 *   - data-b-live: toggled here from the journey progress store, so the
 *     infinite CSS loop runs only while rung B owns the viewport and
 *     never ticks behind rungs C/D/E after this layer is faded out.
 * Reduced motion: the seam never sets data-b-on and the CSS media block
 * kills the animation regardless - the headline stays a static, wrapped,
 * fully legible shout.
 *
 * Seamless loop: two identical copies, translateX(0 -> -50%). The second
 * copy (and the decorative ASCII arrows) are aria-hidden so the headline
 * reads exactly once. h2, not h1 - the document h1 is rung E.0's
 * statement (ADR 0002 "SEO").
 */
export default function Marquee() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (activeRung: string) => {
      rootRef.current?.toggleAttribute("data-b-live", activeRung === "b");
    };
    apply(readJourneyProgress().activeRung);
    return subscribeJourneyProgress(({ activeRung }) => apply(activeRung));
  }, []);

  const copy = (
    <>
      <span aria-hidden="true">{"<- "}</span>
      {journeyRungB.headline}
      <span aria-hidden="true">{" <-"}</span>
    </>
  );

  return (
    <div ref={rootRef} className={styles.marquee} data-b-marquee>
      <h2 className={styles.strip}>
        <span className={styles.copy}>{copy}</span>
        <span className={styles.copy} aria-hidden="true">
          {copy}
        </span>
      </h2>
    </div>
  );
}
