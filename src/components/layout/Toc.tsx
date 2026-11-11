/** "On this page" links for long pages with several sections. */
export default function Toc({ links }: { links: [id: string, label: string][] }) {
  return (
    <nav className="toc" aria-label="On this page">
      <span className="toc-label">On this page</span>
      {links.map(([id, label]) => (
        <a key={id} href={"#" + id}>
          {label}
        </a>
      ))}
    </nav>
  );
}
