"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { IconTile } from "@/components/ui/IconTile";
import { ProjectPlate, SocialStrip, PLATE_CAPTION } from "@/components/ui/ProjectPlate";
import { flagshipProject, projectRows, orderedProjects } from "@/content/projects";
import { projectsCopy } from "@/content/copy";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

/** Closed cards sit at this indent on alternating rows; opening returns them to 0. */
const INDENT = 112;

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <Section id="projects" tone="ink-900" z={16} offset={-40}>
      <Reveal>
        <SectionHeader
          eyebrow={projectsCopy.eyebrow}
          headline={projectsCopy.headline}
          note={`${orderedProjects.length} shipped`}
          className="mb-14"
        />
      </Reveal>

      <Reveal delay={0.06}>
        <Flagship project={flagshipProject} />
      </Reveal>

      <div className="mt-3.5 flex flex-col gap-3.5">
        {projectRows.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.04, 0.2)}>
            <ProjectRow
              project={project}
              index={i + 2}
              indent={i % 2 ? INDENT : 0}
              isOpen={openSlug === project.slug}
              isDimmed={openSlug !== null && openSlug !== project.slug}
              onToggle={() =>
                setOpenSlug(openSlug === project.slug ? null : project.slug)
              }
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/**
 * The opening panel. AYCO holds it: the solo end-to-end build leads, and
 * because it is under NDA the frame is dashed and the card carries zero copper
 * at any tier — copper marks the reachable, and nothing here is reachable.
 */
