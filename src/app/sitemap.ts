import type { MetadataRoute } from "next";
import { site } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/fun", "/about"].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
  }));
}
