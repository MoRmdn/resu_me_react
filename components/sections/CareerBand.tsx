"use client";

import { useMemo, useRef } from "react";
import { buildCareerLanes } from "@/lib/careerLanes";
import { experienceCopy } from "@/content/copy";
import type { Experience } from "@/content/types";
import { cn } from "@/lib/cn";

const LANE_H = 26;
const LANE_GAP = 6;

/**
 * The Experience index: every role placed on a real time axis, with concurrent
 * engagements stacked into lanes rather than laid end to end.
 *
 * Clicking a bar opens the matching row below. Keyboard model comes from
 * DESIGN-SYSTEM §5.1 and is the part the artboard left out: arrows move the
 * selection, Enter and Space open. Roving tabindex, so the band is one tab stop
 * rather than seven.
 *
 * The bars are 26px tall, above WCAG 2.2's 24px minimum target, and every one
 * of them has a full-height equivalent control in the row list below.
 */
export function CareerBand({
  roles,
  openSlug,
  onSelect,
}: {
  roles: readonly Experience[];
  openSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const { bars, laneCount, ticks } = useMemo(() => buildCareerLanes(roles), [roles]);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Tab order follows the visual left-to-right reading, not lane order.
  const order = useMemo(
    () => [...bars].sort((a, b) => a.left - b.left).map((b) => b.role.slug),
    [bars],
  );
  const focusIndex = Math.max(0, order.indexOf(openSlug ?? order[0]));

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = order[(focusIndex + delta + order.length) % order.length];
    onSelect(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="mb-12">
      <div
        role="group"
        aria-label="Career timeline — select a role"
        onKeyDown={onKeyDown}
        className="relative"
        style={{ height: laneCount * LANE_H + (laneCount - 1) * LANE_GAP }}
      >
        {/* Year gridlines, behind the bars. */}
        {ticks.map((t) => (
          <span
            key={t.year}
            aria-hidden
            className="absolute top-0 bottom-0 w-px bg-line"
            style={{ left: `${t.at * 100}%` }}
          />
        ))}

        {bars.map((bar, i) => {
          const active = openSlug === bar.role.slug;
          return (
            <button
              key={bar.role.slug}
              ref={(el) => {
                refs.current[bar.role.slug] = el;
              }}
              type="button"
              tabIndex={i === 0 || active ? 0 : -1}
              aria-pressed={active}
              aria-label={`${bar.role.position} at ${bar.role.company}, ${bar.role.startDate} to ${bar.role.endDate}, ${bar.months} months`}
              onClick={() => onSelect(bar.role.slug)}
              className={cn(
                "band-bar absolute flex items-center overflow-hidden rounded-t-sm border px-2.5 text-left",
                "transition-[background-color,border-color] duration-fast ease-fast",
                active
                  ? "border-copper/35 bg-copper/12"
                  : "border-line bg-bone-06 hover:border-line-strong",
              )}
              style={
                {
                  left: `${bar.left * 100}%`,
                  width: `${bar.width * 100}%`,
                  top: bar.lane * (LANE_H + LANE_GAP),
                  height: LANE_H,
                  // Oldest bar grows first, newest last.
                  "--band-delay": `${(bars.length - 1 - i) * 0.04}s`,
                } as React.CSSProperties
              }
            >
              {/* Bone, not copper: the wash fill and warmed border already
                  mark the active bar, and the open row's node is this
                  section's one full-chroma copper (§1.3). */}
              <span
                className={cn(
                  "truncate font-mono text-[0.6875rem] tracking-[0.06em] whitespace-nowrap",
                  active ? "text-bone" : "text-bone-52",
                )}
              >
                {bar.role.company}
              </span>
            </button>
          );
        })}
      </div>

      {/* The axis hairline the bars sit on. */}
      <div className="relative mt-0 border-t border-line pt-2.5">
        {ticks.map((t) => (
          <span
            key={t.year}
            aria-hidden
            className="eyebrow absolute top-2.5 -translate-x-1/2 text-bone-52"
            style={{ left: `${t.at * 100}%` }}
          >
            {t.year}
          </span>
        ))}
        <span className="eyebrow block text-right text-bone-52">
          {experienceCopy.bandAxisNote}
        </span>
      </div>

      <p className="mt-6 max-w-[52ch] text-caption text-bone-52">
        {experienceCopy.bandCaption}
      </p>
    </div>
  );
}
