import type { ComponentType } from "react";
import type { RungId } from "./types";
import { STAGE_RUNGS, TRACK_VH } from "./track";
import RungADress from "./rungs/a/dress";
import RungBDress from "./rungs/b/dress";
import RungCDress from "./rungs/c/dress";
import RungDDress from "./rungs/d/dress";
import RungEDress from "./rungs/e/dress";
import Rail from "./Rail";
import JourneyDriver from "./JourneyDriver";
import styles from "./Journey.module.css";

/*
 * The journey (ADR 0002): a full-viewport sticky stage re-dresses the pitch
 * block through rungs A-D as native scroll advances, then unpins into rung
 * E's document flow. Server component: rung A is the default paint (no JS
 * needed for first paint), every rung E section is SSR'd and crawlable.
 * Timelines attach client-side in JourneyDriver; the rail rides along in
 * Rail. Rung tasks never edit this file - each rung is wired through its
 * directory's meta/dress/seam contract (src/journey/types.ts).
 */

const DRESSES: Record<RungId, ComponentType> = {
  a: RungADress,
  b: RungBDress,
  c: RungCDress,
  d: RungDDress,
  e: RungEDress,
};

export default function Journey() {
  return (
    <>
      <main data-journey-root>
        <div
          data-journey-track
          className={styles.track}
          style={{ height: `${TRACK_VH}vh` }}
        >
          <div data-journey-stage className={styles.stage}>
            {STAGE_RUNGS.map((rung, index) => {
              const Dress = DRESSES[rung.id];
              return (
                <div
                  key={rung.id}
                  data-rung-dress={rung.id}
                  className={
                    index === 0
                      ? styles.layer
                      : `${styles.layer} ${styles.layerHidden}`
                  }
                >
                  <Dress />
                </div>
              );
            })}
          </div>
        </div>
        <div data-rung-dress="e">
          <RungEDress />
        </div>
      </main>
      <Rail />
      <JourneyDriver />
      {/*
       * No JS, no timelines: collapse the scroll track so the visitor gets
       * rung A at natural height followed immediately by rung E's flowing
       * content, and drop the rail (an inert slider would only confuse).
       */}
      <noscript>
        <style>{`
          [data-journey-track] { height: auto !important; }
          [data-journey-stage] { position: static !important; }
          [data-journey-rail] { display: none !important; }
        `}</style>
      </noscript>
    </>
  );
}
