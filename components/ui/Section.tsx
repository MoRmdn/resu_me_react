import { cn } from "@/lib/cn";

/**
 * One plane of the page.
 *
 * DESIGN-SYSTEM v2 §3.1: planes alternate ink-900 / ink-800 — two backgrounds
 * only, no third — and overlap rather than stack flush, so the page reads as
 * the layered planes the brand metaphor is built on. Each plane is opaque and
 * carries its own z-index so it slides over the held hero and over the plane
 * before it.
 *
 * The overlap values are the ones actually drawn in the artboard: −40px twice,
 * −1px where About meets the marquee seam, and a positive 112px gap elsewhere.
 * §3.1's prose says every plane overlaps by −40px; the artboard does not, and
 * the artboard is what was designed.
 */
export function Section({
  id,
  tone = "ink-900",
  z,
  offset = 0,
  border = true,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  tone?: "ink-900" | "ink-800";
  /** Stacking order. Planes run 10 → 22, all below the grain (30) and nav (40). */
  z?: number;
  /** Negative overlaps the previous plane; positive opens a gap. */
  offset?: number;
  border?: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{ zIndex: z, marginTop: offset || undefined }}
      className={cn(
        "relative w-full scroll-mt-24",
        tone === "ink-800" ? "bg-ink-800" : "bg-ink-900",
        border && "border-t border-line",
        "py-[76px] md:py-28",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-content px-5 md:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Section header. The artboard sets every opener at 72px display-l with the
 * eyebrow above and an optional right-aligned mono note on the baseline.
 */
export function SectionHeader({
  eyebrow,
  headline,
  note,
  aside,
  className,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  note?: string;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-10 gap-y-4",
        className,
      )}
    >
      <div className="max-w-[16ch]">
        <p className="eyebrow text-bone-52">{eyebrow}</p>
        <h2 className="mt-6 text-display-l text-balance">{headline}</h2>
      </div>
      {aside ?? (note ? <p className="eyebrow pb-2.5 text-bone-52">{note}</p> : null)}
    </div>
  );
}
