import type { Metadata } from "next";
import { SITE_NAME } from "./site";

const ROUTE_TITLES: Record<string, string> = {
  "basics/": "Big O notation: time and space complexity",
  "challenges/": "DSA coding interview complexity challenges",
  "compare/": "Compare algorithms: time and space complexity",
  "export/": "Export Big O cheat sheet tables and PDFs",
  "lookup/": "Data structure and algorithm complexity lookup",
  "patterns/": "Coding interview pattern time complexity",
  "quiz/": "Big O time complexity quiz for DSA interviews",
  "revision/": "Big O interview time and space complexity",
  "roadmap/": "DSA complexity roadmap for coding interviews",
  "sorting/": "Sorting algorithms: time and space complexity",
  "topics/": "Data structure and algorithm complexity topics",
  "visualizer/": "Big O algorithm visualizer for time complexity",
};

const TITLE_SUFFIX_LENGTH = " | BigOSheet".length;

function topicTitle(name: string): string {
  const candidates = [
    `Big O ${name}: time and space complexity`,
    `${name}: time and space complexity`,
    `Big O ${name} complexity`,
    `Big O ${name} complexity for DSA interview prep`,
    `${name} complexity`,
  ];
  const fitted = candidates.find((candidate) => {
    const length = candidate.length + TITLE_SUFFIX_LENGTH;
    return length >= 50 && length <= 60;
  });
  if (fitted) return fitted;
  const dsaTitle = `Big O ${name} complexity for DSA`;
  if (dsaTitle.length + TITLE_SUFFIX_LENGTH <= 60) return dsaTitle;
  return `Big O ${name} complexity`;
}

function pageTitle(title: string, path: string): string {
  if (path.startsWith("topics/")) return topicTitle(title.split(": time and space complexity")[0]);
  return ROUTE_TITLES[path] ?? title;
}

function pageDescription(description: string): string {
  const extended =
    description.length < 140
      ? `${description} Read the reference for case-specific time and space costs, assumptions, and DSA interview trade-offs.`
      : description;
  if (extended.length <= 160) return extended;

  const shortened = extended.slice(0, 157).replace(/\s+\S*$/, "").trimEnd();
  return `${shortened}…`;
}

/** The social preview image, built by app/og.png/route.tsx. The URL is relative to the site root. */
export const OG_IMAGE = {
  url: "og.png",
  width: 1200,
  height: 630,
  alt: "BigOSheet: time and space complexity, with the fine print",
  type: "image/png",
};

/** Title, description, canonical link, and social tags for one page. `path` is relative to the
    site root, such as "sorting/". A page's openGraph replaces the layout's, so the shared fields
    are repeated here. */
export function pageMeta(title: string, description: string, path: string): Metadata {
  const seoTitle = pageTitle(title, path);
  // Pages are served without a trailing slash, so the canonical URL matches.
  const clean = path === "./" ? path : path.replace(/\/$/, "");
  return {
    title: seoTitle,
    description: pageDescription(description),
    alternates: { canonical: clean },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title: seoTitle,
      description: pageDescription(description),
      url: clean,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: pageDescription(description),
      images: [OG_IMAGE],
    },
  };
}
