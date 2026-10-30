"use client";

import { useEffect, useState } from "react";

/**
 * Hover pauses a marquee, but a phone has no hover and a keyboard never lands
 * on one. Text that moves has to be stoppable, so this is the way to stop it.
 *
 * It flips a data attribute on `target` and the CSS does the rest, so the
 * marquee itself stays a server component. Hidden under reduced motion, where
 * there is nothing to pause, and without scripting, where it could not work.
 */
export function MarqueeToggle({
  target,
  pauseLabel,
  playLabel,
}: {
  target: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.getElementById(target)?.setAttribute("data-marquee-paused", String(paused));
  }, [paused, target]);

  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => setPaused((p) => !p)}
      className="marquee-toggle inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3.5 text-caption text-bone-70 transition-colors duration-fast ease-fast hover:border-line-strong hover:text-bone"
    >
      <span aria-hidden className="text-[0.625rem]">
        {paused ? "▶" : "❚❚"}
      </span>
      {paused ? playLabel : pauseLabel}
    </button>
  );
}
