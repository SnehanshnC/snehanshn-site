import type { MetadataRoute } from "next";
import { site } from "@/content";

// ADR 0002: the sitemap shrinks to "/" - the journey is the site.
// New standalone routes (if any ever return) must be added here by hand.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url }];
}
