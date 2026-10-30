"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { IconTile } from "@/components/ui/IconTile";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { SocialStrip } from "@/components/ui/ProjectPlate";
import {
  ApplicationId,
  HighlightList,
  ProjectLinks,
  TechList,
} from "@/components/ui/ProjectMeta";
import { projectsCopy } from "@/content/copy";
import type { Project } from "@/content/types";
import { attentionAttrs, projectParams, trackAttrs } from "@/lib/analytics/attrs";
import { track } from "@/lib/analytics/gtag";
import { cn } from "@/lib/cn";

/** Slightly longer than the 320ms open, so the plane has its final height. */
const SETTLE_MS = 340;

const panelId = (slug: string) => `proj-panel-${slug}`;
const tileId = (slug: string) => `proj-tile-${slug}`;

/**
 * Everything that is not a featured panel, as a wall of art.
 *
 * The signature moment lives here now. Opening a tile does not navigate, modal
 * or crossfade: the tile lifts, its siblings recede, and a detail plane unfolds
 * under its row. Every plane stays in the DOM, `inert` when closed, because
 * that is what keeps the copy and the application IDs in the served HTML.
 *
 * The first tile spans two columns, which is what makes seven tiles fill both
 * the 2- and the 4-column grid exactly. A different count leaves a hole, so
 * move the span if the list changes.
 */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // A tile on the last visible row opens below the fold, which would look like
  // nothing happened. Waits for the plane to reach its height first.
  useEffect(() => {
    if (!openSlug) return;
    const timer = setTimeout(() => {
      document.getElementById(panelId(openSlug))?.scrollIntoView({ block: "nearest" });
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [openSlug]);

  function close(slug: string) {
    setOpenSlug(null);
    // Focus would otherwise drop to <body> when the plane goes inert.
    document.getElementById(tileId(slug))?.focus({ preventScroll: true });
  }

  return (
    <div
      className="grid grid-flow-dense grid-cols-2 gap-x-3.5 lg:grid-cols-4"
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !openSlug) return;
        const project = projects.find((p) => p.slug === openSlug);
        if (project) {
          track("project_toggle", {
            ...projectParams(project, "gallery"),
            toggle_action: "close",
            toggle_method: "escape",
          });
        }
        close(openSlug);
      }}
    >
      {projects.map((project, i) => (
        <GalleryItem
          key={project.slug}
          project={project}
          wide={i === 0}
          delay={Math.min(i * 0.04, 0.2)}
          isOpen={openSlug === project.slug}
          isDimmed={openSlug !== null && openSlug !== project.slug}
          onToggle={() => setOpenSlug(openSlug === project.slug ? null : project.slug)}
          onClose={() => close(project.slug)}
        />
      ))}
    </div>
  );
}

