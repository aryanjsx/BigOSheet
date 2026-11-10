"use client";

export default function MenuButton() {
  return (
    <button
      type="button"
      className="icon-btn menu-btn"
      aria-label="Open menu"
      onClick={(e) => e.currentTarget.closest("header")?.toggleAttribute("data-open")}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
