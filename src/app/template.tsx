/*
 * Remounts on every route change, giving each page a fast rise-in.
 * Transform-only (no fade): the first paint is also the LCP paint, so
 * opacity animations here would cost LCP on initial load.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-in">{children}</div>;
}
