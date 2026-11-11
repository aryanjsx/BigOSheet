/* Every page on the site, grouped the way the navbar, footer, and home page show them.
   Add a page here when you add a folder under src/app, and it shows up in all three. */

export interface PageLink {
  href: string;
  label: string;
  blurb: string;
}

export interface NavGroup {
  label: string;
  links: PageLink[];
}

export const TOPICS_PAGE: PageLink = {
  href: "/topics",
  label: "Topics",
  blurb: "All 34 topics with search and filters. Each has its own page with code and pitfalls.",
};

export const NAV: NavGroup[] = [
  {
    label: "Reference",
    links: [
      { href: "/basics", label: "Big O basics", blurb: "What the notation means, a growth playground, and how to read the tables." },
      { href: "/data-structures", label: "Data structures", blurb: "Arrays, hash tables, trees, heaps, tries, Union-Find, and graph representations." },
      { href: "/sorting", label: "Sorting", blurb: "Best, average, and worst case for 13 sorts, with the footnotes that matter." },
      { href: "/algorithms", label: "Search and graphs", blurb: "Binary search, BFS, DFS, heaps, shortest paths, and spanning trees." },
      { href: "/patterns", label: "Coding patterns", blurb: "Typical costs of two pointers, sliding window, backtracking, and DP." },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/lookup", label: "Complexity lookup", blurb: "Best, average, and worst case for one operation, with its caveat." },
      { href: "/compare", label: "Compare two algorithms", blurb: "Time, space, stability, and trade-offs side by side." },
      { href: "/visualizer", label: "Visualizer", blurb: "Step through searches, four sorts, BFS, and DFS one move at a time." },
      { href: "/export", label: "Export and share", blurb: "Markdown, CSV, printable cards, and PDFs." },
    ],
  },
  {
    label: "Practice",
    links: [
      { href: "/roadmap", label: "Roadmap", blurb: "A suggested order for the topics, with prerequisites and progress." },
      { href: "/quiz", label: "Quiz", blurb: "Ten random questions with an explanation after each answer." },
      { href: "/challenges", label: "Code challenges", blurb: "Predict the time and space of short snippets in three languages." },
      { href: "/revision", label: "Revision sheet", blurb: "The high-relevance topics on one printable page." },
    ],
  },
];

export const GITHUB_URL = "https://github.com/aryanjsx/BigOSheet";

export function topicHref(id: string): string {
  return `/topics/${id}`;
}

export function compareHref(a: string, b: string): string {
  return `/compare#${a},${b}`;
}

/** Where each table section lives. Entries link to these with their `section` field. */
const SECTION_PAGE: Record<string, string> = {
  fundamentals: "/basics",
  notation: "/basics",
  "data-structures": "/data-structures",
  "complexity-kinds": "/data-structures",
  "more-data-structures": "/data-structures",
  "priority-queues": "/data-structures",
  "graph-representations": "/data-structures",
  sorting: "/sorting",
  algorithms: "/algorithms",
  "graph-tree": "/algorithms",
  "traversal-search": "/algorithms",
  "heap-operations": "/algorithms",
  "shortest-paths": "/algorithms",
  "minimum-spanning-trees": "/algorithms",
  "coding-patterns": "/patterns",
};

export function sectionHref(id: string): string {
  const page = SECTION_PAGE[id] ?? "/";
  return id === "sorting" || id === "coding-patterns" ? page : `${page}#${id}`;
}

/** The page title for a section, for link text such as "See it in Sorting". */
export function sectionPageLabel(id: string): string {
  const href = SECTION_PAGE[id];
  return NAV.flatMap((g) => g.links).find((l) => l.href === href)?.label ?? "the tables";
}
