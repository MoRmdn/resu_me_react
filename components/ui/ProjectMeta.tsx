import { ButtonLink } from "./Button";
import { QuietTag } from "./Tag";
import { projectsCopy } from "@/content/copy";
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
export function ApplicationId({ id, className }: { id: string; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-bone-52">{projectsCopy.bundleIdLabel}</p>
      <p className="mt-2 font-mono text-[0.8125rem] break-all text-bone">{id}</p>
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
  project,
  placement,
  buttons,
}: {
  project: Project;
  placement: ProjectPlacement;
  buttons?: boolean;
}) {
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

  const ListingLink = buttons ? ExternalButton : ExternalLink;

  const listing = (
    href: string,
    label: string,
    link_type: EventParams<"project_link_click">["link_type"],
  ) => (
    <ListingLink
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
  href,
  label,
  track,
}: {
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
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function ExternalButton({
  href,
  label,
  track,
}: {
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
      <span className="sr-only">(opens in a new tab)</span>
    </ButtonLink>
  );
}
