"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/routes";

/** The cheat-sheet menus (Reference, Tools, Practice) in the main navigation. */
export default function SheetNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on an outside click, on Escape, and whenever the page changes.
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      ref.current?.querySelector<HTMLButtonElement>(`[data-group="${open}"]`)?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="sheet-nav" ref={ref}>
      {NAV.map((group) => {
        const isOpen = open === group.label;
        const active = group.links.some((l) => pathname === l.href || pathname.startsWith(l.href + "/"));
        const id = "menu-" + group.label.toLowerCase();
        return (
          <div className="dd" key={group.label}>
            <button
              type="button"
              className={"dd-trigger" + (active ? " is-active" : "")}
              data-group={group.label}
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : group.label)}
            >
              {group.label}
              <svg className="caret" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
            <span className="dd-label">{group.label}</span>
            <ul className="dd-menu" id={id} hidden={!isOpen}>
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                    {l.label}
                    <span className="dd-blurb">{l.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
