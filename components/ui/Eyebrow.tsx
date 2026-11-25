import { cn } from "@/lib/cn";

/**
 * Section label with its Ledger number (01 About … 06 Contact), the page's
 * signature. Sentence case, 13px, bone-52 — the contrast floor.
 */
export function Eyebrow({
  children,
  index,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  /** 1-based position in the nav; omit for labels that are not sections. */
  index?: number;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag className={cn("eyebrow flex items-baseline gap-3 text-bone-52", className)}>
      {index !== undefined && (
        <span className="font-mono tabular">{String(index).padStart(2, "0")}</span>
      )}
      <span>{children}</span>
    </Tag>
  );
}
