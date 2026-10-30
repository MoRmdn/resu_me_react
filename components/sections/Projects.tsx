import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { IconTile } from "@/components/ui/IconTile";
import { ProjectPlate, ScreenStrip } from "@/components/ui/ProjectPlate";
import {
  ApplicationId,
  HighlightList,
  ProjectLinks,
  TechList,
} from "@/components/ui/ProjectMeta";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { featuredProjects, galleryProjects, orderedProjects } from "@/content/projects";
import { projectsCopy } from "@/content/copy";
import type { Project } from "@/content/types";
import { attentionAttrs, projectParams, swipeAttrs } from "@/lib/analytics/attrs";
import { cn } from "@/lib/cn";

export function Projects() {
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

      <div className="flex flex-col gap-3.5">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={i === 0 ? 0.06 : 0}>
            <FeaturedPanel project={project} index={i + 1} flip={i % 2 === 1} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 md:mt-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <p className="eyebrow text-bone-52">{projectsCopy.galleryEyebrow}</p>
            <h3 className="mt-5 text-h1">{projectsCopy.galleryHeadline}</h3>
          </div>
          <p className="eyebrow pb-1.5 text-bone-52">
            {projectsCopy.galleryNote(galleryProjects.length)}
          </p>
        </div>
      </Reveal>

      <ProjectGallery projects={galleryProjects} />
    </Section>
  );
}

/**
 * A project at full size. Always open: these four are the argument, so nothing
 * on them sits behind a click. The art alternates sides so a run of four does
 * not read as a template, and the 5/7 split is the system's own asymmetry
 * rather than a centred box.
 *
 * A private project keeps its own marks inside the same layout: the frame is
 * dashed and the card carries zero copper at any tier, because copper marks the
 * reachable and nothing here is reachable. A ledger stands in for the outcome.
 */
function FeaturedPanel({
  project,
  index,
  flip,
}: {
  project: Project;
  index: number;
  flip: boolean;
}) {
  const media = project.media;
  const params = projectParams(project, "featured");
  const plateClass = cn(
    "order-first border-line",
    flip ? "lg:border-r" : "lg:order-none lg:border-l",
  );

  return (
    <article
      id={project.slug}
      className={cn(
        "feature-panel relative grid scroll-mt-24 overflow-hidden rounded-lg",
        flip ? "lg:grid-cols-[7fr_5fr]" : "lg:grid-cols-[5fr_7fr]",
        project.isPrivate
          ? "bg-ink-800"
          : "bg-ink-700 elevation-card transition-colors duration-fast ease-fast hover:border-copper/35",
      )}
      {...attentionAttrs("project", params)}
    >
      {project.isPrivate && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full" preserveAspectRatio="none">
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

      <div className="relative flex flex-col gap-6 p-7 md:p-9">
        <span aria-hidden className="eyebrow absolute top-7 right-7 text-bone-28 md:top-9 md:right-9">
          {String(index).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-4 pr-8">
          {media?.icon && <IconTile icon={media.icon} title={project.title} size={72} />}
          <div className="flex flex-col gap-2.5">
            <p className="eyebrow leading-normal text-bone-52">
              {project.country} &middot; {project.category}
            </p>
            <h3 className="text-h1">{project.title}</h3>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="max-w-[62ch] text-body-l text-bone">{project.description}</p>
          <p className="max-w-[62ch] text-body text-bone-70">{project.longDescription}</p>
        </div>

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
        ) : (
          <div className="border-t border-line pt-5">
            <p className="eyebrow text-bone-52">{projectsCopy.outcomeLabel}</p>
            <p className="mt-2.5 text-h3 text-bone">{project.achievement}</p>
          </div>
        )}

        <TechList technologies={project.technologies} />

        {project.bundleId && <ApplicationId id={project.bundleId} />}

        <div className="mt-auto pt-2">
          <ProjectLinks project={project} placement="featured" buttons />
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

      {project.highlights && (
        <div className="border-t border-line px-7 py-3 md:px-9 lg:col-span-2">
          <HighlightList
            highlights={project.highlights}
            className="border-t-0 lg:grid lg:grid-cols-2 lg:gap-x-12"
          />
        </div>
      )}
    </article>
  );
}
