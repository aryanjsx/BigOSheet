import type { MetadataRoute } from "next";
import { ENTRIES } from "@/data/entries";
import { listPublished } from "@/lib/posts";
import { NAV, TOPICS_PAGE, topicHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

// Posts live in the database, so the sitemap is built on request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const paths = [
    "/",
    "/blog",
    TOPICS_PAGE.href,
    ...NAV.flatMap((g) => g.links.map((l) => l.href)),
    ...ENTRIES.map((e) => topicHref(e.id)),
    "/Big-O-Sheet.pdf",
    "/Big-O-Sheet-one-page.pdf",
  ];
  const entries: MetadataRoute.Sitemap = paths.map((p) => ({ url: SITE_URL + p.replace(/^\//, ""), lastModified }));

  try {
    const posts = await listPublished({ limit: 1000 });
    for (const p of posts) {
      entries.push({ url: `${SITE_URL}${p.slug}`, lastModified: new Date(p.updatedAt) });
    }
  } catch {
    // If the database is unreachable, still serve the static pages.
  }
  return entries;
}
