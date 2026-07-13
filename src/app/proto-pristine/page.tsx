import PristineProto from "@/journey/proto/PristineProto";

/*
 * TEMPORARY PROTOTYPE ROUTE - the D->E detonation seam in the winning
 * evolved-paper identity (docs/adr/rung-e-pristine.md "Decided: identity
 * = EVOLVED PAPER"). Noindexed via ./layout.tsx, absent from sitemap.ts,
 * linked from nowhere on the site.
 *
 * TODO(rung-e): adopt into src/journey/rungs/e/ and remove this route.
 */
export const metadata = { title: "pristine proto · evolved paper (winner)" };

export default function ProtoPristinePage() {
  return <PristineProto />;
}
