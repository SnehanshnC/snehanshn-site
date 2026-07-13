import Journey from "@/journey/Journey";

/*
 * The journey IS the site (ADR 0001): one scroll from the Bad Pole to the
 * Great Pole. Everything lives in src/journey/; metadata for "/" lives in
 * layout.tsx (root segment - metadata sells, the page jokes, ADR 0002).
 */
export default function Home() {
  return <Journey />;
}
