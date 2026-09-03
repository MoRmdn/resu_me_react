"use client";

import { useEffect } from "react";

/**
 * 2px copper line at the top of the viewport.
 *
 * Where the browser supports scroll-driven animations the bar is pure CSS and
 * this component installs nothing at all. Otherwise it writes one custom
 * property from a rAF-throttled passive listener — the Flutter version called
 * setState on every scroll event.
 */
export function ScrollProgress() {
  useEffect(() => {
    const nativelySupported =
      typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()");
    if (nativelySupported) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      doc.style.setProperty("--scroll-progress", String(progress));
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-50 h-0.5 bg-copper" />;
}
