"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is in view.
 *
 * The Flutter nav only updated its active link when a link was clicked, so the
 * highlight went stale the moment you scrolled by hand. An IntersectionObserver
 * costs nothing and fixes it.
 */
export function useScrollSpy(ids: readonly string[], rootMargin = "-45% 0px -50% 0px") {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Topmost wins when two sections straddle the band.
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActive(top.target.id);
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