function Flagship({ project }: { project: Project }) {
  const isPrivate = project.isPrivate;

  return (
    <article
      className={cn(
        "relative grid overflow-hidden rounded-lg",
        project.media && "lg:grid-cols-[8fr_4fr]",
        isPrivate ? "bg-ink-800" : "bg-ink-700 elevation-card",
      )}
    >
      {isPrivate && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" preserveAspectRatio="none">
          <rect
            x="0.5"
            y="0.5"
            width="99.6%"
            height="99.4%"
            rx="15.5"
            fill="none"
            stroke="rgb(242 238 231 / 0.20)"
            strokeDasharray="6 6"
            className="perimeter"
          />
        </svg>
      )}

      <div className="relative flex flex-col gap-6 p-8 md:p-11">
        <div className="flex items-start gap-5">
          {project.media?.icon && (
            <IconTile icon={project.media.icon} title={project.title} />
          )}
          <div className="flex flex-col gap-2.5 pt-1">
            <p className="eyebrow text-bone-52">
              {project.country} &middot; {project.category}
            </p>
            <h3 className="text-[clamp(1.625rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
              {project.title}
            </h3>
          </div>
        </div>

        <p className="max-w-[62ch] text-[1rem] leading-relaxed text-bone-70">
          {project.longDescription}
        </p>

        {project.highlights && (
          <ol className="border-t border-line">
            {project.highlights.map((h, n) => (
              <li
                key={h}
                className="grid grid-cols-[34px_1fr] gap-3 border-b border-line py-3.5 text-caption text-bone-70 last:border-b-0"
              >
                <span aria-hidden className="font-mono text-bone-28">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
        )}

        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="eyebrow rounded-sm border border-line px-2.5 py-1.5 text-bone-52"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <p className="flex-1 font-mono text-[0.78125rem] text-bone-52">
            {project.achievement}
          </p>
          <ProjectLinks project={project} />
        </div>
      </div>

      {project.media && (
        <ProjectPlate
          media={project.media}
          title={project.title}
          className="border-line lg:border-l"
        />
      )}
    </article>
  );
}

/**
 * The signature moment. Clicking a row does not navigate, modal or crossfade:
 * in one 320ms base curve the card returns from its indent, scales to 1.012,
 * lifts onto e3 and unfolds its detail plane, while its siblings drop to 38%
 * and 0.985 so the page recedes and one plane comes forward.
 */
function ProjectRow({
  project,
  index,
  indent,
  isOpen,
  isDimmed,
  onToggle,
}: {
  project: Project;
  index: number;
  indent: number;
  isOpen: boolean;
  isDimmed: boolean;
  onToggle: () => void;
}) {
  const panelId = `proj-panel-${project.slug}`;

  return (
    <article
      id={project.slug}
      data-open={isOpen}
      data-dimmed={isDimmed}
      className={cn(
        "proj-card overflow-hidden rounded-lg border",
        isOpen
          ? "border-copper/35 bg-ink-600 shadow-[0_24px_60px_rgb(0_0_0/0.6)]"
          : "border-line bg-ink-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.03)]",
      )}
      style={{ "--proj-indent": `${indent}px` } as React.CSSProperties}
    >
      <div className={cn("grid", project.media && "lg:grid-cols-[7fr_5fr]")}>
        <div className="flex flex-col">
          <h3>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-start gap-5 p-7 text-left md:p-9"
            >
              {project.media?.icon ? (
                <IconTile icon={project.media.icon} title={project.title} size={64} />
              ) : (
                <span
                  aria-hidden
                  className="eyebrow shrink-0 pt-1.5 text-bone-28"
                >
                  {String(index).padStart(2, "0")}
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-bone-52">
                  {project.country} &middot; {project.category}
                </span>
                <span className="mt-2 block text-[clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-semibold tracking-[-0.02em]">
                  {project.title}
                </span>
                <span className="mt-2.5 block text-body text-bone-70">
                  {project.description}
                </span>
              </span>

              <span
                className={cn(
                  "eyebrow shrink-0 pt-1.5 text-right",
                  isOpen ? "text-copper" : "text-bone-52",
                )}
              >
                {isOpen ? `${projectsCopy.closeLabel} ↑` : `${projectsCopy.openLabel} ↓`}
              </span>
            </button>
          </h3>

          <div id={panelId} className="disclosure" data-open={isOpen} inert={!isOpen}>
            <div>
              <div className="px-7 pb-8 md:px-9">
                <p className="max-w-[62ch] text-body text-bone-70">
                  {project.longDescription}
                </p>

                {project.highlights && (
                  <ol className="mt-6 border-t border-line">
                    {project.highlights.map((h, n) => (
                      <li
                        key={h}
                        className="grid grid-cols-[34px_1fr] gap-3 border-b border-line py-3.5 text-caption text-bone-70 last:border-b-0"
                      >
                        <span aria-hidden className="font-mono text-bone-28">
                          {String(n + 1).padStart(2, "0")}
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ol>
                )}

                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="eyebrow rounded-sm border border-line px-2.5 py-1.5 text-bone-52"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {project.bundleId && (
                  <div className="mt-6">
                    <p className="eyebrow text-bone-52">{projectsCopy.bundleIdLabel}</p>
                    {/* Visible text, not only structured data: a literal
                        identifier search is matched against the served HTML. */}
                    <p className="mt-2 font-mono text-[0.8125rem] break-all text-bone">
                      {project.bundleId}
                    </p>
                  </div>
                )}

                {project.media?.social && (
                  <div className="mt-7">
                    <p className="eyebrow mb-3 text-bone-52">{projectsCopy.socialLabel}</p>
                    <SocialStrip social={project.media.social} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line px-7 py-5 md:px-9">
            {project.media ? (
              <div>
                {/* bone-52, not the artboard's bone-28: this labels information,
                    and bone-28 sits below the 4.5:1 contrast floor. */}
                <p className="eyebrow text-bone-52">{projectsCopy.plateLabel}</p>
                <p className="mt-1.5 text-[0.8125rem] font-medium text-bone">
                  {PLATE_CAPTION[project.media.plate]}
                </p>
              </div>
            ) : (
              <span />
            )}
            <ProjectLinks project={project} />
          </div>
        </div>

        {project.media && (
          <ProjectPlate
            media={project.media}
            title={project.title}
            className="order-first border-line lg:order-none lg:border-l"
          />
        )}
      </div>
    </article>
  );
}

/**
 * Four link shapes: a store pair, a live site with source, a private delivery,
 * and "not listed yet". The last two render an explicit status rather than an
 * empty row, so a card with nothing to click still reads as deliberate.
 */
function ProjectLinks({ project }: { project: Project }) {
  const { appStore, playStore, website, github } = project.links;

  if (project.isPrivate) {
    return (
      <p className="eyebrow flex items-center gap-2.5 text-bone-52">
        <span aria-hidden className="size-2 rotate-45 border border-bone-28" />
        {projectsCopy.privateLabel}
      </p>
    );
  }

  if (!appStore && !playStore && !website && !github) {
    return project.linkStatus ? (
      <p className="eyebrow text-bone-52">{project.linkStatus}</p>
    ) : null;
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {website && <ExternalLink href={website} label={projectsCopy.websiteLabel} />}
      {github && <ExternalLink href={github} label={projectsCopy.sourceLabel} />}
      {appStore && <ExternalLink href={appStore} label={projectsCopy.appStoreLabel} />}
      {playStore && <ExternalLink href={playStore} label={projectsCopy.playStoreLabel} />}
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex min-h-11 items-center gap-1.5 text-[0.84375rem] text-bone-70 transition-colors duration-fast ease-fast hover:text-copper"
    >
      {label} <span aria-hidden>&#8599;</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
