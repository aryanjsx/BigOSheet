// Every cheat-sheet page (topics, tools, practice) lives in this group. The `.sheet` wrapper
// scopes the reference styles so they never touch the blog pages.
export default function SheetLayout({ children }: { children: React.ReactNode }) {
  return <div className="container sheet">{children}</div>;
}
