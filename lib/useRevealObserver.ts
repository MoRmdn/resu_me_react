"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every .reveal on the page, installed once by the
 * root. Cheaper than an observer per element, and it means Reveal itself can
 * stay a server component.
 */
export function useRevealObserver() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".reveal:not([data-visible])");
    if (nodes.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => (n.dataset.visible = "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      },
      {
        // The huge top margin is load-bearing. Without it, anything the
        // viewport jumps *past* — an anchor link, a deep link, the browser
        // restoring scroll on reload — never intersects and stays invisible
        // forever. Expanding the root upward means everything above the fold
        // counts as already seen and reveals immediately, while content below
        // still waits until it is 18% into view.
        rootMargin: "100000px 0px -18% 0px",
        threshold: 0,
      },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
}
