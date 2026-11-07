import { ButtonLink } from "./Button";
import { QuietTag } from "./Tag";
import { getCopy, ui } from "@/content/copy-i18n";
import type { Locale, LocaleProps } from "@/content/locale";
import type { Project } from "@/content/types";
import { projectParams, trackAttrs, type TrackAttrs } from "@/lib/analytics/attrs";
import type { EventParams, ProjectPlacement } from "@/lib/analytics/catalog";
import { cn } from "@/lib/cn";

/** Numbered detail bullets. The numerals are decoration, so bone-28 is fine. */
export function HighlightList({
  highlights,
  className,
}: {
  highlights: string[];
  className?: string;
}) {
  return (
    <ol className={cn("border-t border-line", className)}>
      {highlights.map((h, n) => (
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
  );
}

export function TechList({
  technologies,
  className,
}: {
  technologies: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {technologies.map((tech) => (
        <li key={tech}>
          <QuietTag>{tech}</QuietTag>
        </li>
      ))}
    </ul>
  );
}

/** Visible text, not only structured data: a literal identifier search is
    matched against the served HTML. */
export function ApplicationId({
  id,
  className,
  locale = "en",
}: { id: string; className?: string } & LocaleProps) {
  const { projectsCopy } = getCopy(locale);
  return (
    <div className={className}>
      <p className="eyebrow text-bone-52">{projectsCopy.bundleIdLabel}</p>
      <p className="mt-2 font-mono text-[0.8125rem] break-all text-bone" dir="ltr">
        {id}
      </p>
    </div>
  );
}

/**
 * What sits behind a click: the long story beside the build facts, shared by a
 * gallery plane and a featured panel. `onFace` is for a surface that already
 * carries the description and the outcome. `children` ends the facts column.
 */
export function ProjectDetail({
  locale = "en",
  project,
  onFace,
  className,
  children,
}: {
  locale?: Locale;
  project: Project;
  onFace?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const { projectsCopy } = getCopy(locale);
  return (
    <div className={cn("grid gap-x-12 gap-y-8 lg:grid-cols-[7fr_5fr]", className)}>
      <div>
        {!onFace && <p className="max-w-[62ch] text-body-l text-bone">{project.description}</p>}
        {!project.story && (
          <p className={cn("max-w-[62ch] text-body text-bone-70", !onFace && "mt-4")}>
            {project.longDescription}
          </p>
        )}
        {project.story && (
          <div className="mt-6 space-y-5">
            <div>
              <h4 className="text-caption font-medium text-bone-52">{projectsCopy.storyLabels.problem}</h4>
              <p className="mt-2 text-body text-bone-70">{project.story.problem}</p>
            </div>
            <div>
              <h4 className="text-caption font-medium text-bone-52">{projectsCopy.storyLabels.responsibility}</h4>
              <p className="mt-2 text-body text-bone-70">{project.story.responsibility}</p>
            </div>
            <div>
              <h4 className="text-caption font-medium text-bone-52">{projectsCopy.storyLabels.decisions}</h4>
              <HighlightList highlights={project.story.decisions} className="mt-2" />
            </div>
            <div>
              <h4 className="text-caption font-medium text-bone-52">{projectsCopy.storyLabels.result}</h4>
              <p className="mt-2 text-body text-bone">{project.story.result}</p>
            </div>
          </div>
        )}
        {!project.story && project.highlights && (
          <HighlightList highlights={project.highlights} className="mt-6" />
        )}
      </div>

      <div className="flex flex-col gap-6 border-t border-line pt-6 lg:border-t-0 lg:border-s lg:pt-0 lg:ps-12">
        {!onFace && (
          <div>
            <p className="eyebrow text-bone-52">{projectsCopy.outcomeLabel}</p>
            <p className="mt-2.5 text-body text-bone">{project.achievement}</p>
          </div>
        )}

        <div>
          <p className="eyebrow mb-3 text-bone-52">{projectsCopy.builtWithLabel}</p>
          <TechList technologies={project.technologies} />
        </div>

        {project.bundleId && <ApplicationId locale={locale} id={project.bundleId} />}

        {children}
      </div>
    </div>
  );
}

/**
 * Four link shapes: a store pair, a live site with source, a private delivery,
 * and "not listed yet". The last two render an explicit status rather than an
 * empty row, so a card with nothing to click still reads as deliberate.
 *
 * `buttons` is the featured-panel treatment; a gallery plane keeps text links.
 */
export function ProjectLinks({
  locale = "en",
  project,
  placement,
  buttons,
}: {
  locale?: Locale;
  project: Project;
  placement: ProjectPlacement;
  buttons?: boolean;
}) {
  const { projectsCopy } = getCopy(locale);
  const { appStore, playStore, website, github } = project.links;

  const ListingLink = buttons ? ExternalButton : ExternalLink;

  const listing = (
    href: string,
    label: string,
    link_type: EventParams<"project_link_click">["link_type"],
  ) => (
    <ListingLink
      locale={locale}
      href={href}
      label={label}
      track={trackAttrs("project_link_click", {
        ...projectParams(project, placement),
        link_type,
        link_text: label,
        link_url: href,
      })}
    />
  );

  return (
    <div className={cn("flex flex-wrap", buttons ? "gap-3" : "gap-x-5 gap-y-2")}>
      {website && listing(website, projectsCopy.websiteLabel, "website")}
      {github && listing(github, projectsCopy.sourceLabel, "source")}
      {appStore && listing(appStore, projectsCopy.appStoreLabel, "app_store")}
      {playStore && listing(playStore, projectsCopy.playStoreLabel, "play_store")}
    </div>
  );
}

function ExternalLink({
  locale = "en",
  href,
  label,
  track,
}: {
  locale?: Locale;
  href: string;
  label: string;
  track: TrackAttrs;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex min-h-11 items-center gap-1.5 text-[0.84375rem] text-bone-70 transition-colors duration-fast ease-fast hover:text-copper"
      {...track}
    >
      {label} <span aria-hidden>&#8599;</span>
      <span className="sr-only">{ui[locale].external}</span>
    </a>
  );
}

function ExternalButton({
  locale = "en",
  href,
  label,
  track,
}: {
  locale?: Locale;
  href: string;
  label: string;
  track: TrackAttrs;
}) {
  return (
    <ButtonLink
      href={href}
      variant="ghost"
      external
      track={track}
      className="px-5 py-2.5 text-[0.875rem]"
    >
      {label} <span aria-hidden>&#8599;</span>
      <span className="sr-only">{ui[locale].external}</span>
    </ButtonLink>
  );
}
