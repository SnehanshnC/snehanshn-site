import type { Metadata } from "next";

/*
 * TEMPORARY PROTOTYPE ROUTE - the D->E detonation seam in the winning
 * evolved-paper identity (docs/adr/rung-e-pristine.md). Not in sitemap.ts,
 * noindexed for the whole segment.
 *
 * TODO(rung-e): adopt into src/journey/rungs/e/ and remove this route.
 */
export const metadata: Metadata = {
  title: "pristine proto (temporary)",
  robots: { index: false, follow: false },
  // Overrides the root layout's canonical/OG - a throwaway route must not
  // unfurl or canonicalize as the site (nested metadata objects replace,
  // never deep-merge).
  alternates: {},
  openGraph: { title: "pristine proto (temporary)" },
};

export default function ProtoPristineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
