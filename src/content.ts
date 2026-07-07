/**
 * Every word of copy and every data item on the site lives here.
 * Swap a mock for the real thing by editing this file only.
 * Anything marked `TODO(snehanshn)` is a placeholder awaiting real data.
 */

export type Award = {
  /** Short badge text rendered on a project card, e.g. "1st @ HackNYU" */
  badge: string;
  /** Full award name, used for accessibility / terminal output */
  full: string;
};

export type Project = {
  slug: string;
  /** 4-char instrument code for the positions book, e.g. "YUNO". */
  ticker: string;
  name: string;
  tagline: string;
  description: string;
  role?: string;
  /**
   * The headline number for the row, set display-size.
   * `fromAward: true` means the metric IS the placement, so the award tag
   * is not rendered again on the row (no duplication).
   */
  metric: { value: string; label: string; fromAward?: boolean };
  /** Secondary readouts rendered as a small stat strip under the metric. */
  stats?: { label: string; value: string }[];
  awards: Award[];
  link: { label: string; href: string };
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  summary: string;
};

export const identity = {
  name: "Snehanshn Chowdhury",
  heroLine: "Real-time infrastructure for markets that don't wait.",
  kicker: "Rutgers CS + Math · Founding engineer @ NovaFlow (YC S25)",
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
    metric: { value: "5M+", label: "swaps/day" },
    stats: [
      { label: "ingest", value: "5GB/s" },
      { label: "dex coverage", value: "~60%" },
      { label: "team", value: "8" },
    ],
    description:
      "On-chain prop desk streaming live gRPC data from Raydium, Orca, and Meteora to catch AMM arbitrage in milliseconds. Rust ingestion engine hitting 5GB/s disk saturation; 5M+ swaps processed daily across roughly 60% of DEX volume.",
    role: "Co-founder & lead infrastructure engineer, led an 8-person team",
    awards: [],
    link: { label: "GitHub", href: "https://github.com/yuno-research" },
  },
  {
    slug: "algora",
    ticker: "ALGR",
    name: "Algora",
    tagline: "AI job application automation",
    metric: { value: "+300%", label: "application throughput" },
    description:
      "Scrapes GitHub, LinkedIn, and job boards to build developer portfolios, match roles, and autofill applications. LLaMA-based skill extraction; +300% application throughput.",
    awards: [
      { badge: "1st @ HackNYU", full: "1st Place Overall @ HackNYU" },
    ],
    link: { label: "Devpost", href: "https://devpost.com/software/algora" },
  },
  {
    slug: "synapse",
    ticker: "SNPS",
    name: "Synapse",
    tagline: "GraphRAG learning intelligence",
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
  },
  {
    slug: "quarry",
    ticker: "QRRY",
    name: "Quarry",
    tagline: "AI data marketplace",
    metric: { value: "x402", label: "solana micropayments" },
    description:
      "Schema-only marketplace where AI agents preview datasets through DuckDB queries and buy slices with Solana x402 micropayments. Parquet pipelines with IPFS verification.",
    awards: [],
    link: { label: "Live site", href: "https://www.quarry-ai.net/" },
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
    link: { label: "Devpost", href: "https://devpost.com/software/medify-khoaid" },
  },
];

/** Wins without a project card: one understated line in About. */
export const otherWins =
  "Also: xAI Hackathon Select (420 of 50,000), Jersey CTF Winner, Best Freshman Hack @ HackRU 2024 (FraxAI), 2nd Place @ Rutgers Road to Silicon Valley.";

export const experience: Experience[] = [
  {
    company: "NovaFlow (YC S25)",
    role: "Machine Learning Intern",
    period: "May 2025 – present",
    summary:
      "Architected the agent orchestration layer for an agentic bioinformatics platform. Code-as-context pattern running analyses over 1TB+ genomics data; Modal spot-GPU compute cutting inference cost ~70%.",
  },
  {
    company: "Yuno Research",
    role: "Co-founder & Lead Infrastructure Engineer",
    period: "Aug 2024 – Jan 2026",
    summary:
      "Built and ran the on-chain prop desk: gRPC ingestion from three DEXes, Rust engine at 5GB/s, 5M+ swaps a day.",
  },
  {
    company: "Algora",
    role: "Software Engineering Intern",
    period: "Feb 2025 – Jun 2025",
    summary:
      "Shipped LLaMA-based skill extraction and application autofill pipelines.",
  },
];

export type PhotoSlot = { alt: string; src?: string };

/** Off the Clock: photo slots + currently ticker. Slots without `src` are not rendered. */
export const offTheClock = {
  // TODO(snehanshn): add real photos (src under /public, alt text) to light up the grid.
  photoSlots: [
    { alt: "Photo slot 1" },
    { alt: "Photo slot 2" },
    { alt: "Photo slot 3" },
    { alt: "Photo slot 4" },
  ] as PhotoSlot[],
  // TODO(snehanshn): keep this one line current.
  currently: "Currently: shipping at NovaFlow and rereading Flash Boys.",
};

export type TapeInstrument = {
  /** Instrument symbol on the tape, e.g. "SWAPS/DAY". */
  symbol: string;
  /** Static display for facts that don't tick, e.g. "6-0". */
  text?: string;
  /** Base value for ticking instruments; the seeded walk perturbs around it. */
  base?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Max walk deviation as a fraction of base. Absent/0 = static. */
  vol?: number;
};

/**
 * The tape: his real metrics streamed as instruments.
 * Ticking values walk around the true figures from the projects above;
 * static ones are facts that don't move.
 */
export const tape: TapeInstrument[] = [
  { symbol: "SWAPS/DAY", base: 5.21, decimals: 2, suffix: "M", vol: 0.014 },
  { symbol: "INGEST", base: 5.08, decimals: 2, suffix: "GB/s", vol: 0.02 },
  { symbol: "DEX COVERAGE", base: 60.2, decimals: 1, suffix: "%", vol: 0.008 },
  { symbol: "HACKATHON W/L", text: "6-0" },
  { symbol: "APP THROUGHPUT", text: "+300%" },
  { symbol: "GENOMICS", base: 1.02, decimals: 2, suffix: "TB", vol: 0.012 },
  { symbol: "GPU COST", text: "-70%" },
  { symbol: "DESK", text: "NOVAFLOW · YC S25" },
  { symbol: "EDU", text: "RUTGERS CS+MATH" },
];

export type ContactLink = { label: string; href: string };

/** Contact links. Links whose href is still `#todo` are not rendered. */
export const contact: Record<"github" | "linkedin" | "x" | "email", ContactLink> = {
  github: { label: "GitHub", href: "https://github.com/SnehanshnC" },
  linkedin: { label: "LinkedIn", href: "#todo" }, // TODO(snehanshn)
  x: { label: "X", href: "#todo" }, // TODO(snehanshn)
  email: { label: "Email", href: "#todo" }, // TODO(snehanshn)
};

export const site = {
  title: "Snehanshn Chowdhury",
  description:
    "Snehanshn Chowdhury - real-time systems engineer. Solana trading infrastructure, agent orchestration, and things that move in milliseconds.",
  url: "https://snehanshn.com",
} as const;
