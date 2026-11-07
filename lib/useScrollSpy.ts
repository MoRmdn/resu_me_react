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

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }

        // Entries only describe targets whose state changed. Re-read every
        // retained intersection so an exit-only event cannot strand a stale
        // active link while another section is still inside the band.
        const top = elements
          .filter((el) => intersecting.has(el))
          .reduce<HTMLElement | null>(
            (current, el) =>
              !current || el.getBoundingClientRect().top < current.getBoundingClientRect().top
                ? el
                : current,
            null,
          );
        setActive(top?.id ?? null);
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}
