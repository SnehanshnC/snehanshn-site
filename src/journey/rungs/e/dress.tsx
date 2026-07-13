import type { ReactNode } from "react";
import {
  contact,
  identity,
  journeyRungE,
  offTheClock,
  projects,
  signOff,
  wins,
} from "@/content";
import Cursor from "./salvage/Cursor";
import Ledger from "./salvage/Ledger";
import Sparkline from "./salvage/Sparkline";
import Terminal from "./salvage/Terminal";
import TerminalHint from "./salvage/TerminalHint";
import BreathingCta from "./BreathingCta";
import Tape from "./Tape";
import Motion from "./Motion";
import styles from "./dress.module.css";
import "./rail-dress.css";

/*
 * RUNG E - PRISTINE: the Great Pole, the real portfolio
 * (docs/adr/rung-e-pristine.md). Server component: every section is
 * SSR'd and crawlable, and the base CSS is the SETTLED truth - the page
 * reads complete with no JS and under prefers-reduced-motion. Motion.tsx
 * (client) rewinds elements into their pre-arrival states and scrubs
 * them back in; dress.module.css collapses the showcase to static flow
 * for reduced-motion/no-JS.
 *
 * Contracts that survive any rewrite here (ADR 0002):
 *   - the h1 is E.0's statement (matches the OG image + the Fraunces
 *     italic subset - see the journeyRungE block in src/content.ts);
 *   - section ids `who-i-am` and `hobbies` are 301 targets - never
 *     rename them; all ids double as terminal `goto` targets, and each
 *     heading carries id="<section>-title" tabindex={-1} so goto can
 *     land focus where the scroll goes;
 *   - the fixed bloom/glow layers here are the D->E detonation's COLOR
 *     act, scrubbed by ./seam.ts - CSS keeps them invisible so no-JS
 *     and reduced-motion visitors never see them.
 *
 * The salvage returns here and only here: Cursor (wakes via ../e/wake.ts
 * as the LIFE act's last beat), Terminal + its two doorways (E.0's meta
 * row + the endcap), Ledger (E.3's backbone), Sparkline (the currently
 * strip).
 */

/** What the cursor pill says over a project link (WorkCard's convention). */
function cursorLabel(label: string): string {
  const l = label.toLowerCase();
  if (l === "live site") return "live ↗";
  return `${l} ↗`;
}

/**
 * A char split for the VOICE act's sliced-type materialization (rung E
 * ADR, delicacy menu item 8): each char is two complementary half-glyph
 * slices; the entrance drops the top half from above while the bottom
 * half rises from below, so the serif lands like letterpress. At rest
 * (the CSS truth) both slices sit at 0 = the whole glyph.
 */