function GalleryItem({
  project,
  wide,
  delay,
  isOpen,
  isDimmed,
  onToggle,
  onClose,
}: {
  project: Project;
  wide: boolean;
  delay: number;
  isOpen: boolean;
  isDimmed: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const asset = project.media?.asset;
  const icon = project.media?.icon;
  const params = projectParams(project, "gallery");

  return (
    <>
      <Reveal delay={delay} className={cn("pb-3.5", wide && "col-span-2")}>
        <article
          id={project.slug}
          data-open={isOpen}
          data-dimmed={isDimmed}
          className={cn(
            "gallery-tile relative flex h-full scroll-mt-24 overflow-hidden rounded-lg border",
            wide ? "min-h-56 flex-row" : "flex-col",
            isOpen
              ? "border-copper/35 bg-ink-600 shadow-[0_24px_60px_rgb(0_0_0/0.6)]"
              : "border-line bg-ink-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.03)]",
          )}
          {...attentionAttrs("project", params, { dwell: false })}
        >
          {/* Plate 04 rules for all of them: shown whole, never cropped, and the
              ink either side is correct rather than a gap to close. */}
          <div
            className={cn(
              "relative shrink-0 overflow-hidden bg-ink-800",
              wide ? "w-[44%] border-r border-line" : "aspect-[5/6] border-b border-line",
            )}
          >
            {asset ? (
              <ProjectImage
                file={asset.file}
                widths={[280, 560]}
                sizes="(min-width: 1040px) 170px, 40vw"
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                className={cn(
                  "absolute top-1/2 left-1/2 block h-[calc(100%-2rem)] w-auto max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-md object-contain",
                  asset.bezel !== false && "border border-line-strong",
                )}
              />
            ) : (
              // No art to seat: a monogram, so the plate reads as set rather
              // than as an image that failed to load.
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center font-mono text-[clamp(3.5rem,7vw,5.5rem)] tracking-[-0.04em] text-bone-18"
              >
                {project.title.slice(0, 2)}
              </span>
            )}
          </div>

          <span
            aria-hidden
            className="gallery-tile__plus absolute top-3 right-3 flex size-7 items-center justify-center rounded-sm border border-line bg-ink-700 text-bone-52"
          >
            +
          </span>

          <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
            <div className="flex items-center gap-3">
              {icon && (
                <IconTile
                  icon={icon}
                  title={project.title}
                  size={40}
                  className="hidden sm:flex"
                />
              )}
              <h4 className="text-h3">
                {/* Stretched over the whole tile, so the name of the control is
                    the project and not the alt text of its art. */}
                <button
                  id={tileId(project.slug)}
                  type="button"
                  onClick={onToggle}
                  aria-expanded={isOpen}
                  aria-controls={panelId(project.slug)}
                  className="text-left after:absolute after:inset-0 after:content-['']"
                  {...trackAttrs("project_toggle", {
                    ...params,
                    toggle_action: isOpen ? "close" : "open",
                    toggle_method: "tile",
                  })}
                >
                  {project.title}
                </button>
              </h4>
            </div>

            <p className="eyebrow leading-normal text-bone-52">
              {project.category} &middot; {project.country}
            </p>

            {wide && (
              <>
                <p className="hidden text-caption text-bone-70 sm:block">{project.description}</p>
                <p className="mt-auto hidden border-t border-line pt-3 font-mono text-[0.78125rem] text-bone-52 sm:block">
                  {project.achievement}
                </p>
              </>
            )}
          </div>
        </article>
      </Reveal>

      <div
        id={panelId(project.slug)}
        className="disclosure col-span-full"
        data-open={isOpen}
        inert={!isOpen}
        {...attentionAttrs("project", params)}
      >
        <div>
          <DetailPlane project={project} onTile={wide} onClose={onClose} />
        </div>
      </div>
    </>
  );
}

function DetailPlane({
  project,
  onTile,
  onClose,
}: {
  project: Project;
  /** The wide tile already carries the description and outcome on its face. */
  onTile: boolean;
  onClose: () => void;
}) {
  return (
    <div className="mb-3.5 rounded-lg border border-line bg-ink-700 p-6 md:p-9">
      <div className="flex items-start justify-between gap-4">
        <p className="text-h2">{project.title}</p>
        <button
          type="button"
          onClick={onClose}
          className="eyebrow inline-flex min-h-11 shrink-0 items-center text-bone-52 transition-colors duration-fast ease-fast hover:text-bone"
          {...trackAttrs("project_toggle", {
            ...projectParams(project, "gallery"),
            toggle_action: "close",
            toggle_method: "close_button",
          })}
        >
          {projectsCopy.closeLabel} &uarr;
        </button>
      </div>

      <div className="mt-4 grid gap-x-12 gap-y-8 lg:grid-cols-[7fr_5fr]">
        <div>
          {!onTile && <p className="max-w-[62ch] text-body-l text-bone">{project.description}</p>}
          <p className={cn("max-w-[62ch] text-body text-bone-70", !onTile && "mt-4")}>
            {project.longDescription}
          </p>
          {project.highlights && (
            <HighlightList highlights={project.highlights} className="mt-6" />
          )}
        </div>

        <div className="flex flex-col gap-6 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          {!onTile && (
            <div>
              <p className="eyebrow text-bone-52">{projectsCopy.outcomeLabel}</p>
              <p className="mt-2.5 text-body text-bone">{project.achievement}</p>
            </div>
          )}

          <div>
            <p className="eyebrow mb-3 text-bone-52">{projectsCopy.builtWithLabel}</p>
            <TechList technologies={project.technologies} />
          </div>

          {project.bundleId && <ApplicationId id={project.bundleId} />}

          <ProjectLinks project={project} placement="gallery" />
        </div>
      </div>

      {project.media?.social && (
        <div className="mt-8 border-t border-line pt-6">
          <p className="eyebrow mb-3 text-bone-52">{projectsCopy.socialLabel}</p>
          <div className="max-w-[640px]">
            <SocialStrip social={project.media.social} />
          </div>
        </div>
      )}
    </div>
  );
}
