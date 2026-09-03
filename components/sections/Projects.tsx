import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { Tag, QuietTag } from "@/components/ui/Tag";
import { flagshipProject, otherProjects } from "@/content/projects";
import { projectsCopy } from "@/content/copy";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

export function Projects() {
  return (
    <Section id="projects" tone="ink-900">
      <Reveal>
        <Eyebrow>{projectsCopy.eyebrow}</Eyebrow>
        <h2 className="mt-6 text-h1">{projectsCopy.headline}</h2>
      </Reveal>

      <Reveal delay={0.06}>
        <Flagship project={flagshipProject} />
      </Reveal>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.2)} className="h-full">
            <Card project={project} index={i + 2} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const CARD =
  "group relative flex h-full flex-col rounded-lg bg-ink-700 p-7 elevation-card " +
  "transition-[transform,border-color,box-shadow] duration-[220ms] ease-base " +
  "hover:border-copper/36 hover:shadow-[0_14px_40px_rgb(0_0_0/0.45)]";

function Flagship({ project }: { project: Project }) {
  return (
    <article className={cn(CARD, "mt-12 gap-8 p-7 md:flex-row md:p-9")}>
      <div className="flex min-w-0 flex-1 flex-col md:basis-[58%]">
        <p className="eyebrow text-bone-52">
          <span className="text-copper">01</span> {projectsCopy.flagshipLabel} &middot;{" "}
          {project.technologies[1]} &middot; {project.country}
        </p>
        <h3 className="mt-5 text-h2">{project.title}</h3>
        <p className="mt-4 max-w-[52ch] text-body text-bone-70">{project.longDescription}</p>

        <p className="mt-6 font-mono text-[0.78125rem] text-bone-52">{project.achievement}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <QuietTag>{tech}</QuietTag>
            </li>
          ))}
        </ul>

        <StoreLinks project={project} className="mt-auto pt-8" />
      </div>

      {project.image && (
        <div className="relative h-[320px] shrink-0 overflow-hidden rounded-xl border border-line bg-ink-600 md:h-[420px] md:basis-[42%]">
          <picture>
            <source
              type="image/avif"
              srcSet={`/images/${project.image.slug}/${project.image.slug}-480.avif 480w, /images/${project.image.slug}/${project.image.slug}-800.avif 800w, /images/${project.image.slug}/${project.image.slug}-1200.avif 1200w`}
              sizes="(max-width: 900px) 90vw, 500px"
            />
            <source
              type="image/webp"
              srcSet={`/images/${project.image.slug}/${project.image.slug}-480.webp 480w, /images/${project.image.slug}/${project.image.slug}-800.webp 800w, /images/${project.image.slug}/${project.image.slug}-1200.webp 1200w`}
              sizes="(max-width: 900px) 90vw, 500px"
            />
            <img
              src={`/images/${project.image.slug}/${project.image.slug}-800.webp`}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top transition-transform duration-slow ease-base group-hover:scale-[1.03]"
            />
          </picture>
        </div>
      )}
    </article>
  );
}

function Card({ project, index }: { project: Project; index: number }) {
  return (
    <article className={cn(CARD, "hover:-translate-y-[3px]")}>
      <p className="eyebrow text-bone-52">
        {/* Decorative ordinal: below the contrast floor by design, so it is
            hidden from assistive tech rather than read out at 2.3:1. */}
        <span className="text-bone-28" aria-hidden>
          {String(index).padStart(2, "0")}
        </span>{" "}
        {project.technologies[1]} &middot; {project.country}
      </p>

      <h3 className="mt-4 text-[1.375rem] font-semibold tracking-[-0.025em]">{project.title}</h3>
      <p className="mt-3 text-body text-bone-70">{project.description}</p>

      {project.isPrivate && project.highlights && (
        <ul className="mt-5 flex flex-col gap-2.5 border-l border-line pl-4">
          {project.highlights.slice(0, 2).map((h) => (
            <li key={h} className="text-caption text-bone-52">
              {h}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 font-mono text-[0.75rem] text-bone-52">{project.achievement}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((tech) => (
          <li key={tech}>
            <QuietTag>{tech}</QuietTag>
          </li>
        ))}
      </ul>

      <StoreLinks project={project} className="mt-auto pt-7" />
    </article>
  );
}

/**
 * AYCO has no store links by design. Rather than leaving a gap that reads as a
 * broken card, it gets an explicit copper-wash tag saying why.
 */
function StoreLinks({ project, className }: { project: Project; className?: string }) {
  if (project.isPrivate) {
    return (
      <div className={className}>
        <Tag>{projectsCopy.privateLabel}</Tag>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {project.links.appStore && (
        <StoreLink href={project.links.appStore} label={projectsCopy.appStoreLabel} />
      )}
      {project.links.playStore && (
        <StoreLink href={project.links.playStore} label={projectsCopy.playStoreLabel} />
      )}
    </div>
  );
}

function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex min-h-11 items-center gap-1.5 text-[0.84375rem] text-bone-62 transition-colors duration-fast ease-fast hover:text-copper"
    >
      {label} <span aria-hidden>&#8599;</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
