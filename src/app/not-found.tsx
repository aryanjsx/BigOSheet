import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section center">
      <div className="card-emoji big" aria-hidden="true">🧭</div>
      <h1>We couldn’t find that page</h1>
      <p className="muted">The article may have moved, or it hasn’t been published yet.</p>
      <Link href="/blog" className="btn btn-primary">Browse articles</Link>
    </div>
  );
}
