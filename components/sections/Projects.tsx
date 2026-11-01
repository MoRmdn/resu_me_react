import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FeaturedPanel } from "@/components/sections/FeaturedPanel";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { featuredProjects, galleryProjects, orderedProjects } from "@/content/projects";
import { projectsCopy } from "@/content/copy";

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
