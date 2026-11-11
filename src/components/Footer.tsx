import Link from "next/link";
import { GITHUB_URL, NAV, TOPICS_PAGE } from "@/lib/routes";
import { asset } from "@/lib/utils";

export default function Footer() {
  const [reference, tools, practice] = NAV;
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="brand"><span className="brand-word">BigO<em>Sheet</em></span></p>
          <p className="muted footer-blurb">
            Coding and data structures, explained so that anyone can follow along. No jargon required.
          </p>
        </div>
        <div>
          <h4>Read</h4>
          <ul>
            <li><Link href="/blog">All articles</Link></li>
            <li><Link href="/library">My library</Link></li>
            <li><Link href="/login">Log in</Link></li>
            <li><Link href="/signup">Create an account</Link></li>
          </ul>
        </div>
        <div>
          <h4>{reference.label}</h4>
          <ul>
            <li><Link href={TOPICS_PAGE.href}>{TOPICS_PAGE.label}</Link></li>
            {reference.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4>{tools.label}</h4>
          <ul>
            {tools.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4>{practice.label}</h4>
          <ul>
            {practice.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            <li><a href={asset("/Big-O-Sheet.pdf")} download>Download the PDF</a></li>
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom muted">© {new Date().getFullYear()} BigOSheet. Made with care for curious people.</div>
    </footer>
  );
}
