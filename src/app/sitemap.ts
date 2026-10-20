import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/links";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/privacy/", "/support/"].map((p) => ({ url: `${siteUrl}${p}`, lastModified: new Date("2026-10-20") }));
}
