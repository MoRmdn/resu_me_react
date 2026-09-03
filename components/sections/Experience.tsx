"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { experiences } from "@/content/experience";
import { experienceCopy } from "@/content/copy";
import { cn } from "@/lib/cn";

/**
 * Collapsed panels stay in the DOM — that is what puts every achievement bullet
 * in the served HTML for a crawler to read — and are marked `inert` when closed
 * so they leave the accessibility tree and the tab order.
 */
export function Experience() {
  // The current role opens by default; it is what a reader wants first.
  const [openSlug, setOpenSlug] = useState<string | null>(
    experiences.find((e) => e.isCurrent)?.slug ?? null,
  );

  return (
    <Section id="experience" tone="ink-800">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{experienceCopy.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h1">{experienceCopy.headline}</h2>
          </div>
          <p className="eyebrow hidden text-bone-52 md:block">{experienceCopy.hint}</p>
        </div>
      </Reveal>

      <ul className="mt-14 border-t border-line">
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
                    className="group flex w-full items-center gap-4 py-6 text-left"
                  >
                    {/* 8px square rotated 45°, fills copper when open. */}
                    <span
                      aria-hidden
                      className={cn(
                        "size-2 shrink-0 rotate-45 border transition-colors duration-fast ease-fast",
                        isOpen
                          ? "border-copper bg-copper"
                          : "border-bone-28 bg-transparent group-hover:border-bone-52",
                      )}
                    />

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[1.0625rem] font-semibold tracking-[-0.02em] transition-colors duration-fast ease-fast md:text-h3",
                          isOpen ? "text-copper" : "text-bone group-hover:text-copper-bright",
                        )}
                      >
                        {role.position}
                        <span className="text-bone-52"> &middot; </span>
                        <span className="font-normal text-bone-70">{role.company}</span>
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="eyebrow tabular text-bone-52">
                          <time dateTime={role.start}>{role.startDate}</time>
                          {" — "}
                          {role.end ? (
                            <time dateTime={role.end}>{role.endDate}</time>
                          ) : (
                            role.endDate
                          )}
                        </span>
                        <span className="eyebrow text-bone-52">{role.country}</span>
                        {role.isCurrent && (
                          <span className="eyebrow rounded-pill bg-jade/12 px-2 py-1 text-jade">
                            {experienceCopy.currentBadge}
                          </span>
                        )}
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className={cn(
                        "shrink-0 text-bone-52 transition-transform duration-base ease-base",
                        isOpen && "rotate-90",
                      )}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div id={panelId} className="collapse" data-open={isOpen} inert={!isOpen}>
                  <div>
                    <div className="max-w-[680px] pb-8 pl-7 md:pl-16">
                      <p className="text-body text-bone-70">{role.description}</p>
                      <ul className="mt-5 flex flex-col gap-3">
                        {role.achievements.map((item) => (
                          <li key={item} className="flex gap-3 text-body text-bone-70">
                            <span
                              aria-hidden
                              className="mt-2.5 size-1 shrink-0 rounded-full bg-copper"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 font-mono text-[0.75rem] text-bone-52">
                        {role.technologies.join(" · ")}
                      </p>
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
