import { journeyRungC } from "@/content";
import LearnMoreButton from "./LearnMoreButton";
import styles from "./dress.module.css";
import "./rail-dress.css";

/*
 * RUNG C - AI-BLAND: the soulless SaaS template (docs/adr/rung-c-ai-bland.md).
 *
 * Gradient hero + two pill CTAs + the three-emoji-card row. Purely generic
 * parody - no old-site winks; the joke is "I've seen this exact template a
 * thousand times". Semantics stay correct under the costume: real heading
 * (h2 - the document h1 belongs to rung E.0, ADR 0002 "SEO"), real links
 * and buttons (the journey's first WORKING interactions: a real mailto and
 * a real smooth-scroll forward), cards as a real list.
 *
 * Server component on purpose: the markup is static; only LearnMoreButton
 * crosses the client boundary. All styling is the SETTLED template state -
 * the seam (./seam.ts) dresses the chaos-era pre-states at runtime via the
 * data-c-* hooks below.
 *
 * Contract: visuals here; the B->C beat list in ./seam.ts (including this
 * rung's rail re-dress via SeamContext.rail); scroll spans in ./meta.ts;
 * copy in the journeyRungC block in src/content.ts.
 */
export default function RungCDress() {
  return (
    <div className={styles.root}>
      <div className={styles.chaosWash} data-c-chaos-wash aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.hero}>
          <h2 className={styles.headline} data-c-headline>
            {journeyRungC.hero}
          </h2>
          <p className={styles.subline} data-c-subline>
            {journeyRungC.subline}
          </p>
          <div className={styles.ctas} data-c-ctas>
            <a
              className={`${styles.button} ${styles.buttonPrimary}`}
              href={journeyRungC.getInTouchHref}
            >
              <span
                className={styles.skinBevel}
                data-c-skin-bevel
                aria-hidden="true"
              />
              <span
                className={styles.skinPill}
                data-c-skin-pill
                aria-hidden="true"
              />
              <span className={styles.buttonLabel} data-c-button-label>
                {journeyRungC.ctas.getInTouch}
              </span>
            </a>
            <LearnMoreButton
              className={`${styles.button} ${styles.buttonGhost}`}
            >
              <span
                className={styles.skinBevel}
                data-c-skin-bevel
                aria-hidden="true"
              />
              <span
                className={styles.skinPill}
                data-c-skin-pill
                aria-hidden="true"
              />
              <span className={styles.buttonLabel} data-c-button-label>
                {journeyRungC.ctas.learnMore}
              </span>
            </LearnMoreButton>
          </div>
        </div>
        <ul className={styles.cards} data-c-cards>
          {journeyRungC.cards.map((card) => (
            <li key={card.title} className={styles.card} data-c-card>
              <span className={styles.cardEmoji} aria-hidden="true">
                {card.emoji}
              </span>
              <p className={styles.cardTitle}>{card.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
