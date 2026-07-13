/**
 * Every word of copy and every data item on the site lives here.
 * Swap a mock for the real thing by editing this file only.
 * Anything marked `TODO(snehanshn)` is a placeholder awaiting real data.
 */

export type Award = {
  /** Short badge text rendered inline on a work card, e.g. "1st @ HackNYU" */
  badge: string;
  /** Full award name, used for accessibility / terminal output */
  full: string;
};

/** Abstract cover motif drawn by Cover.tsx - one per project, says what the thing does. */
export type CoverMotif =
  | "depth" // stepped depth-chart line (trading infra)
  | "routes" // fan of routed arrows (application automation)
  | "graph" // nodes and edges (knowledge graphs)
  | "blocks" // parquet block grid (data marketplace)
  | "wave" // speech waveform (speaking coach)
  | "pulse"; // EKG line (field medic)

export type Project = {
  slug: string;
  /** 4-char instrument code - the market-desk whisper on cards and in the terminal. */
  ticker: string;
  name: string;
  tagline: string;
  description: string;
  role?: string;
  /** Headline stat for the card metadata line. */
  metric: { value: string; label: string; fromAward?: boolean };
  awards: Award[];
  link: { label: string; href: string };
  /**
   * Cover hue (CSS hue degrees) + motif for the designed abstract cover.
   * TODO(snehanshn): real screenshot per card - replace the generated
   * cover by adding a `coverSrc` under /public and wiring it in WorkCard.
   */
  cover: { hue: number; motif: CoverMotif };
};

export type Experience = {
  company: string;
  role: string;
  /** Year shown in the ledger column. */
  year: string;
  period: string;
  summary: string;
  /** Real URL only - rows without an href render as plain text. */
  href?: string;
};

export const identity = {
  name: "Snehanshn Chowdhury",
  /** One-word role next to the name in the nav. */
  navRole: "engineer",
  /**
   * The statement hero. Rendered as pre + <em>emphasis</em> + post.
   * Candidates considered:
   *  1. "I'm Snehanshn. I build systems that don't *wait*."  <- chosen
   *  2. "I'm Snehanshn. I like problems where the clock is the *opponent*."
   *  3. "I'm Snehanshn. I move data faster than markets *blink*."
   */
  statement: {
    pre: "I’m Snehanshn. I build systems that don’t ",
    emphasis: "wait",
    post: ".",
  },
  /** The latency joke the cursor tells over the hero name. */
  latencyJoke: "~2ms",
  /** /fun statement - one notch more playful. */
  funStatement: {
    pre: "Weekends go to hackathons. The record is ",
    emphasis: "6-0",
    post: ".",
  },
  /** /about statement. */
  aboutStatement: {
    pre: "I move data faster than markets ",
    emphasis: "blink",
    post: ".",
  },
  kicker: "Rutgers CS + Math · Founding engineer @ NovaFlow (YC S25)",
  heroLine: "Real-time infrastructure for markets that don't wait.",
  // TODO(snehanshn): replace placeholder bio with your own two sentences.
  bio: "I spend most of my time on real-time systems: streaming Solana DEX data, catching arbitrage in milliseconds, and lately orchestrating agents over terabytes of genomics data. I like problems where the clock is the opponent.",
  education: "Rutgers University · B.S. Computer Science & Mathematics",
} as const;

