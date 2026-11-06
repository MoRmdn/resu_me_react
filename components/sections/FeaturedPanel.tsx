"use client";

import { useState } from "react";
import { IconTile } from "@/components/ui/IconTile";
import { ProjectPlate, ScreenStrip } from "@/components/ui/ProjectPlate";
import { ProjectDetail, ProjectLinks } from "@/components/ui/ProjectMeta";
import { getCopy } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import type { Project } from "@/content/types";
import { attentionAttrs, projectParams, swipeAttrs, trackAttrs } from "@/lib/analytics/attrs";
import { track } from "@/lib/analytics/gtag";
import { cn } from "@/lib/cn";
import { useKeepInView } from "@/lib/useKeepInView";

const panelId = (slug: string) => `proj-panel-${slug}`;
const toggleId = (slug: string) => `proj-toggle-${slug}`;

/**
 * A project at full width, closed to its face: the art, the one-line pitch, the
 * outcome and the way out to the stores. The art alternates sides so a run of
 * four does not read as a template, and the 5/7 split is the system's own
 * asymmetry rather than a centred box.
 *
 * The rest unfolds under the face, in place. It stays in the DOM, `inert` when
 * closed, because that is what keeps the copy, the highlights and the
 * application ID in the served HTML. Panels open independently: closing one
 * above the reader on their behalf would pull the page out from under them.
 *
 * A private project keeps its own marks inside the same layout: the frame is
 * dashed and the card carries zero copper at any tier, because copper marks the
 * reachable and nothing here is reachable. A ledger stands in for the outcome.
 */
export function FeaturedPanel({
  locale = "en",
  project,
  index,
  flip,
}: {
  locale?: Locale;
  project: Project;
  index: number;
  flip: boolean;
}) {
  const { projectsCopy } = getCopy(locale);
  const [isOpen, setIsOpen] = useState(false);
  useKeepInView(isOpen ? panelId(project.slug) : null);

  const media = project.media;
  const params = projectParams(project, "featured");
  const plateClass = cn(
    // Below `sm` the strip scrolls, so it has to sit above the stretched toggle.
    "relative z-10 order-first border-line sm:z-auto",
    flip ? "md:border-e" : "md:order-none md:border-s",
  );

  function close() {
    setIsOpen(false);
    // Focus would otherwise drop to <body> when the detail goes inert.
    document.getElementById(toggleId(project.slug))?.focus({ preventScroll: true });
  }

  return (
    <article
      id={project.slug}
      data-open={isOpen}
      className={cn(
        "feature-panel relative scroll-mt-24 overflow-hidden rounded-lg",
        project.isPrivate
          ? "bg-ink-800"
          : "bg-ink-700 elevation-card transition-colors duration-fast ease-fast hover:border-copper/35",
        isOpen && !project.isPrivate && "border-copper/35",
      )}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !isOpen) return;
        track("project_toggle", { ...params, toggle_action: "close", toggle_method: "escape" });
        close();
      }}
      {...attentionAttrs("project", params)}
    >
      {project.isPrivate && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 size-full"
          preserveAspectRatio="none"
        >
          <rect
            x="0.5"
            y="0.5"
            rx="15.5"
            fill="none"
            stroke="rgb(242 238 231 / 0.20)"
            strokeDasharray="6 6"
            className="perimeter"
          />
        </svg>
      )}

      <div
        className={cn(
          "group relative grid",
          flip ? "md:grid-cols-[7fr_5fr]" : "md:grid-cols-[5fr_7fr]",
        )}
      >
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <div className="flex items-center gap-4">
            {media?.icon && <IconTile icon={media.icon} title={project.title} size={64} />}
            <div className="flex flex-col gap-2 pt-0.5">
              <p className="eyebrow leading-normal text-bone-52">
                {project.country} &middot; {project.category}
              </p>
              <h3 className="text-h2">
                {/* Stretched over the whole face, so the name of the control is
                    the project and the art opens it too. */}
                <button
                  id={toggleId(project.slug)}
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-expanded={isOpen}
                  aria-controls={panelId(project.slug)}
                  className="cursor-pointer text-start after:absolute after:inset-0 after:content-['']"
                  {...trackAttrs("project_toggle", {
                    ...params,
                    toggle_action: isOpen ? "close" : "open",
                    toggle_method: "panel",
                  })}
                >
                  {project.title}
                </button>
              </h3>
            </div>
            <span aria-hidden className="eyebrow ms-auto self-start text-bone-28">
              {String(index).padStart(2, "0")}
            </span>
          </div>

          <p className="max-w-[62ch] text-body text-bone">{project.description}</p>

          <p className="eyebrow text-bone-52">{projectsCopy.availability[project.availability]}</p>
          <p className="text-h3 text-bone">{project.achievement}</p>
          {project.ledger ? (
            <dl className="hairline-grid grid-cols-3 overflow-hidden rounded-md border border-line">
              {project.ledger.map((entry) => (
                <div
                  key={entry.label}
                  className="flex flex-col-reverse justify-end gap-2 bg-ink-800 p-4"
                >
                  <dt className="text-caption text-bone-52">{entry.label}</dt>
                  <dd className="tabular font-mono text-h2 text-bone">{entry.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-1">
            <div className="relative z-10">
              <ProjectLinks locale={locale} project={project} placement="featured" buttons />
            </div>
            <span
              aria-hidden
              className="eyebrow ms-auto flex items-center gap-3 text-bone-52 transition-colors duration-fast ease-fast group-hover:text-bone"
            >
              {isOpen ? projectsCopy.closeLabel : projectsCopy.detailsLabel}
              <span className="gallery-tile__plus flex size-7 items-center justify-center rounded-sm border border-line bg-ink-700 text-base leading-none tracking-normal">
                +
              </span>
            </span>
          </div>
        </div>

        {media?.screens ? (
          <ScreenStrip
            screens={media.screens}
            label={projectsCopy.screensLabel(project.title)}
            swipe={swipeAttrs(params)}
            className={plateClass}
          />
        ) : (
          media && <ProjectPlate media={media} title={project.title} className={plateClass} />
        )}
      </div>

      <div id={panelId(project.slug)} className="disclosure" data-open={isOpen} inert={!isOpen}>
        <div>
          <ProjectDetail
            locale={locale}
            project={project}
            onFace
            className="border-t border-line p-6 md:p-8"
          >
            <button
              type="button"
              onClick={close}
              className="eyebrow mt-auto inline-flex min-h-11 items-center self-start text-bone-52 transition-colors duration-fast ease-fast hover:text-bone"
              {...trackAttrs("project_toggle", {
                ...params,
                toggle_action: "close",
                toggle_method: "close_button",
              })}
            >
              {projectsCopy.closeLabel} &uarr;
            </button>
          </ProjectDetail>
        </div>
      </div>
    </article>
  );
}
