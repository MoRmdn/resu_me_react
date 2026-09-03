/**
 * The composed-M mark. See design/LOGO.md.
 *
 * One folded stroke, four folds, with the right half drawn over in copper so it
 * reads as two stacked planes meeting at a seam. Geometry is locked: 48×48
 * optical box, 4.4 stroke (~9%), square caps, mitred joins. Never recolour the
 * bone half, outline it, skew it, or put it on a copper background.
 */

const BONE_PATH = "M6 39 L17 9 L24 26 L31 9 L42 39";
const COPPER_PATH = "M24 26 L31 9 L42 39";

export type MarkProps = {
  size?: number;
  /** Colour of the base stroke. */
  base?: string;
  /** Colour of the overlaid right half. */
  accent?: string;
  className?: string;
  /** Decorative by default — set when the mark is the only label. */
  title?: string;
};

export function MoRmdnMark({
  size = 48,
  base = "var(--color-bone)",
  accent = "var(--color-copper)",
  className,
  title,
}: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <g
        strokeWidth={4.4}
        strokeLinecap="square"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      >
        <path d={BONE_PATH} stroke={base} />
        <path d={COPPER_PATH} stroke={accent} />
      </g>
    </svg>
  );
}

export { BONE_PATH, COPPER_PATH };
