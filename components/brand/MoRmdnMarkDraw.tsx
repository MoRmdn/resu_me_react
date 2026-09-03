import { BONE_PATH, COPPER_PATH, type MarkProps } from "./MoRmdnMark";

/**
 * The mark drawing itself, one half after the other — the draw-on that
 * design/LOGO.md lists as unbuilt.
 *
 * pathLength="100" normalises both paths, so a single dasharray of 100 works
 * for either regardless of its real length. Runs once, on load, in the hero
 * only; LOGO.md is explicit that the mark must not animate everywhere. Under
 * reduced motion it renders fully drawn (see .draw-path in globals.css).
 */
export function MoRmdnMarkDraw({
  size = 48,
  base = "var(--color-bone)",
  accent = "var(--color-copper)",
  className,
}: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <g strokeWidth={4.4} strokeLinecap="square" strokeLinejoin="miter">
        <path
          d={BONE_PATH}
          stroke={base}
          pathLength={100}
          className="draw-path"
          style={{ "--draw-delay": "0.1s" } as React.CSSProperties}
        />
        <path
          d={COPPER_PATH}
          stroke={accent}
          pathLength={100}
          className="draw-path"
          style={{ "--draw-delay": "0.5s" } as React.CSSProperties}
        />
      </g>
    </svg>
  );
}
