"use client";

import { useEffect, useRef } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * The second, decorative copy of a marquee track, built in the browser.
 *
 * A seamless loop needs the list twice, but only the first copy is content.
 * Rendering the second on the server doubled the review wall's markup, sent it
 * a second time in the RSC payload and made React hydrate it, for a copy that
 * is `aria-hidden` and `inert` anyway. Here the server sends an empty list and
 * this clones the real one, its previous sibling, once motion is allowed.
 *
 * React renders this element with no children and never re-renders it, so it
 * never reconciles the cloned nodes. Under reduced motion nothing is cloned and
 * the row is a scroller. Without scripting the CSS makes it a scroller too.
 */
export function MarqueeEcho({ className }: { className?: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const echo = ref.current;
    const source = echo?.previousElementSibling;
    if (!echo || !source) return;

    const query = window.matchMedia(REDUCED);
    const sync = () => {
      if (query.matches) echo.replaceChildren();
      else if (!echo.hasChildNodes())
        echo.append(...Array.from(source.childNodes, (n) => n.cloneNode(true)));
    };

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return <ul ref={ref} className={className} aria-hidden inert />;
}
