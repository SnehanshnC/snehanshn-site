import { journeyRungD } from "@/content";
import styles from "./dress.module.css";
import "./rail-dress.css";

/*
 * RUNG D - SAFE: genuinely well-made, grayscale, static
 * (docs/adr/rung-d-safe.md "Composition - Swiss editorial hero").
 *
 *   SNEHANSHN                 ·001
 *   CHOWDHURY
 *
 *   Software engineer.
 *   Selected work below.
 *
 *   New Jersey                2026
 *
 * Contract: visuals here; the C->D beat list in ./seam.ts (including this
 * rung's rail re-dress via SeamContext.rail); scroll spans in ./meta.ts;
 * copy in the journeyRungD block in src/content.ts.
 *
 * Semantics under the costume (ADR 0002 constraint 6): everything is a
 * paragraph - the document h1 is rung E.0's statement, and a lower-level
 * heading here would put the name above E's h1 in the outline for no
 * reader benefit. No interactive elements: D is a doorway ("Selected work
 * below." aims at rung E), not a dead end with dead links.
 *
 * data-d-piece marks the five composition pieces the arrival seam settles
 * (transform-only, in DOM order); data-d-name is the display-scale beat's
 * target; data-d-tint is the seam's residual-hue veil (a seam prop - see
 * dress.module.css - decorative, hidden from AT).
 */
export default function RungDDress() {
  return (
    <div className={styles.root}>
      <div className={styles.frame}>
        <div className={styles.row}>
          <p className={styles.name} data-d-piece data-d-name>
            {journeyRungD.name.map((line) => (
              <span key={line} className={styles.nameLine}>
                {line}
              </span>
            ))}
          </p>
          <p className={styles.meta} data-d-piece>
            {journeyRungD.meta.index}
          </p>
        </div>
        <div className={styles.role} data-d-piece>
          {journeyRungD.role.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className={styles.row}>
          <p className={styles.meta} data-d-piece>
            {journeyRungD.meta.location}
          </p>
          <p className={styles.meta} data-d-piece>
            {journeyRungD.meta.year}
          </p>
        </div>
      </div>
      <div className={styles.tint} data-d-tint aria-hidden="true" />
    </div>
  );
}
