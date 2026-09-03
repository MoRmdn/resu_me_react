import { cn } from "@/lib/cn";

/** Copper-wash chip for technologies. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-sm bg-copper-wash px-2.5 py-1.5 text-copper",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Neutral variant — used where copper would be the second accent in a viewport. */
export function QuietTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-sm border border-line px-2.5 py-1.5 text-bone-52",
        className,
      )}
    >
      {children}
    </span>
  );
}