export const projects: Project[] = [
  {
    slug: "yuno",
    ticker: "YUNO",
    name: "Yuno Research",
    tagline: "Solana trading infrastructure",
    metric: { value: "5M+", label: "swaps/day · ~60% of DEX volume" },
    description:
      "On-chain prop desk streaming live gRPC data from Raydium, Orca, and Meteora to catch AMM arbitrage in milliseconds. Rust ingestion engine hitting 5GB/s disk saturation; 5M+ swaps processed daily across roughly 60% of DEX volume.",
    role: "Co-founder & lead infrastructure engineer, led an 8-person team",
    awards: [],
    link: { label: "GitHub", href: "https://github.com/yuno-research" },
    cover: { hue: 226, motif: "depth" },
  },
  {
    slug: "algora",
    ticker: "ALGR",
    name: "Algora",
    tagline: "AI job application automation",
    metric: { value: "+300%", label: "application throughput" },
    description:
      "Scrapes GitHub, LinkedIn, and job boards to build developer portfolios, match roles, and autofill applications. LLaMA-based skill extraction; +300% application throughput.",
    awards: [{ badge: "1st @ HackNYU '25", full: "1st Place Overall @ HackNYU 2025" }],
    link: { label: "Devpost", href: "https://devpost.com/software/algora" },
    cover: { hue: 174, motif: "routes" },
  },
  {
    slug: "synapse",
    ticker: "SNPS",
    name: "Synapse",
    tagline: "videos into knowledge graphs",
    metric: { value: "1st", label: "education @ HackRU '25", fromAward: true },
    description:
      "Turns short-form video into structured knowledge graphs with OCR, transcription, and GraphRAG over Neo4j for cross-context retrieval.",
    awards: [
      {
        badge: "1st, Education @ HackRU '25",
        full: "1st Place, Education Track @ HackRU 2025",
      },
    ],
    link: {
      label: "Devpost",
      href: "https://devpost.com/software/synapse-2bs4hv",
    },
    cover: { hue: 262, motif: "graph" },
  },
  {
    slug: "quarry",
    ticker: "QRRY",
    name: "Quarry",
    tagline: "AI data marketplace",
    metric: { value: "x402", label: "Solana micropayments" },
    description:
      "Schema-only marketplace where AI agents preview datasets through DuckDB queries and buy slices with Solana x402 micropayments. Parquet pipelines with IPFS verification.",
    awards: [],
    link: { label: "Live site", href: "https://www.quarry-ai.net/" },
    cover: { hue: 96, motif: "blocks" },
  },
  {
    slug: "instructifai",
    ticker: "INST",
    name: "InstructifAI",
    tagline: "AI public speaking coach",
    metric: {
      value: "2nd",
      label: "education + best gen AI @ HackRU '25",
      fromAward: true,
    },
    description:
      "Real-time audience engagement analysis from facial expressions and speech (Whisper + Deepgram) with a live feedback dashboard.",
    awards: [
      {
        badge: "2nd, Education + Best Gen AI @ HackRU '25",
        full: "2nd Place Education + Best Use of Gen AI @ HackRU 2025",
      },
    ],
    link: { label: "DoraHacks", href: "https://dorahacks.io/buidl/22372" },
    cover: { hue: 340, motif: "wave" },
  },
  {
    slug: "medify",
    ticker: "MDFY",
    name: "Medify",
    tagline: "AI field medic assistant",
    metric: {
      value: "3rd",
      label: "+ best EM-AI @ HackNJIT '24",
      fromAward: true,
    },
    description:
      "Computer vision that analyzes injury images and generates spoken treatment guidance with multimodal AI.",
    awards: [
      {
        badge: "3rd + Best EM-AI @ HackNJIT '24",
        full: "3rd Place + Best Innovation in Emergency Medical AI @ HackNJIT 2024",
      },
    ],
    link: {
      label: "Devpost",
      href: "https://devpost.com/software/medify-khoaid",
    },
    cover: { hue: 16, motif: "pulse" },
  },
];

/** One line for the terminal's `cat awards` tail. */
export const otherWins =
  "Also: xAI Hackathon Select (420 of 50,000), Jersey CTF Winner, Best Freshman Hack @ HackRU 2024 (FraxAI), 2nd Place @ Rutgers Road to Silicon Valley.";

/** A win tile on the /fun hackathon wall. */
export type Win = {
  /** The placement, set display-size, e.g. "1st". */
  placement: string;
  /** What it was, mono line, e.g. "Overall @ HackNYU". */
  detail: string;
  /** Project or context line. */
  context: string;
  year: string;
};

/** The full trophy shelf for /fun - card awards plus the "other wins". */
export const wins: Win[] = [
  { placement: "1st", detail: "Overall @ HackNYU", context: "Algora", year: "2025" },
  { placement: "1st", detail: "Education @ HackRU", context: "Synapse", year: "2025" },
  {
    placement: "2nd",
    detail: "Education + Best Gen AI @ HackRU",
    context: "InstructifAI",
    year: "2025",
  },
  {
    placement: "3rd",
    detail: "+ Best EM-AI @ HackNJIT",
    context: "Medify",
    year: "2024",
  },
  {
    placement: "Best",
    detail: "Freshman Hack @ HackRU",
    context: "FraxAI",
    year: "2024",
  },
  {
    placement: "420/50k",
    detail: "xAI Hackathon Select",
    context: "of 50,000 applicants",
    year: "2025",
  },
  { placement: "W", detail: "Jersey CTF", context: "capture the flag", year: "2024" },
  {
    placement: "2nd",
    detail: "Road to Silicon Valley",
    context: "@ Rutgers",
    year: "2024",
  },
];

