import { cn } from "@/lib/cn";

/** Mono section label: 11px, 0.18em tracking, uppercase, bone-52 (the contrast floor). */
export function Eyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return <Tag className={cn("eyebrow text-bone-52", className)}>{children}</Tag>;
}