function SlicedWord({ word }: { word: string }) {
  return (
    <span className={styles.word}>
      {Array.from(word).map((ch, i) => (
        <span key={i} className={styles.char}>
          <span className={styles.sliceB} data-e-slice-b>
            {ch}
          </span>
          <span className={styles.sliceA} data-e-slice-a aria-hidden="true">
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * The emphasis word: each char is a split-flap box (two stacked copies of
 * the same glyph in a clipped window) so one letter can occasionally roll
 * like a departure board (menu item 5; Motion.tsx owns the idle timer).
 * The flap window is sized for descender-free words - every emphasis word
 * lives in the italic subset (` -06abiklntw`), all descender-free.
 */
function FlapWord({ word }: { word: string }) {
  return (
    <>
      {Array.from(word).map((ch, i) => (
        <span key={i} className={styles.flapChar} data-e-flap-rise>
          <span className={styles.flapStack} data-e-flap>
            <span className={styles.flapCopy}>{ch}</span>
            <span className={styles.flapCopy} aria-hidden="true">
              {ch}
            </span>
          </span>
        </span>
      ))}
    </>
  );
}

/** Section arrival furniture: hairline drawing in from the edges + voiced kicker. */
function SectionHead({
  id,
  children,
}: {
  id: string;
  children?: ReactNode;
}) {
  const section = journeyRungE.sections.find((s) => s.id === id)!;
  return (
    <header className={styles.sectionHead}>
      <div className={styles.rule} data-e-rule aria-hidden="true">
        <span className={styles.ruleHalfL} />
        <span className={styles.ruleHalfR} />
      </div>
      <p className={styles.kicker} data-e-rise>
        {section.kicker}
      </p>
      <h2
        id={`${id}-title`}
        tabIndex={-1}
        className={styles.sectionTitle}
        data-e-rise
      >
        {section.title}
      </h2>
      {children}
    </header>
  );
}

export default function RungEDress() {
  const s = journeyRungE.statement;
  const statementFull = `${s.pre}${s.emphasis}${s.post}`;
  const who = journeyRungE.whoIAm;
  const roll = journeyRungE.honorRoll;
  const close = journeyRungE.close;
  const emailReal = contact.email.href !== "#todo";
  /* Links still awaiting a real URL (`#todo` in content.ts) are not rendered. */
  const socials = [contact.github, contact.linkedin, contact.x].filter(
    (link) => link.href !== "#todo",
  );
  /* Deterministic photo-dump tilts - no randomness, server and client agree. */
  const tilts = [-2.2, 1.6, -1.4, 2.4];

  return (
    <div className={styles.root} data-e-root>
      {/*
       * The detonation's COLOR act (seam.ts): a pre-painted bloom disc,
       * transform-scaled from D's name block, and the warm lamp pooling
       * at its origin. Fixed, inert, CSS-invisible until the seam scrubs
       * them - they cover the pinned stage, never this flow content.
       */}
      <div className={styles.bloom} data-e-bloom aria-hidden="true" />
      <div className={styles.glow} data-e-glow aria-hidden="true" />

      {/* ---- E.0 - the statement hero (the document h1) ------------------ */}
      <section className={styles.hero} data-e-hero>
        <div className={styles.shell}>
          <h1 className={`statement ${styles.heroStatement}`}>
            <span aria-hidden="true" className={styles.heroVisual}>
              {s.pre
                .trim()
                .split(/\s+/)
                .map((word, i) => (
                  <span key={i}>
                    <SlicedWord word={word} />{" "}
                  </span>
                ))}
              <span className={`${styles.word} ${styles.emWord}`}>
                <em className={styles.em}>
                  <span
                    className={styles.highlight}
                    data-e-highlight
                    aria-hidden="true"
                  />
                  <FlapWord word={s.emphasis} />
                </em>
                {Array.from(s.post).map((ch, i) => (
                  <span key={i} className={styles.char}>
                    <span className={styles.sliceB} data-e-slice-b>
                      {ch}
                    </span>
                    <span
                      className={styles.sliceA}
                      data-e-slice-a
                      aria-hidden="true"
                    >
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            </span>
            <span className="sr-only">{statementFull}</span>
          </h1>
          <div className={styles.thread} data-e-thread aria-hidden="true" />
          <div className={styles.heroMeta}>
            <p className={styles.heroKicker} data-e-meta-l>
              {journeyRungE.heroKicker}
            </p>
            <span data-e-meta-r className={styles.heroDoor}>
              <TerminalHint label={journeyRungE.heroDoorway} />
            </span>
          </div>
        </div>
      </section>

      {/* ---- E.1 - who i am (301 target: /about -> /#who-i-am) ----------- */}
      <section
        id="who-i-am"
        aria-labelledby="who-i-am-title"
        className={styles.section}
      >
        <div className={styles.shell}>
          <SectionHead id="who-i-am" />
          <p className={`statement ${styles.lede}`} data-e-rise>
            {who.lede.pre}
            <em className="text-signal">{who.lede.emphasis}</em>
            {who.lede.post}
          </p>
          <div className={styles.whoGrid}>
            <div className={styles.whoWords}>
              <p className={styles.body} data-e-rise>
                {identity.bio}
              </p>
              <p className={styles.mono} data-e-rise>
                {identity.education}
              </p>
              <p className={styles.mono} data-e-rise>
                {identity.kicker}
              </p>
            </div>
            {/*
             * The modest framed portrait - words lead, the photo is
             * furniture. TODO(snehanshn): real portrait - drop a photo in
             * and replace the pending panel with an <img>.
             */}
            <figure
              className={styles.portrait}
              data-e-rise
              aria-hidden="true"
            >
              <div className={styles.portraitBlank}>
                <span className={styles.pendingNote}>
                  {who.portraitPending}
                </span>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ---- E.2 - selected work (SlowMo hang-time showcase) ------------- */}
      <section
        id="projects"
        aria-labelledby="projects-title"
        className={styles.section}
      >
        <div className={styles.shell}>
          <SectionHead id="projects" />
        </div>
        <div className={styles.showcaseTrack} data-e-showcase>
          <div className={styles.showcaseFrame}>
            {projects.map((p, i) => {
              const award = p.metric.fromAward ? undefined : p.awards[0];
              return (
                <article
                  key={p.slug}
                  className={styles.card}
                  data-e-card
                  aria-labelledby={`project-${p.slug}`}
                  style={
                    {
                      "--p": i === 0 ? 0 : 1,
                      "--lift": i === 0 ? 0 : 1,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.cardWords}>
                    <p className={styles.serial}>
                      <span className={styles.ticker}>{p.ticker}</span>
                      <span>
                        {String(i + 1).padStart(3, "0")} /{" "}
                        {String(projects.length).padStart(3, "0")}
                      </span>
                    </p>
                    <h3
                      id={`project-${p.slug}`}
                      className={`statement ${styles.cardTitle}`}
                    >
                      {p.name}
                      <span className={styles.cardTagline}>
                        {" "}
                        · {p.tagline}
                      </span>
                    </h3>
                    <p className={styles.cardMetric}>
                      <span className={styles.metricValue}>
                        {p.metric.value}
                      </span>{" "}
                      {p.metric.label}
                    </p>
                    <p className={styles.cardDesc}>{p.description}</p>
                    {p.role && <p className={styles.cardRole}>{p.role}</p>}
                    <p className={styles.cardFoot}>
                      <a
                        href={p.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor={cursorLabel(p.link.label)}
                        data-e-card-link
                        className={styles.cardLink}
                      >
                        {p.link.label}
                        <span aria-hidden="true"> ↗</span>
                      </a>
                      {award && (
                        <span className={styles.awardTag}>{award.badge}</span>
                      )}
                    </p>
                  </div>
                  {/*
                   * BLANK plug-and-play media slot (rung E ADR): sized and
                   * framed for a real screenshot/video.
                   * TODO(snehanshn): real screenshot - add media {src, alt}
                   * to this project in content.ts and it lands here.
                   */}
                  <div
                    className={styles.cardPane}
                    data-e-pane
                    aria-hidden={p.media ? undefined : true}
                  >
                    {p.media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.media.src}
                        alt={p.media.alt}
                        className={styles.paneMedia}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.paneBlank}>
                        <span className={styles.paneTicker}>{p.ticker}</span>
                        <span className={styles.pendingNote}>
                          {journeyRungE.showcase.mediaPending}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- E.3 - experience (the salvaged mono ledger) ------------------ */}
      <section
        id="experience"
        aria-labelledby="experience-title"
        className={styles.section}
      >
        <div className={styles.shell}>
          <SectionHead id="experience" />
          <div className={styles.ledgerWrap} data-e-ledger>
            <Ledger />
          </div>
        </div>
      </section>

      {/* ---- E.4 - awards (big-type honor roll) --------------------------- */}
      <section
        id="awards"
        aria-labelledby="awards-title"
        className={styles.section}
      >
        <div className={styles.shell}>
          <SectionHead id="awards" />
          <p className={`statement ${styles.lede}`} data-e-rise>
            {roll.lede.pre}
            <em className="text-signal">{roll.lede.emphasis}</em>
            {roll.lede.post}
          </p>
          <p className={styles.counterLine} data-e-rise>
            <span
              className={styles.counterNum}
              data-e-counter
              data-count={wins.length}
              aria-hidden="true"
            >
              {wins.length}
            </span>
            <span aria-hidden="true"> {roll.counterLabel}</span>
            <span className="sr-only">
              {wins.length} {roll.counterLabel}
            </span>
          </p>
          <ul className={styles.roll}>
            {wins.map((w) => (
              <li
                key={`${w.detail}-${w.year}`}
                className={styles.rollLine}
                data-e-roll-line
              >
                <span className={styles.rollClip}>
                  <span className={styles.rollInner} data-e-roll>
                    <span className={`statement ${styles.rollPlacement}`}>
                      {w.placement}
                    </span>
                    <span className={`statement ${styles.rollDetail}`}>
                      {w.detail}
                    </span>
                    <span className={styles.rollMeta}>
                      {w.context} · {w.year}
                    </span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- E.5 - hobbies (301 target: /fun -> /#hobbies) ---------------- */}
      <section
        id="hobbies"
        aria-labelledby="hobbies-title"
        className={styles.section}
      >
        <div className={styles.shell}>
          <SectionHead id="hobbies" />
          {/*
           * The photo dump - loose prints on the desk, deterministic tilts.
           * TODO(snehanshn): real photos (src under /public + alt text in
           * content.ts) light these up; pending slots stay quiet wash.
           */}
          <div className={styles.dump}>
            {offTheClock.photoSlots.map((slot, i) => (
              <figure
                key={slot.alt}
                className={styles.dumpSlot}
                data-e-toss
                data-rot={tilts[i % tilts.length]}
                style={{ "--rot": `${tilts[i % tilts.length]}deg` } as React.CSSProperties}
                aria-hidden={slot.src ? undefined : true}
              >
                {slot.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slot.src}
                    alt={slot.alt}
                    className={styles.dumpImg}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.dumpBlank}>
                    <span className={styles.pendingNote}>
                      {journeyRungE.hobbies.photoPending}
                    </span>
                  </div>
                )}
              </figure>
            ))}
          </div>
          <p className={styles.currently} data-e-rise>
            <span className={styles.currentlyLabel}>
              {journeyRungE.hobbies.currentlyLabel}
            </span>
            <span className={styles.currentlyText}>
              {offTheClock.currently}
            </span>
            <Sparkline className={styles.spark} />
          </p>
        </div>
      </section>

      {/* ---- E.6 - contact (the Coleman close) ---------------------------- */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className={`${styles.section} ${styles.closeSection}`}
      >
        <div className={styles.shell}>
          <SectionHead id="contact" />
          <h3 className={`statement ${styles.closeStatement}`}>
            <span className={styles.closeClip}>
              <span className={styles.closeInner} data-e-close>
                {close.statement.pre}
                <em className="text-signal">{close.statement.emphasis}</em>
                {close.statement.post}
              </span>
            </span>
          </h3>
          <div className={styles.closeCta} data-e-rise>
            <BreathingCta
              emailHref={emailReal ? contact.email.href : undefined}
              emailLabel={close.emailCta}
            />
            <p className={styles.closeSub}>{close.sub}</p>
          </div>
          <ul className={styles.socials} data-e-rise>
            {socials.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor={`${link.label.toLowerCase()} ↗`}
                  className={styles.socialLink}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- the endcap: whisper tape, sign-off, the second doorway ------- */}
      <div className={styles.endcap}>
        <div className={styles.shell}>
          <Tape text={journeyRungE.tape} />
          <div className={styles.endRow}>
            <p className={styles.mono}>{signOff}</p>
            <TerminalHint />
          </div>
        </div>
      </div>

      {/* The fingertips: the talking cursor + the night-desk terminal. */}
      <Cursor />
      <Terminal />
      <Motion />

      {/*
       * No JS: the showcase collapses to static flow (mirroring the
       * reduced-motion block in dress.module.css) so all six projects
       * read stacked; everything else already renders settled.
       */}
      <noscript>
        <style>{`
          [data-e-showcase] { height: auto !important; }
          [data-e-showcase] > div { position: static !important; height: auto !important; overflow: visible !important; }
          [data-e-card] { position: relative !important; inset: auto !important; transform: none !important; margin-bottom: 24px; }
          [data-e-bloom], [data-e-glow] { display: none !important; }
        `}</style>
      </noscript>
    </div>
  );
}
