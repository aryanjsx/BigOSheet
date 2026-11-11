import Link from "next/link";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";

interface Item {
  label: string;
  href: string;
}

interface Props {
  items: Item[];
  article?: { headline: string; description: string; url: string };
}

export default function Breadcrumbs({ items, article }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: items.map(({ label, href }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: label,
          item: new URL(href, SITE_URL).href,
        })),
      },
      ...(article
        ? [
            {
              "@type": "TechArticle",
              headline: article.headline,
              description: article.description,
              url: new URL(article.url, SITE_URL).href,
              inLanguage: "en",
              author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
              publisher: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
              isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map(({ label, href }, index) => (
            <li key={href}>
              {index === items.length - 1 ? (
                <span aria-current="page">{label}</span>
              ) : (
                <Link href={href}>{label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
