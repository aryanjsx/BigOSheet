import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

/** Markdown → sanitized HTML. Safe even if content ever comes from someone untrusted. */
export function renderMarkdown(source: string): string {
  const raw = marked.parse(source, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "h1", "h2", "img", "del", "details", "summary",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title"],
      code: ["class"],
      th: ["align"],
      td: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tag, attribs) => ({
        tagName: tag,
        attribs: { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
    },
  });
}

export function readingMinutes(source: string): number {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
