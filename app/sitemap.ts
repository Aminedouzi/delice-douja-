import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const paths = ["", "/about", "/store", "/contact"];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const p of paths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.8,
      });
    }
  }
  return entries;
}
