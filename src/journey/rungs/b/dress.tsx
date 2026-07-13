import { journeyRungB } from "@/content";
import Marquee from "./Marquee";
import styles from "./dress.module.css";

/*
 * RUNG B - KITSCH: effort without taste (docs/adr/rung-b-kitsch.md).
 *
 * The centered shout-stack: marquee headline, shouted body lines, gray 3D
 * bevel buttons - the same five facts as rung A, now SHOUTED, in the
 * lime-on-magenta crime. Two artifacts only per the ADR's restraint rule
 * (marquee + bevel/clash backbone); rejected artifacts (hit counter,
 * sparkle cursor) stay rejected.
 *
 * Semantics under the costume (ADR 0002 constraint 6): a real heading
 * (h2 - the document h1 is rung E.0's statement), real paragraphs, real
 * <button>s. The buttons are decorative on purpose - CSS press-effect,
 * no action, aria-disabled so SR users get the joke without a trap:
 * nothing works well on the bad pole (consistent with rung A's inert
 * non-link).
 *
 * Contract: visuals here; the A->B beat list in ./seam.ts (including the
 * rail's bevel re-dress); scroll spans in ./meta.ts; copy in the
 * journeyRungB block in src/content.ts.
 */
export default function RungBDress() {
  return (
    <div className={styles.root}>
      <Marquee />
      <div className={styles.body}>
        {journeyRungB.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className={styles.buttons}>
        {journeyRungB.buttons.map((label) => (
          <button
            key={label}
            type="button"
            className={styles.button}
            aria-disabled="true"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
