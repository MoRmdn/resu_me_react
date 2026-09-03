"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CareerBand } from "./CareerBand";
import { experiences } from "@/content/experience";
import { experienceCopy } from "@/content/copy";
import { cn } from "@/lib/cn";

/**
 * Collapsed panels stay in the DOM — that is what puts every achievement bullet
 * in the served HTML — and carry `inert` when closed so they leave the tab
 * order and the accessibility tree.
 */
export function Experience() {
  const [openSlug, setOpenSlug] = useState<string | null>(
    experiences.find((e) => e.isCurrent)?.slug ?? null,
  );

  return (
    <Section id="experience" tone="ink-800" z={14} offset={112}>
      <Reveal>
        <SectionHeader
          eyebrow={experienceCopy.eyebrow}
          headline={experienceCopy.headline}
          note={experienceCopy.hint}
          className="mb-14"
        />
      </Reveal>

      <Reveal delay={0.06}>
        <CareerBand
          roles={experiences}
          openSlug={openSlug}
          onSelect={(slug) => setOpenSlug(slug)}
        />
      </Reveal>

      <ul className="border-t border-line">
        {experiences.map((role, i) => {
          const isOpen = openSlug === role.slug;
          const panelId = `exp-panel-${role.slug}`;

          return (
            <Reveal as="li" key={role.slug} delay={Math.min(i * 0.04, 0.2)}>
              <div className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenSlug(isOpen ? null : role.slug)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group grid w-full grid-cols-[20px_1fr_auto] items-center gap-x-5 py-6 text-left transition-colors duration-fast ease-fast hover:bg-bone/[0.02] md:grid-cols-[32px_1fr_240px_190px_24px] md:gap-x-6 md:px-2"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-[9px] shrink-0 rotate-45 justify-self-center border transition-colors duration-fast ease-fast",
                        isOpen
                          ? "border-copper bg-copper"
                          : "border-bone-28 bg-transparent group-hover:border-bone-52",
                      )}
                    />

                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="text-[1.0625rem] leading-tight font-semibold tracking-[-0.01em] md:text-h3">
                          {role.position}
                        </span>
                        {role.isCurrent && (
                          <span className="eyebrow rounded-pill bg-jade/12 px-2 py-1 text-jade">
                            {experienceCopy.currentBadge}
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block font-mono text-[0.8125rem] text-bone-52">
                        {role.company}
                      </span>
                      {/* Dates and location get their own columns on desktop;
                          on mobile they fold under the company. */}
                      <span className="mt-1 block font-mono text-[0.75rem] tracking-[0.06em] text-bone-52 tabular md:hidden">
                        {role.startDate} — {role.endDate}
                      </span>
                    </span>

                    <span className="hidden font-mono text-[0.78125rem] tracking-[0.06em] text-bone-52 tabular md:block">
                      <time dateTime={role.start}>{role.startDate}</time>
                      {" — "}
                      {role.end ? (
                        <time dateTime={role.end}>{role.endDate}</time>
                      ) : (
                        role.endDate
                      )}
                    </span>

                    <span className="hidden font-mono text-[0.78125rem] tracking-[0.06em] text-bone-52 md:block">
                      {role.location}
                    </span>

                    <span
                      aria-hidden
                      className={cn(
                        "justify-self-end text-lg leading-none transition-[transform,color] duration-base ease-base md:justify-self-center",
                        isOpen ? "rotate-45 text-bone" : "text-bone-28",
                      )}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div id={panelId} className="collapse" data-open={isOpen} inert={!isOpen}>
                  <div>
                    <div className="grid gap-x-6 pb-8 md:grid-cols-[32px_1fr] md:px-2">
                      <div aria-hidden className="hidden md:block" />
                      <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-14">
                        <div>
                          <p className="text-body text-bone-70">{role.description}</p>
                          {role.engagement && (
                            <p className="mt-4 eyebrow text-bone-52">{role.engagement}</p>
                          )}
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {role.technologies.map((tech) => (
                              <li
                                key={tech}
                                className="eyebrow rounded-sm bg-copper-wash px-2.5 py-1.5 text-copper"
                              >
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <ol className="border-t border-line">
                          {role.achievements.map((item, n) => (
                            <li
                              key={item}
                              className="grid grid-cols-[34px_1fr] gap-3 border-b border-line py-3.5 text-body text-bone-70 last:border-b-0"
                            >
                              <span aria-hidden className="font-mono text-[0.75rem] text-bone-28">
                                {String(n + 1).padStart(2, "0")}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
