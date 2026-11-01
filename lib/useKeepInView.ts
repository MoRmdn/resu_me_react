"use client";

import { useEffect } from "react";

/** Slightly longer than the 320ms open, so the panel has its final height. */
const SETTLE_MS = 340;

/**
 * Brings a panel that just opened into view. One opening near the fold unfolds
 * off-screen, which would look like nothing happened, so this waits for it to
 * reach its height first. Pass null while nothing is open.
 */
export function useKeepInView(id: string | null) {
  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "nearest" });
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [id]);
}
