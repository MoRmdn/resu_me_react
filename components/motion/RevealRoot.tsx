"use client";

import { useRevealObserver } from "@/lib/useRevealObserver";

/** Installs the shared reveal observer. Rendered once, at the page root. */
export function RevealRoot() {
  useRevealObserver();
  return null;
}
