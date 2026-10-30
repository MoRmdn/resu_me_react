"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { clientMapCopy } from "@/content/copy";
import {
  clientCountries,
  clientsIn,
  dominationOf,
  unplacedClients,
  type ClientFilter,
} from "@/content/clients";
import type { PlatformId } from "@/content/reviews";
import { cn } from "@/lib/cn";

/** How close to the map's edge a tooltip has to flip to stay on it. */
const EDGE_X = 130;
const EDGE_Y = 96;

/**
 * The interactive half of the client map: the site filter, the hover, and the
 * ranked list.
 *
 * Hover is a state change on crossing into a country, never on pointer move, so
 * moving across one country re-renders nothing. Lighting the map writes
 * attributes straight onto its server-rendered shapes, and the filter is one
 * attribute on the root that the CSS answers.
 */
export function ClientMapExplorer({
  width,
  height,
  platforms,
  positions,
  children,
}: {
  width: number;
  height: number;
  platforms: { id: PlatformId; label: string }[];
  positions: Record<string, number[]>;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ClientFilter>("all");
  const [active, setActive] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      clientCountries
        .map((country) => ({ country, clients: clientsIn(country, filter) }))
        .filter((row) => row.clients > 0)
        .sort((a, b) => b.clients - a.clients),
    [filter],
  );

  const placed = rows.reduce((sum, row) => sum + row.clients, 0);
  const most = rows[0]?.clients ?? 1;
  const unplaced =
    filter === "all"
      ? Object.values(unplacedClients).reduce((sum, n) => sum + (n ?? 0), 0)
      : (unplacedClients[filter] ?? 0);

  useEffect(() => {
    const map = root.current;
    if (!map) return;
    map.querySelectorAll("[data-lit]").forEach((el) => el.removeAttribute("data-lit"));
    if (!active) return;
    map
      .querySelectorAll(`[data-map-target="${active}"]`)
      .forEach((el) => el.setAttribute("data-lit", "true"));
  }, [active]);

  const activeCountry = clientCountries.find((c) => c.id === active);
  const activePosition = active ? positions[active] : undefined;

  return (
    <div
      ref={root}
      data-map-filter={filter}
      onPointerOver={(event) => {
        const target = (event.target as Element).closest("[data-map-target]");
        if (target) setActive(target.getAttribute("data-map-target"));
      }}
      onPointerOut={(event) => {
        if ((event.target as Element).closest("[data-map-target]")) setActive(null);
      }}
    >
      <div className="grid items-end gap-8 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div>
          <p className="eyebrow text-bone-52">{clientMapCopy.eyebrow}</p>
          <h3 className="mt-5 flex flex-wrap items-baseline gap-x-4 text-h1">
            {clientMapCopy.headline}
            <CountUp key={filter} value={dominationOf(rows.length)} suffix="%" className="tabular" />
          </h3>
        </div>
        <p className="max-w-[46ch] text-body text-bone-70">{clientMapCopy.blurb}</p>
      </div>

      <div
        role="group"
        aria-label={clientMapCopy.filterLabel}
        className="mt-8 flex flex-wrap items-center gap-2"
      >
        {[{ id: "all" as const, label: clientMapCopy.allLabel }, ...platforms].map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={filter === option.id}
            onClick={() => {
              setFilter(option.id);
              setActive(null);
            }}
            className={cn(
              "inline-flex min-h-11 items-center rounded-pill border px-4 text-caption transition-colors duration-fast ease-fast",
              filter === option.id
                ? "border-line-strong bg-ink-600 text-bone"
                : "border-line text-bone-70 hover:border-line-strong hover:text-bone",
            )}
          >
            {option.label}
          </button>
        ))}
        <p aria-live="polite" className="ml-auto text-caption text-bone-52">
          <span className="tabular">{rows.length}</span>{" "}
          {clientMapCopy.countriesLabel(rows.length)} ·{" "}
          <span className="tabular">{placed}</span> {clientMapCopy.clientsLabel(placed)}
        </p>
      </div>

      <div
        className="relative mt-8"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {children}

        {activeCountry && activePosition && (
          <div
            aria-hidden
            className="map-tip"
            data-x={
              activePosition[0] < EDGE_X
                ? "start"
                : activePosition[0] > width - EDGE_X
                  ? "end"
                  : undefined
            }
            data-y={activePosition[1] < EDGE_Y ? "below" : undefined}
            style={{
              left: `${(activePosition[0] / width) * 100}%`,
              top: `${(activePosition[1] / height) * 100}%`,
            }}
          >
            <p className="text-[0.875rem] font-semibold text-bone">{activeCountry.name}</p>
            <p className="mt-1 text-[0.75rem] text-bone-62">
              {platforms
                .filter((p) => activeCountry.clients[p.id])
                .map((p) => `${p.label} ${activeCountry.clients[p.id]}`)
                .join(" · ")}
            </p>
          </div>
        )}
      </div>

      <ol className="mt-8 grid grid-cols-2 gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {rows.map(({ country, clients }) => (
          <li key={country.id}>
            <button
              type="button"
              onPointerEnter={() => setActive(country.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(country.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(country.id)}
              className="map-row group flex min-h-11 w-full flex-col justify-center gap-1.5 text-left"
              data-active={active === country.id || undefined}
            >
              <span className="flex items-baseline justify-between gap-3 text-caption text-bone-70 transition-colors duration-fast ease-fast group-hover:text-bone">
                {country.name}
                <span className="tabular font-mono text-[0.75rem] text-bone">{clients}</span>
              </span>
              <span
                aria-hidden
                className="map-row__bar"
                style={{ "--bar": clients / most } as React.CSSProperties}
              />
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-caption text-bone-52">
        <p className="flex items-center gap-2">
          <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-jade" />
          {clientMapCopy.homeLabel}
        </p>
        <p>{clientMapCopy.countedNote}</p>
        {unplaced > 0 && <p>{clientMapCopy.unplacedNote(unplaced)}</p>}
      </div>
    </div>
  );
}
