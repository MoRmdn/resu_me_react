import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/cn";

/**
 * One band of the Ledger page. Bands sit flush and alternate the paper
 * (ink-900) and the ruled band (ink-800), divided by a hairline.
 */
export function Section({
  id,
  tone = "ink-900",
  border = true,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  tone?: "ink-900" | "ink-800";
  border?: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full scroll-mt-24",
        tone === "ink-800" ? "bg-ink-800" : "bg-ink-900",
        border && "border-t border-line",
        "py-20 md:py-30",
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
 * Section header: the numbered eyebrow, then the wide display title, with an
 * optional note on the baseline at the end of the row.
 */
export function SectionHeader({
  index,
  eyebrow,
  headline,
  note,
  aside,
  className,
  headingClassName,
}: {
  /** Ledger number, 1-based, in nav order. */
  index?: number;
  eyebrow: string;
  headline: React.ReactNode;
  note?: string;
  aside?: React.ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div data-reveal className={cn("flex flex-wrap items-end justify-between gap-x-10 gap-y-4", className)}>
      <div className={headingClassName ?? "max-w-[40rem]"}>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <h2 className="mt-4 text-display-l">{headline}</h2>
      </div>
      {aside ?? (note ? <p className="pb-2 font-mono text-[0.8125rem] text-bone-52 tabular">{note}</p> : null)}
    </div>
  );
}
