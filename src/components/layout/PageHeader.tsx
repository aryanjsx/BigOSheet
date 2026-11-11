import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";

interface Props {
  /** The group the page belongs to, such as "Reference". Links back when `eyebrowHref` is set. */
  eyebrow?: string;
  eyebrowHref?: string;
  title: string;
  id?: string;
  lede?: React.ReactNode;
  /** Buttons or links under the lede. */
  actions?: React.ReactNode;
  /** Adds visible breadcrumb navigation and matching BreadcrumbList structured data. */
  breadcrumbHref?: string;
  breadcrumbParent?: { label: string; href: string };
  articleDescription?: string;
}

export default function PageHeader({
  eyebrow,
  eyebrowHref,
  title,
  id,
  lede,
  actions,
  breadcrumbHref,
  breadcrumbParent,
  articleDescription,
}: Props) {
  return (
    <header className="page-header">
      {breadcrumbHref && (
        <Breadcrumbs
          article={
            articleDescription && breadcrumbHref
              ? { headline: title, description: articleDescription, url: breadcrumbHref }
              : undefined
          }
          items={[
            { label: "Home", href: "/" },
            ...(breadcrumbParent ? [breadcrumbParent] : []),
            { label: title, href: breadcrumbHref },
          ]}
        />
      )}
      {eyebrow && <p className="eyebrow">{eyebrowHref ? <Link href={eyebrowHref}>{eyebrow}</Link> : eyebrow}</p>}
      <h1 id={id}>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}
