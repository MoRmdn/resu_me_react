"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { flagshipProject, projectRows, privateProjects } from "@/content/projects";
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
          note={`0${projectRows.length + privateProjects.length + 1} shipped`}
          className="mb-14"
        />
      </Reveal>

      <Reveal delay={0.06}>
        <Flagship project={flagshipProject} />
      </Reveal>

      <div className="mt-3.5 flex flex-col gap-3.5">
        {projectRows.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.2)}>
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

      {privateProjects.map((project) => (
        <Reveal key={project.slug} delay={0.08}>
          <PrivatePlane project={project} />
        </Reveal>
      ))}
    </Section>
  );
}

function Flagship({ project }: { project: Project }) {
  return (
    <article className="grid overflow-hidden rounded-lg bg-ink-700 elevation-card lg:grid-cols-[8fr_4fr]">
      <div className="flex flex-col gap-6 p-8 md:p-11">
        <p className="flex flex-wrap items-center gap-3">
          <span className="eyebrow rounded-sm bg-copper-wash px-2.5 py-1.5 text-copper">
            {projectsCopy.flagshipLabel}
          </span>
          <span className="eyebrow text-bone-52">
            {project.country} &middot; {project.category}
          </span>
        </p>

        <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
          {project.title}
        </h3>
        <p className="max-w-[52ch] text-[1rem] leading-relaxed text-bone-70">
          {project.longDescription}
        </p>

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

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5.5">
          <p className="flex-1 font-mono text-[0.78125rem] text-bone-52">
            {project.achievement}
          </p>
          <ProjectLinks project={project} />
        </div>
      </div>

      {project.image && (
        <div className="relative min-h-[380px] overflow-hidden border-line bg-ink-800 lg:min-h-[580px] lg:border-l">
          <picture>
            <source
              type="image/avif"
              srcSet={`/images/${project.image.slug}/${project.image.slug}-480.avif 480w, /images/${project.image.slug}/${project.image.slug}-800.avif 800w`}
              sizes="230px"
            />
            <img
              src={`/images/${project.image.slug}/${project.image.slug}-480.webp`}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              loading="lazy"
              decoding="async"
              className="absolute top-11 left-1/2 w-[230px] -translate-x-1/2 rounded-xl border border-line-strong"
            />
          </picture>
        </div>
      )}
    </article>
  );
}

/**
 * The signature moment. Clicking a row does not navigate, modal or crossfade:
 * in one 320ms base curve the card returns from its indent, scales to 1.012,
 * lifts onto e3 and unfolds its detail plane, while its siblings drop to 38%
 * and 0.985 so the page recedes and one plane comes forward.
 *
 * The transform and the panel height are both driven from CSS (`.proj-card`,
 * `.collapse`), which is what lets a second click hand state over mid-flight
 * without snapping.
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
      data-open={isOpen}
      data-dimmed={isDimmed}
      className={cn(
        "proj-card rounded-lg border",
        isOpen
          ? "border-copper/35 bg-ink-600 shadow-[0_24px_60px_rgb(0_0_0/0.6)]"
          : "border-line bg-ink-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.03)]",
      )}
      style={{ "--proj-indent": `${indent}px` } as React.CSSProperties}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="grid w-full grid-cols-1 items-center gap-x-8 gap-y-3 p-7 text-left md:grid-cols-[1fr_300px_150px] md:p-9"
        >
          <span className="flex flex-wrap items-baseline gap-x-4.5 gap-y-1">
            <span aria-hidden className="font-mono text-[0.75rem] text-bone-28">
              {String(index).padStart(2, "0")}
            </span>
            <span className="text-[clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-semibold tracking-[-0.02em]">
              {project.title}
            </span>
            <span className="eyebrow text-bone-52">{project.country}</span>
          </span>

          <span className="text-caption text-bone-52">{project.achievement}</span>

          <span
            className={cn(
              "eyebrow text-left md:text-right",
              isOpen ? "text-copper" : "text-bone-52",
            )}
          >
            {isOpen ? `${projectsCopy.closeLabel} ↑` : `${projectsCopy.openLabel} ↓`}
          </span>
        </button>
      </h3>

      <div id={panelId} className="collapse" data-open={isOpen} inert={!isOpen}>
        <div>
          <div className="grid gap-8 px-7 pb-8 md:px-9 lg:grid-cols-[7fr_5fr] lg:gap-14">
            <div>
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
            </div>

            <div className="flex flex-col gap-5 border-line lg:border-l lg:pl-8">
              <div>
                <p className="eyebrow text-bone-52">Category</p>
                <p className="mt-2 text-body text-bone">{project.category}</p>
              </div>
              <div>
                <p className="eyebrow text-bone-52">Built with</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="eyebrow rounded-sm border border-line px-2.5 py-1.5 text-bone-52"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <ProjectLinks project={project} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * AYCO. Carries no copper at any tier — copper marks the reachable, and
 * nothing on this card is reachable. The dashed perimeter is an SVG stroke
 * rather than a CSS border, because a border cannot be drawn on.
 */
function PrivatePlane({ project }: { project: Project }) {
  return (
    <article className="relative mt-3.5 rounded-lg bg-ink-800 p-9 md:p-10">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        preserveAspectRatio="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="99%"
          height="99%"
          rx="15.5"
          fill="none"
          stroke="rgb(242 238 231 / 0.20)"
          strokeDasharray="6 6"
          className="perimeter"
        />
      </svg>

      <div className="relative grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
        <div>
          <p className="flex items-center gap-3">
            <span aria-hidden className="size-2 rotate-45 border border-bone-28" />
            <span className="eyebrow text-bone-52">{projectsCopy.privateLabel}</span>
          </p>
          <h3 className="mt-5 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-semibold tracking-[-0.02em]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[62ch] text-body text-bone-70">
            {project.longDescription}
          </p>
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
        </div>

        <div className="border-line lg:border-l lg:pl-8">
          <p className="eyebrow text-bone-52">Build ledger</p>
          <dl className="mt-4 flex gap-8 border-b border-line pb-5">
            {[
              { v: "227", l: "Dart files" },
              { v: "109", l: "test files" },
              { v: "5", l: "Cloud Functions" },
            ].map((s) => (
              <div key={s.l}>
                <dd className="text-[1.875rem] leading-none font-semibold tabular">{s.v}</dd>
                <dt className="mt-2 text-caption text-bone-52">{s.l}</dt>
              </div>
            ))}
          </dl>
          {project.highlights && (
            <ol className="mt-1">
              {project.highlights.map((h, n) => (
                <li
                  key={h}
                  className="grid grid-cols-[34px_1fr] gap-3 border-b border-line py-3.5 text-caption text-bone-70"
                >
                  <span aria-hidden className="font-mono text-bone-28">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-5 text-caption text-bone-52">
            No store links — deliberate. Delivered under NDA.
          </p>
        </div>
      </div>
    </article>
  );
}

/** Three link shapes: store pair, live site + source, or nothing at all. */
function ProjectLinks({ project }: { project: Project }) {
  const { appStore, playStore, website, github } = project.links;
  if (!appStore && !playStore && !website && !github) return null;

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
