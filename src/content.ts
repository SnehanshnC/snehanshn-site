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
  name: string;
  tagline: string;
  description: string;
  role?: string;
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
    name: "Yuno Research",
    tagline: "Solana trading infrastructure",
    description:
      "On-chain prop desk streaming live gRPC data from Raydium, Orca, and Meteora to catch AMM arbitrage in milliseconds. Rust ingestion engine hitting 5GB/s disk saturation; 5M+ swaps processed daily across roughly 60% of DEX volume.",
    role: "Co-founder & lead infrastructure engineer, led an 8-person team",
    awards: [],
    link: { label: "GitHub", href: "https://github.com/yuno-research" },
  },
  {
    slug: "algora",
    name: "Algora",
    tagline: "AI job application automation",
    description:
      "Scrapes GitHub, LinkedIn, and job boards to build developer portfolios, match roles, and autofill applications. LLaMA-based skill extraction; +300% application throughput.",
    awards: [
      { badge: "1st @ HackNYU", full: "1st Place Overall @ HackNYU" },
    ],
    link: { label: "Devpost", href: "https://devpost.com/software/algora" },
  },
  {
    slug: "synapse",
    name: "Synapse",
    tagline: "GraphRAG learning intelligence",
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
    name: "Quarry",
    tagline: "AI data marketplace",
    description:
      "Schema-only marketplace where AI agents preview datasets through DuckDB queries and buy slices with Solana x402 micropayments. Parquet pipelines with IPFS verification.",
    awards: [],
    link: { label: "Live site", href: "https://www.quarry-ai.net/" },
  },
  {
    slug: "instructifai",
    name: "InstructifAI",
    tagline: "AI public speaking coach",
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
    name: "Medify",
    tagline: "AI field medic assistant",
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

/** Off the Clock: photo slots + currently ticker. All placeholders. */
export const offTheClock = {
  // TODO(snehanshn): replace with real photos (src under /public, alt text).
  photoSlots: [
    { alt: "Photo slot 1" },
    { alt: "Photo slot 2" },
    { alt: "Photo slot 3" },
    { alt: "Photo slot 4" },
  ],
  // TODO(snehanshn): keep this one line current.
  currently: "Currently: shipping at NovaFlow and rereading Flash Boys.",
} as const;

/** Contact links. TODO(snehanshn): fill all four before launch. */
export const contact = {
  github: { label: "GitHub", href: "#todo" }, // TODO(snehanshn)
  linkedin: { label: "LinkedIn", href: "#todo" }, // TODO(snehanshn)
  x: { label: "X", href: "#todo" }, // TODO(snehanshn)
  email: { label: "Email", href: "#todo" }, // TODO(snehanshn)
} as const;

export const site = {
  title: "Snehanshn Chowdhury",
  description:
    "Snehanshn Chowdhury - real-time systems engineer. Solana trading infrastructure, agent orchestration, and things that move in milliseconds.",
  url: "https://snehanshn.com",
} as const;
