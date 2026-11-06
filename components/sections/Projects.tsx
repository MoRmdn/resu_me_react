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

      <Testimonials locale={locale} />
      <div className="flex flex-col gap-3.5">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.slug} delay={i === 0 ? 0.06 : 0}>
            <FeaturedPanel locale={locale} project={project} index={i + 1} flip={i % 2 === 1} />
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

      <ProjectGallery locale={locale} projects={galleryProjects} />
    </Section>
  );
}
