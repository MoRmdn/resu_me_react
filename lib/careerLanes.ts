import type { Experience } from "@/content/types";

/**
 * Packs roles into non-overlapping lanes for the career band.
 *
 * The artboard drew this as seven bars side by side against a 2021 → NOW axis.
 * That is wrong for this data: the months sum to 110 against ~65 months of real
 * elapsed time, because four engagements ran concurrently through 2024 and most
 * were part-time. Laid out sequentially it inflates the career by 1.7x and
 * reads concurrent contracts as consecutive ones.
 *
 * So bars are positioned from the ISO `start`/`end` already in the content, and
 * anything that would collide drops to the next lane. The overlap is the point:
 * running four international engagements at once is the stronger claim.
 */

export type LaneBar = {
  role: Experience;
  /** Fractions of the full axis, 0–1. */
  left: number;
  width: number;
  lane: number;
  months: number;
};

/** "2024-01" -> month index. */
function toMonths(iso: string): number {
  const [y, m] = iso.split("-").map(Number);
  return y * 12 + (m - 1);
}

export function buildCareerLanes(roles: readonly Experience[], now = new Date()) {
  const nowMonths = now.getFullYear() * 12 + now.getMonth();

  const spans = roles.map((role) => {
    const start = toMonths(role.start);
    // An open-ended role runs to today.
    const end = role.end ? toMonths(role.end) : nowMonths;
    return { role, start, end: Math.max(end, start + 1) };
  });

  const axisStart = Math.min(...spans.map((s) => s.start));
  const axisEnd = Math.max(...spans.map((s) => s.end), nowMonths);
  const axisMonths = Math.max(1, axisEnd - axisStart);

  // Greedy first-fit: earliest start wins the lowest free lane.
  const laneEnds: number[] = [];
  const bars: LaneBar[] = [...spans]
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .map((span) => {
      let lane = laneEnds.findIndex((end) => end <= span.start);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = span.end;

      return {
        role: span.role,
        lane,
        months: span.end - span.start,
        left: (span.start - axisStart) / axisMonths,
        width: (span.end - span.start) / axisMonths,
      };
    });

  /** Year ticks along the axis, one per January in range. */
  const ticks: { year: number; at: number }[] = [];
  const firstYear = Math.ceil(axisStart / 12);
  for (let y = firstYear; y * 12 <= axisEnd; y++) {
    ticks.push({ year: y, at: (y * 12 - axisStart) / axisMonths });
  }

  return { bars, laneCount: laneEnds.length, axisMonths, ticks };
}

/** How many roles were live at the busiest point — the fact the band exists to show. */
export function peakConcurrency(bars: LaneBar[]): number {
  const edges = bars.flatMap((b) => [b.left, b.left + b.width]);
  return Math.max(
    1,
    ...edges.map(
      (t) => bars.filter((b) => b.left <= t && t < b.left + b.width).length,
    ),
  );
}
