import { cn } from "@/lib/cn";

/**
 * Full-bleed band with a centred 1240px column.
 *
 * Section backgrounds alternate ink-900 / ink-800 so they separate without
 * needing rules between them.
 */
export function Section({
  id,
  tone = "ink-900",
  className,
  innerClassName,
  children,
}: {
  id?: string;
  tone?: "ink-900" | "ink-800";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "w-full scroll-mt-24",
        tone === "ink-800" ? "bg-ink-800" : "bg-ink-900",
        "py-[76px] md:py-32",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-content px-5 md:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
