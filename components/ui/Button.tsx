import Link from "next/link";
import type { TrackAttrs } from "@/lib/analytics/attrs";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 py-3 " +
  "font-medium transition-colors duration-fast ease-fast";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-copper text-ink-900 hover:bg-copper-bright active:bg-copper-dim",
  ghost:
    "border border-line text-bone hover:border-line-strong hover:bg-bone-06",
};

export type ButtonProps = {
  href: string;
  variant?: Variant;
  external?: boolean;
  download?: boolean;
  /** Required: from `trackAttrs`. No control on this site goes untracked. */
  track: TrackAttrs;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  external,
  download,
  track,
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
        {...track}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...track}>
      {children}
    </Link>
  );
}
