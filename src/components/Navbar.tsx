import Link from "next/link";
import { getUser } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import ThemeToggle from "./ThemeToggle";
import MenuButton from "./MenuButton";

export default async function Navbar() {
  const user = await getUser();
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="BigOSheet home">
          <span className="brand-mark" aria-hidden="true">O(n)</span>
          <span>BigOSheet</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          <Link href="/">Home</Link>
          <Link href="/blog">Articles</Link>
          {user && <Link href="/library">My library</Link>}
          {user?.role === "admin" && <Link href="/admin">Write</Link>}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {user ? (
            <>
              <span className="nav-user" title={user.email}>Hi, {user.name.split(" ")[0]}</span>
              <form action={logoutAction}>
                <button className="btn btn-ghost" type="submit">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Log in</Link>
              <Link href="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
          <MenuButton />
        </div>
      </div>
    </header>
  );
}
