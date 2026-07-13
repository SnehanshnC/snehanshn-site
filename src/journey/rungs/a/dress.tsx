import { journeyRungA } from "@/content";
import styles from "./dress.module.css";

/*
 * RUNG A - RAW: the Bad Pole (docs/adr/rung-a-raw.md).
 *
 * Contract: this file owns the rung's visuals; the arrival seam lives in
 * ./seam.ts (none for A); scroll spans in ./meta.ts; copy in the
 * journeyRungA block in src/content.ts. Nothing outside this directory +
 * that block should need touching to change this rung.
 *
 * This dress ships REAL (not a stub): it is the server-rendered default -
 * the first paint must be rung A without JS. Five timid lines hugging the
 * top-left like a file opened in a browser; the empty white remainder of
 * the viewport IS the design. All lines are paragraphs - the document h1
 * belongs to rung E.0 (ADR 0002 "SEO"). The projects line is deliberately
 * NOT a link (a dead anchor is an accessibility failure; the ADR rejected
 * a live one - nothing on the bad pole works well).
 */
export default function RungADress() {
  return (
    <div className={styles.root}>
      {journeyRungA.lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
