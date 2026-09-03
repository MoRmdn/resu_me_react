import { ProjectImage } from "./ProjectImage";
import { cn } from "@/lib/cn";
import type { ProjectMedia } from "@/content/types";

/**
 * Plate 01 — the icon tile. DESIGN-SYSTEM §5.2.
 *
 * A 96px ink-600 tile with a hairline, the source inset at 64px with its own
 * small radius. Store icons arrive on opaque white or brand fields; setting one
 * directly on the page reads as a halo, so the tile turns it into a deliberate
 * inset chip instead. A transparent source has no field to chip, so it gets
 * padding and contain, and no radius.
 */
export function IconTile({
  icon,
  title,
  size = 96,
  className,
}: {
  icon: NonNullable<ProjectMedia["icon"]>;
  title: string;
  size?: number;
  className?: string;
}) {
  const inset = icon.transparent ? 12 : Math.round(size * (2 / 3));

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-ink-600",
        className,
      )}
      style={{ width: size, height: size, padding: icon.transparent ? 12 : undefined }}
    >
      <ProjectImage
        file={icon.file}
        widths={[64, 128]}
        sizes={`${inset}px`}
        alt={`${title} app icon`}
        width={512}
        height={512}
        className={cn("block", icon.transparent ? "size-full object-contain" : "rounded-[6px]")}
        style={icon.transparent ? undefined : { width: inset, height: inset }}
      />
    </div>
  );
}
