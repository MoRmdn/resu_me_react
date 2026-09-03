import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Rise-and-fade on scroll. A server component: it only emits a class and two
 * custom properties, and RevealRoot's shared observer flips data-visible.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Seconds. Stagger within a group; keep the total under ~0.25s. */
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span" | "section" | "article";
}) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
