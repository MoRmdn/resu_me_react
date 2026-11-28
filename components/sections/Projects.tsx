import type { LocaleProps } from "@/content/locale";
import { getCopy } from "@/content/copy-i18n";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FeaturedPanel } from "@/components/sections/FeaturedPanel";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { getProjects } from "@/content/projects-i18n";
import { sectionNumber } from "@/content/site";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { selectedReviews } from "@/content/reviews";

export function Projects({ locale = "en" }: LocaleProps) {
  const { projectsCopy } = getCopy(locale);
  const { featuredProjects, galleryProjects, orderedProjects } = getProjects(locale);
  return (
    <Section id="projects" tone="ink-900">
      <SectionHeader
        index={sectionNumber("projects")}
        eyebrow={projectsCopy.eyebrow}
        headline={projectsCopy.headline}
        note={projectsCopy.countLabel(orderedProjects.length)}
        className="mb-10"
        headingClassName="max-w-[800px]"
      />

      <div className="flex flex-col gap-4">
        {featuredProjects.map((project, i) => (
          <FeaturedPanel
            key={project.slug}
            locale={locale}
            project={project}
            flip={i % 2 === 1}
            review={
              project.reviewId && (
                <ReviewCard review={selectedReviews([project.reviewId])[0]} locale={locale} />
              )
            }
          />
        ))}
      </div>

      <div className="mt-16 border-t border-line pt-5 md:mt-18">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h3 className="text-h2">{projectsCopy.galleryHeadline}</h3>
          <p className="text-caption text-bone-52">
            {projectsCopy.galleryNote(galleryProjects.length)}
          </p>
        </div>
      </div>

      <ProjectGallery locale={locale} projects={galleryProjects} />
    </Section>
  );
}
