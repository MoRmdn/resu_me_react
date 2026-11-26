"use client";

import { useEffect } from "react";

/**
 * Turns on scroll reveals. Until this runs, nothing is hidden: the served HTML,
 * crawlers, no-JS visitors and reduced-motion visitors all get the finished
 * page. Once on, each `[data-reveal]` fades up the first time it enters the
 * viewport and is then left alone. No React state: the observer writes one
 * attribute per element, once.
 */
export function RevealObserver() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const items = document.querySelectorAll("[data-reveal]:not([data-revealed])");
    items.forEach((el) => {
      // Anything already above the fold shows at once rather than blinking out.
      if (el.getBoundingClientRect().top < innerHeight * 0.92) el.setAttribute("data-revealed", "");
      else io.observe(el);
    });
    root.classList.add("reveal-on");
    return () => io.disconnect();
  }, []);
  return null;
}
