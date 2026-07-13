import type { Metadata } from "next";

/*
 * TEMPORARY PROTOTYPE ROUTE - the D->E detonation seam identity prototype
 * (docs/adr/rung-e-pristine.md). Not in sitemap.ts, noindexed here for the
 * whole segment; deleted once rung E adopts the winning identity.
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
