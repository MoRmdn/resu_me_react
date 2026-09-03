import { cn } from "@/lib/cn";

/**
 * Infinite technology strip.
 *
 * The track holds two identical copies of the list and translates by -50%, so
 * the loop point is invisible. Pauses on hover and on keyboard focus; under
 * reduced motion it stops and becomes a horizontally scrollable list.
 */
export function Marquee({
  items,
  duration = 42,
  className,
}: {
  items: readonly string[];
  duration?: number;
  className?: string;
}) {
  const run = [...items, ...items];

  return (
    <div
      className={cn("marquee group relative overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      {/* Screen readers get the list once, not the duplicated track. */}
      <span className="sr-only">Technologies: {items.join(", ")}</span>

      <div className="marquee-track" aria-hidden>
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center">
            <span className="eyebrow px-6 text-bone-52 whitespace-nowrap">{item}</span>
            <span className="text-[8px] text-copper/70">&#9670;</span>
          </span>
        ))}
      </div>

      {/* Edges fade into the band so items do not clip mid-glyph. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-ink-800 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-ink-800 to-transparent" />
    </div>
  );
}