export const experience: Experience[] = [
  {
    company: "NovaFlow (YC S25)",
    role: "Machine Learning Intern",
    year: "2025",
    period: "May 2025 – present",
    summary:
      "Building the agent orchestration layer for their bioinformatics platform - agents that write and run code over 1TB+ of genomics data, on spot GPUs that cut inference cost about 70%.",
    // TODO(snehanshn): add the real NovaFlow URL when public.
  },
  {
    company: "Algora",
    role: "Software Engineering Intern",
    year: "2025",
    period: "Feb 2025 – Jun 2025",
    summary:
      "Shipped LLaMA-based skill extraction and application autofill pipelines.",
    // TODO(snehanshn): add the real Algora URL.
  },
  {
    company: "Yuno Research",
    role: "Co-founder & Lead Infrastructure Engineer",
    year: "2024",
    period: "Aug 2024 – Jan 2026",
    summary:
      "Built and ran the on-chain prop desk: gRPC ingestion from three DEXes, Rust engine at 5GB/s, 5M+ swaps a day.",
    href: "https://github.com/yuno-research",
  },
];

export type PhotoSlot = { alt: string; src?: string };

/** /fun: photo slots + the currently line. Slots without `src` render as designed placeholders. */
export const offTheClock = {
  // TODO(snehanshn): add real photos (src under /public, alt text) to light up the grid.
  photoSlots: [
    { alt: "Photo slot 1" },
    { alt: "Photo slot 2" },
    { alt: "Photo slot 3" },
    { alt: "Photo slot 4" },
  ] as PhotoSlot[],
  // TODO(snehanshn): keep this one line current.
  currently: "shipping at NovaFlow and rereading Flash Boys",
};

export type ContactLink = { label: string; href: string };

/** Contact links. Links whose href is still `#todo` are not rendered. */
export const contact: Record<
  "github" | "linkedin" | "x" | "email",
  ContactLink
> = {
  github: { label: "GitHub", href: "https://github.com/SnehanshnC" },
  linkedin: { label: "LinkedIn", href: "#todo" }, // TODO(snehanshn)
  x: { label: "X", href: "#todo" }, // TODO(snehanshn)
  email: { label: "Email", href: "#todo" }, // TODO(snehanshn)
};

/** Footer sign-off, one line, first person. */
// TODO(snehanshn): make this line yours.
export const signOff = "Built by hand in New Jersey. Runs in milliseconds.";

export const site = {
  title: "Snehanshn Chowdhury",
  /**
   * SEO title: metadata sells, the page jokes (ADR 0002). The document
   * title/description carry the straight sell with no bit - a recruiter's
   * first impression in Google/Slack must not be the joke without the
   * punchline.
   */
  seoTitle: "Snehanshn Chowdhury · Real-Time Systems Engineer",
  description:
    "Snehanshn Chowdhury - real-time systems engineer. Solana trading infrastructure, agent orchestration, and things that move in milliseconds.",
  url: "https://snehanshn.com",
} as const;

/* ==========================================================================
 * THE JOURNEY (docs/adr/0002-journey-architecture.md)
 *
 * One block per rung, clearly bounded: a rung task edits ONLY its own block
 * (plus its own src/journey/rungs/<id>/ directory) - never another rung's.
 * Copy voice per rung comes from that rung's ADR; every word stays here,
 * typed, per the repo convention.
 * ========================================================================== */

/** Pole labels for the rail, re-voiced per rung (each rung ADR's "rail dress"). */
export type RailLabels = { less: string; more: string };

/** Journey copy owned by the shared scaffold (stage + rail), not by any rung. */
export const journeyShared = {
  /** Accessible name of the rail's landmark (ADR 0002: rail is primary navigation). */
  railLandmarkLabel: "Journey",
  /** Accessible name for the rail's slider. */
  railAriaLabel: "Journey progress, from less hard sell to more hard sell",
} as const;

