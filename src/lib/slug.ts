// Routes that already exist (or are reserved) and so can never be a post slug.
export const RESERVED_SLUGS = new Set([
  "api", "admin", "login", "signup", "logout", "library", "blog", "about",
  "tag", "tags", "static", "public", "new", "edit", "robots", "sitemap",
  "favicon", "icon", "_next", "algorithms", "basics", "challenges", "compare",
  "data-structures", "export", "lookup", "patterns", "quiz", "revision", "roadmap", "sorting",
  "topics", "visualizer", "og", "social-preview", "apple-touch-icon",
]);

/** "Singly Linkedlist" -> "singlylinkedlist" (letters and digits only). */
export function slugify(title: string): string {
  const base = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 80);
  return base || "post";
}

/** Returns a slug nobody else is using: "linkedlist", then "linkedlist2", "linkedlist3"... */
export function uniqueSlug(title: string, isTaken: (slug: string) => boolean): string {
  const base = slugify(title);
  let candidate = base;
  let n = 2;
  while (RESERVED_SLUGS.has(candidate) || isTaken(candidate)) {
    candidate = `${base}${n++}`;
  }
  return candidate;
}
