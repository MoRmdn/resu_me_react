import type { LocaleProps } from "@/content/locale";
import { getCopy } from "@/content/copy-i18n";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
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
      <Reveal>
        <SectionHeader
          eyebrow={projectsCopy.eyebrow}
          headline={projectsCopy.headline}
          note={projectsCopy.countLabel(orderedProjects.length)}
          className="mb-10"
          headingClassName="max-w-[800px]"
        />
      </Reveal>

      {firstFeatured && (
        <Reveal delay={0.06}>
          <FeaturedPanel locale={locale} project={firstFeatured} index={1} flip={false} />
        </Reveal>
      )}

      {/* Lead with the work itself; client evidence supports the first project
          rather than occupying the section's entire opening viewport. */}
      <Testimonials locale={locale} />

      <div className="flex flex-col gap-3.5">
        {remainingFeatured.map((project, i) => {
          const index = i + 1;
          return (
            <Reveal key={project.slug}>
              <FeaturedPanel
                locale={locale}
                project={project}
                index={index + 1}
                flip={index % 2 === 1}
              />
            </Reveal>
          );
        })}
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

      <ProjectGallery locale={locale} projects={galleryProjects} />
    </Section>
  );
}