/* ---- RUNG A - RAW (docs/adr/rung-a-raw.md) ------------------------------ */
export const journeyRungA = {
  /**
   * The five timid lines, top-left. All are paragraphs - the document h1
   * belongs to rung E.0's statement (ADR 0002 "SEO" section).
   * "[city]" is filled state-level ("new jersey", the repo's public
   * location) - the privacy rule allows city-level AT MOST, never finer.
   * The email line stays plain text: rung C's ADR fixes the functionality
   * arc as "A inert", and contact.email is still `#todo` anyway.
   */
  // TODO(snehanshn): final copy polish (rung A ADR open item).
  lines: [
    "hi. i'm snehanshn.",
    "i write code sometimes.",
    "i live in new jersey.",
    "email me if you want i guess",
    "my projects (i'll add these later, sorry)",
  ],
  rail: { less: "less hard sell", more: "more hard sell" } as RailLabels,
} as const;

/* ---- RUNG B - KITSCH (docs/adr/rung-b-kitsch.md) ------------------------ */
export const journeyRungB = {
  /** Marquee headline; the decorative arrows are dress, not copy. */
  headline: "WELCOME TO MY AWESOME SITE!!",
  body: ["I build projects! I write code!", "And I live in new jersey!!"],
  /** Decorative bevel buttons - press-effect only, no action (ADR: nothing works well on the bad pole). */
  buttons: ["MY PROJECTS", "EMAIL ME!!"],
  rail: { less: "LESS HARD SELL!!", more: "MORE HARD SELL!!" } as RailLabels,
} as const;

/* ---- RUNG C - AI-BLAND (docs/adr/rung-c-ai-bland.md) -------------------- */
export const journeyRungC = {
  hero: "🚀 Results-driven engineer shipping impactful solutions.",
  /** The journey's first working interactions: mailto + smooth-scroll forward. */
  ctas: { getInTouch: "Get in touch", learnMore: "Learn more" },
  /** The three-emoji-card row - the signature template tell. */
  cards: [
    { emoji: "✨", title: "Clean code" },
    { emoji: "💡", title: "Innovation" },
    { emoji: "⚡", title: "Fast shipping" },
  ],
  rail: { less: "Less Hard Sell", more: "More Hard Sell ✨" } as RailLabels,
} as const;

/* ---- RUNG D - SAFE (docs/adr/rung-d-safe.md) ----------------------------- */
export const journeyRungD = {
  // TODO(snehanshn): final copy polish (rung D ADR open item).
  name: ["SNEHANSHN", "CHOWDHURY"],
  role: ["Software engineer.", "Selected work below."],
  /** Tiny mono meta labels on the Swiss grid. */
  meta: { index: "·001", location: "New Jersey", year: "2026" },
  rail: { less: "LESS HARD SELL", more: "MORE HARD SELL" } as RailLabels,
} as const;

/* ---- RUNG E - PRISTINE (docs/adr/rung-e-pristine.md) --------------------- */
export const journeyRungE = {
  /**
   * E.0 - the document h1, server-rendered (ADR 0002 "SEO" section).
   * TODO(snehanshn): the final max-sell statement is a rung E open item.
   * Until then this reuses the proven statement so the OG image
   * (rendered from it) and the Fraunces italic subset (holding its
   * emphasis word's glyphs) both stay valid. Changing it means
   * regenerating both - see "the site's edges" + the LCP contract.
   */
  statement: identity.statement,
  /**
   * Section order is the persuasion arc (rung E ADR). `who-i-am` and
   * `hobbies` are 301 targets (/about, /fun) - never rename those ids.
   */
  sections: [
    { id: "who-i-am", kicker: "E.1", title: "Who I am" },
    { id: "projects", kicker: "E.2", title: "Projects" },
    { id: "experience", kicker: "E.3", title: "Experience" },
    { id: "awards", kicker: "E.4", title: "Awards" },
    { id: "hobbies", kicker: "E.5", title: "Hobbies" },
    { id: "contact", kicker: "E.6", title: "Contact" },
  ],
  /** Visible placeholder line inside each stub section until the rung E build. */
  stubNote: "This section arrives with the rung E build.",
  rail: { less: "less hard sell", more: "more hard sell" } as RailLabels,
} as const;
