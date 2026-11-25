import type { LocaleProps } from "@/content/locale";
import { getCopy } from "@/content/copy-i18n";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FeaturedPanel } from "@/components/sections/FeaturedPanel";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { getProjects } from "@/content/projects-i18n";
import { Testimonials } from "./SocialProof";

export function Projects({ locale = "en" }: LocaleProps) {
  const { projectsCopy } = getCopy(locale);
  const { featuredProjects, galleryProjects, orderedProjects } = getProjects(locale);
  const [firstFeatured, ...remainingFeatured] = featuredProjects;
  return (
    <Section id="projects" tone="ink-900" z={16} offset={-40}>
      <SectionHeader
        eyebrow={projectsCopy.eyebrow}
        headline={projectsCopy.headline}
        note={projectsCopy.countLabel(orderedProjects.length)}
        className="mb-10"
        headingClassName="max-w-[800px]"
      />

      {firstFeatured && (
        <FeaturedPanel locale={locale} project={firstFeatured} flip={false} />
      )}

      {/* Lead with the work itself; client evidence supports the first project
          rather than occupying the section's entire opening viewport. */}
      <Testimonials locale={locale} />

      <div className="flex flex-col gap-4">
        {remainingFeatured.map((project, i) => (
          <FeaturedPanel key={project.slug} locale={locale} project={project} flip={i % 2 === 0} />
        ))}
      </div>

      <div className="mt-20 md:mt-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h3 className="text-h1">{projectsCopy.galleryHeadline}</h3>
          <p className="eyebrow text-bone-52">
            {projectsCopy.galleryNote(galleryProjects.length)}
          </p>
        </div>
      </div>

      <ProjectGallery locale={locale} projects={galleryProjects} />
    </Section>
  );
}
