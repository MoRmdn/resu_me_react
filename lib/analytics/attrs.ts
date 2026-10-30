import type {
  EventName,
  EventParams,
  ExperienceParams,
  ProjectParams,
  ProjectPlacement,
} from "./catalog";
import type { Experience, Project } from "@/content/types";
import { projectNames } from "@/lib/projectNames";

/**
 * Tracking as data attributes, not handlers.
 *
 * Safe to call from a server component, which is the point: a click is read by
 * the one listener in listeners.ts, so tagging a link never makes a component a
 * client component and adds no JavaScript. Spread it onto the element:
 *
 *   <a href={url} {...trackAttrs("resume_download", { file_name })}>
 *
 * ESLint fails any <a> or <button> that does not do this.
 */
export type TrackAttrs = { "data-track": string; "data-track-params": string };

export function trackAttrs<E extends EventName>(name: E, params: EventParams<E>): TrackAttrs {
  return { "data-track": name, "data-track-params": JSON.stringify(params) };
}

export function projectParams(project: Project, placement: ProjectPlacement): ProjectParams {
  return {
    project_slug: project.slug,
    project_title: projectNames(project.title).name,
    project_placement: placement,
    project_category: project.category,
    project_country: project.country,
  };
}

export function experienceParams(role: Experience): ExperienceParams {
  return { experience_slug: role.slug, experience_company: projectNames(role.company).name };
}

/**
 * Marks something the dwell engine in attention.ts should time. `dwell: false`
 * counts it as seen but never times it: gallery tiles share the screen, so
 * viewport time cannot tell them apart. They use hover instead.
 */
export function attentionAttrs(
  kind: "project" | "experience",
  params: ProjectParams | ExperienceParams,
  { dwell = true }: { dwell?: boolean } = {},
) {
  return {
    "data-attention": kind,
    "data-attention-params": JSON.stringify(params),
    ...(dwell ? {} : { "data-attention-dwell": "off" }),
  };
}

/** Marks a sideways scroller, so its first swipe is reported once. */
export function swipeAttrs(params: ProjectParams) {
  return { "data-track-swipe": JSON.stringify(params) };
}
