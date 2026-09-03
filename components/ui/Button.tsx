import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 py-3.5 " +
  "font-medium transition-[transform,background-color,border-color,color] " +
  "duration-fast ease-fast will-change-transform";

const VARIANTS: Record<Variant, string> = {
  // Copper fill, ink label. Hover brightens and lifts 2px; pressed returns to 0.
  primary:
    "bg-copper text-ink-900 hover:-translate-y-0.5 hover:bg-copper-bright active:translate-y-0 active:bg-copper-dim",
  ghost:
    "border border-line text-bone hover:-translate-y-0.5 hover:border-line-strong hover:bg-bone-06 active:translate-y-0",
};

export type ButtonProps = {
  href: string;
  variant?: Variant;
  external?: boolean;
  download?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  external,
  download,
  className,
  children,
}: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], "text-[0.96875rem]", className);

  // In-page anchors, mailto:, tel: and the CV download are plain anchors —
  // next/link would only add a router round trip.
  const isPlain = external || download || href.startsWith("#") || href.includes(":");

  if (isPlain) {
    return (
      <a
        href={href}
        className={classes}
        {...(download ? { download: "" } : {})}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
