"use client";

import { useEffect, useRef } from "react";

/**
 * A copper radial that trails the pointer. Fine-pointer devices only.
 *
 * Position is written straight to a transform inside a rAF loop — no React
 * state, so a pointer move never rebuilds a component. This is the same
 * discipline the Flutter version needed (a ValueNotifier feeding a painter,
 * because setState from onHover corrupts Flutter web's mouse tracker), and it
 * is the right shape here too.
 */
export function CursorGlow({ size = 640, opacity = 0.16 }: { size?: number; opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const half = size / 2;
    let targetX = -9999;
    let targetY = -9999;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let visible = false;

    const tick = () => {
      // 0.075 lerp — the same easing constant the Flutter painter used.
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      node.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;

      if (Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5) {
        frame = 0; // Settled: stop burning frames until the pointer moves again.
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame === 0) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        // Jump to the pointer on first sight rather than sliding in from 0,0.
        x = targetX;
        y = targetY;
        node.style.opacity = "1";
      }
      wake();
    };

    const onLeave = () => {
      visible = false;
      node.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [size]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        width: size,
        height: size,
        opacity: 0,
        transition: "opacity 320ms var(--ease-base)",
        // Copper to transparent — the only gradient the system permits.
        background: `radial-gradient(circle, rgb(242 118 46 / ${opacity}) 0%, rgb(242 118 46 / 0) 62%)`,
      }}
      className="pointer-events-none fixed top-0 left-0 z-0 hidden will-change-transform md:block"
    />
  );
}
