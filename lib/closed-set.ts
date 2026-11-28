import { caseStudies } from "@/content/case-studies";
import { featuredProjects, projects } from "@/content/projects";
import { initialReviewIds, reviews } from "@/content/reviews";
import { services } from "@/content/services";

/**
 * The pages below the homepage are a closed set: every id one of them names
 * resolves to something that exists, and none of them is a dead end.
 *
 * Called from app/sitemap.ts, which every build renders, so a broken link
 * between pages fails `npm run build` instead of shipping as a block that
 * silently renders nothing.
 */
export function assertClosedSet() {
  const problems: string[] = [];
  const serviceIds = new Set<string>(services.map((s) => s.id));
  const studySlugs = new Set(caseStudies.map((c) => c.slug));
  const projectSlugs = new Set(projects.map((p) => p.slug));
  const reviewIds = new Set(reviews.map((r) => r.id));
  const reviewProjects = new Set(reviews.map((r) => r.project));

  for (const service of services) {
    const at = `service ${service.id}`;
    for (const id of service.related) {
      if (!serviceIds.has(id)) problems.push(`${at}: related service "${id}" has no page`);
      if (id === service.id) problems.push(`${at}: lists itself as related`);
    }
    for (const proof of service.proof) {
      if (proof.target !== "experience" && !projectSlugs.has(proof.target)) {
        problems.push(`${at}: proof "${proof.target}" is not a project`);
      }
    }
    for (const id of service.leadReviewIds ?? []) {
      if (!reviewIds.has(id)) problems.push(`${at}: lead review "${id}" does not exist`);
    }
    for (const name of service.reviewProjects ?? []) {
      if (!reviewProjects.has(name)) problems.push(`${at}: no review has the project "${name}"`);
    }
    // The onward links a visitor can follow to another page of the set.
    const onward = service.related.length + service.proof.filter((p) => studySlugs.has(p.target)).length;
    if (onward === 0) problems.push(`${at}: a dead end, with no related service and no case study in its proof`);
  }

  for (const study of caseStudies) {
    const at = `case study ${study.slug}`;
    if (!projectSlugs.has(study.slug)) problems.push(`${at}: is not a project`);
    for (const id of study.services) {
      if (!serviceIds.has(id)) problems.push(`${at}: service "${id}" has no page`);
    }
    for (const slug of study.related) {
      if (!studySlugs.has(slug)) problems.push(`${at}: related study "${slug}" does not exist`);
    }
    for (const id of study.reviewIds ?? []) {
      if (!reviewIds.has(id)) problems.push(`${at}: review "${id}" does not exist`);
    }
    if (study.services.length + study.related.length === 0) {
      problems.push(`${at}: a dead end, with no service and no related study`);
    }
  }

  const featured = new Set(featuredProjects.map((p) => p.slug));
  const claimed = new Map<string, string>();
  for (const project of projects) {
    const id = project.reviewId;
    if (!id) continue;
    const at = `project ${project.slug}`;
    if (!reviewIds.has(id)) problems.push(`${at}: review "${id}" does not exist`);
    if (!featured.has(project.slug)) {
      problems.push(`${at}: has a review but is not featured, so nothing would render it`);
    }
    if (initialReviewIds.includes(id)) {
      problems.push(`${at}: review "${id}" also opens the Reviews section`);
    }
    const other = claimed.get(id);
    if (other) problems.push(`${at}: review "${id}" is already used by project ${other}`);
    claimed.set(id, project.slug);
  }

  if (problems.length > 0) {
    throw new Error(`The pages are not a closed set:\n- ${problems.join("\n- ")}`);
  }
}
