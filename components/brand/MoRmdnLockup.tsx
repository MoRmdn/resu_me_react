import { MoRmdnMark } from "./MoRmdnMark";
import { site } from "@/content/site";

/**
 * Primary lockup: mark + wordmark, 10px gap. Minimum 96px wide — below that use
 * the mark alone. Clear space is stroke × 2 (~9px at 48px).
 */
export function MoRmdnLockup({
  size = 26,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MoRmdnMark size={size} />
      <span
        className="font-sans font-semibold text-bone"
        style={{ fontSize: "0.96875rem", letterSpacing: "-0.029em" }}
      >
        {site.shortName}
      </span>
    </span>
  );
}
