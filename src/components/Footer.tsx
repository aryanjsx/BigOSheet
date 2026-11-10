import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="brand"><span className="brand-mark" aria-hidden="true">O(n)</span> BigOSheet</p>
          <p className="muted footer-blurb">
            Coding and data structures, explained so that anyone can follow along. No jargon required.
          </p>
        </div>
        <div>
          <h4>Read</h4>
          <ul>
            <li><Link href="/blog">All articles</Link></li>
            <li><Link href="/library">My library</Link></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link href="/login">Log in</Link></li>
            <li><Link href="/signup">Create an account</Link></li>
          </ul>
        </div>
        <div>
          <h4>More</h4>
          <ul>
            <li><a href="https://bigosheet.aryankr.in/" target="_blank" rel="noopener noreferrer">Big O cheat sheet</a></li>
            <li><a href="https://github.com/aryanjsx/BigOSheet" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom muted">© {new Date().getFullYear()} BigOSheet. Made with care for curious people.</div>
    </footer>
  );
}
