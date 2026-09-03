"use client";

import { useEffect, useRef, useState } from "react";

const EASE_OUT_QUART = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Metric roll: 900ms easeOutQuart, once, when the number scrolls into view.
 * The digits render in tabular figures so the width cannot jitter mid-count,
 * and the final value is in the server HTML so it is never missing for a
 * crawler or a reader with JS off.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 900,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      start ||= now;
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(EASE_OUT_QUART(t) * value));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDisplay(0);
        frame = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular">{display}</span>
      {suffix}
    </span>
  );
}
