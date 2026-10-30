import marks from "@/content/platform-marks.json";
import type { PlatformId } from "@/content/reviews";

/**
 * A marketplace's logo, inherited colour. Upwork, Fiverr and Freelancer come
 * from Simple Icons, Mostaql from its own SVG. Khamsat only publishes a raster
 * logo, so its 5 is redrawn. They mark where a review came from, so they stay
 * unmodified apart from the crop.
 *
 * Height is per mark: a wordmark and a glyph read as the same size only when
 * the glyph is drawn slightly taller.
 */
export function PlatformMark({
  platform,
  label,
  className,
}: {
  platform: PlatformId;
  label: string;
  className?: string;
}) {
  const mark = marks[platform];
  const [, , width, height] = mark.viewBox.split(" ").map(Number);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={mark.viewBox}
      width={(width / height) * mark.height}
      height={mark.height}
      fill="currentColor"
      className={className}
      // Static, author-controlled string — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: mark.markup }}
    />
  );
}
