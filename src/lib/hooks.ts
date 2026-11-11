"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during server rendering and hydration, true afterward. Use it to gate browser-only output. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

// ---------- URL hash as state ----------
const HASH_EVENT = "bigosheet:hash";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}

/** The current hash without the leading "#". Empty during server rendering. */
export function useHash(): string {
  return useSyncExternalStore(
    subscribeHash,
    () => location.hash.replace(/^#/, ""),
    () => "",
  );
}

/** Replaces the hash without adding a history entry, and updates every useHash() reader. */
export function replaceHash(hash: string) {
  history.replaceState(history.state, "", hash ? "#" + hash : location.pathname + location.search);
  window.dispatchEvent(new Event(HASH_EVENT));
}
