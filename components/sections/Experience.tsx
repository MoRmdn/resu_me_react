"use client";
import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";

import { useMemo, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { buildCareerLanes } from "@/lib/careerLanes";
import { getExperiences } from "@/content/profile-i18n";

import { attentionAttrs, experienceParams, trackAttrs } from "@/lib/analytics/attrs";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/useHydrated";

/**
 * Collapsed panels stay in the DOM — that is what puts every achievement bullet
 * in the served HTML. CSS keeps them out of the tab order and accessibility
 * tree before hydration, then `inert` takes over. With scripting disabled the
 * panels stand open without `inert`, so the complete document stays accessible.
 */
export function Experience({ locale = "en" }: LocaleProps) {
  const { experienceCopy } = getCopy(locale);
  const copy = ui[locale];
  const experiences = getExperiences(locale);
  const hydrated = useHydrated();
  const { bars, ticks } = useMemo(() => buildCareerLanes(experiences), [experiences]);
  const [openSlug, setOpenSlug] = useState<string | null>(
    experiences.find((e) => e.isCurrent)?.slug ?? null,
  );
  const ROW = "lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_14rem_1.75rem] lg:gap-x-6";

  return (
    <Section id="experience" tone="ink-800">
      <SectionHeader
        index={2}
        eyebrow={experienceCopy.eyebrow}
        headline={experienceCopy.headline}
        aside={<p className="max-w-[36ch] text-[0.875rem] text-bone-70">{experienceCopy.bandCaption}</p>}
      />

      {/* The shared time axis. Time runs left to right in both languages. */}
      <div aria-hidden className={cn("mt-12 hidden pb-2.5 lg:grid", ROW)}>
        <span />
        <span dir="ltr" className="relative h-4 font-mono text-[0.78125rem] text-bone-52 tabular">
          {ticks.map((t) => (
            <span key={t.year} className="absolute" style={{ left: `${t.at * 100}%` }}>
              {t.year}
            </span>
          ))}
        </span>
      </div>

      <ul className="mt-8 border-t border-line-strong lg:mt-0">
        {experiences.map((role) => {
          const isOpen = openSlug === role.slug;
          const panelId = `exp-panel-${role.slug}`;
          const bar = bars.find((b) => b.role.slug === role.slug);

          return (
            <li key={role.slug} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : role.slug)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={cn(
                    "group grid min-h-11 w-full grid-cols-[minmax(0,1fr)_1.75rem] items-center gap-x-4 gap-y-2 py-5 text-start",
                    ROW,
                  )}
                  {...trackAttrs("experience_toggle", {
                    ...experienceParams(role),
                    toggle_action: isOpen ? "close" : "open",
                    toggle_method: "list_row",
                  })}
                >
                  <span className="min-w-0">
                    <span className="block text-[1.0625rem] leading-snug font-semibold tracking-[-0.01em]">
                      <bdi>{role.company}</bdi>{" "}
                      <span className="font-normal text-bone-52">· {role.country}</span>
                    </span>
                    <span className="mt-0.5 block text-[0.875rem] text-bone-70">{role.position}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-2.5 font-mono text-[0.8125rem] text-bone-70 tabular lg:hidden">
                      {role.isCurrent && <CurrentChip label={experienceCopy.currentBadge} />}
                      {role.startDate} — {role.endDate}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    dir="ltr"
                    className="relative hidden h-2.5 rounded-pill bg-ink-900 lg:block"
                  >
                    {bar && (
                      <span
                        className={cn(
                          "absolute inset-y-0 rounded-pill transition-colors duration-fast ease-fast",
                          isOpen ? "bg-copper" : "bg-bone group-hover:bg-bone-70",
                        )}
                        style={{ left: `${bar.left * 100}%`, width: `${bar.width * 100}%` }}
                      />
                    )}
                  </span>
                  {bar && (
                    <span className="sr-only">
                      {bar.months} {copy.months}
                    </span>
                  )}

                  <span className="hidden items-center gap-2.5 font-mono text-[0.8125rem] text-bone-70 tabular lg:flex">
                    {role.isCurrent && <CurrentChip label={experienceCopy.currentBadge} />}
                    <span>
                      <time dateTime={role.start}>{role.startDate}</time>
                      {" — "}
                      {role.end ? <time dateTime={role.end}>{role.endDate}</time> : role.endDate}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "grid size-7 place-items-center justify-self-end rounded-sm border border-line-strong text-base leading-none transition-transform duration-base ease-base",
                      isOpen && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                className="disclosure"
                data-open={isOpen}
                inert={hydrated && !isOpen}
                {...attentionAttrs("experience", experienceParams(role))}
              >
                <div>
                  <div className="grid gap-8 pb-8 lg:ps-[calc(15rem+1.5rem)] lg:grid-cols-[5fr_7fr] lg:gap-12">
                    <div>
                      <p className="text-body text-bone-70">{role.description}</p>
                      {role.engagement && (
                        <p className="mt-4 text-caption text-bone-52">
                          {role.engagement} · {role.location}
                        </p>
                      )}
                      <ul className="mt-5 flex flex-wrap gap-1.5">
                        {role.technologies.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-sm border border-line-strong px-2 py-0.5 text-caption text-bone-70"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <ul className="border-t border-line">
                      {role.achievements.map((item) => (
                        <li key={item} className="border-b border-line py-3 text-body text-bone-70 last:border-b-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function CurrentChip({ label }: { label: string }) {
  return (
    <span className="rounded-sm bg-jade px-2 py-0.5 font-sans text-[0.75rem] font-semibold text-ink-900">
      {label}
    </span>
  );
}
