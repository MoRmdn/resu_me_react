"use client";

import type { ExperienceParams, ProjectParams } from "./catalog";
import { setCurrentSection, track } from "./gtag";

/**
 * The dwell engine: what the visitor is actually stopped on.
 *
 * A one-second tick reads where things are, instead of an observer per element.
 * That is the whole design. A tick cannot go stale the way a long element's
 * intersection ratio does, a fast scroll naturally sees a project too briefly to
 * count, and it stops entirely when there is nothing to measure: on an idle
 * visitor and on a hidden tab.
 *
 * Only the most visible target of each kind counts, so the time reported across
 * projects can never add up to more than the time actually spent.
 */
const TICK_MS = 1000;
/** A throttled timer must not hand one tick a long stretch of unseen time. */
const MAX_TICK_MS = 2000;
/** With no input for this long, the visitor has stopped reading. */
const IDLE_MS = 30_000;
/** A stop this short is someone scrolling past. */
const MIN_STOP_MS = 2000;
const SECTION_VIEW_MS = 1000;

/** A target is seen once this much of it, or of the screen, is showing. */
const SEEN_SHARE = 0.5;
/** It holds the visitor's attention at either of these. */
const DWELL_SHARE = 0.6;
const DWELL_SCREEN_SHARE = 0.4;

const SCROLL_MILESTONES = [25, 50, 75, 100];

type Kind = "section" | "project" | "experience";
type Stop = { id: string; ms: number; params: Record<string, string> };
type Target = { id: string; params: Record<string, string>; visible: number };

const stops: Partial<Record<Kind, Stop>> = {};
const projectMs = new Map<string, { title: string; ms: number }>();
const sectionsSeen = new Set<string>();
const projectsSeen = new Set<string>();
/** Seen on the last tick and not reported yet: one tick is not a second yet. */
const projectsPending = new Set<string>();
const milestonesPassed = new Set<number>();

let timer: ReturnType<typeof setInterval> | null = null;
let lastInput = 0;
let lastTick = 0;
let activeMs = 0;
let maxScroll = 0;

function seconds(ms: number) {
  return Math.round(ms / 100) / 10;
}

function reportStop(kind: Kind, stop: Stop) {
  if (stop.ms < MIN_STOP_MS) return;
  const dwell_seconds = seconds(stop.ms);

  if (kind === "section") {
    track("section_dwell", { section_id: stop.id, dwell_seconds });
  } else if (kind === "project") {
    const params = stop.params as unknown as ProjectParams;
    const total = projectMs.get(stop.id)?.ms ?? 0;
    projectMs.set(stop.id, { title: params.project_title, ms: total + stop.ms });
    // Named here: by the time a stop ends, the visitor has usually moved on.
    track("project_dwell", { ...params, dwell_seconds, section_id: "projects" });
  } else {
    track("experience_dwell", {
      ...(stop.params as unknown as ExperienceParams),
      dwell_seconds,
      section_id: "experience",
    });
  }
}

function endStop(kind: Kind) {
  const stop = stops[kind];
  if (!stop) return;
  reportStop(kind, stop);
  delete stops[kind];
}

function endAllStops() {
  (Object.keys(stops) as Kind[]).forEach(endStop);
}

function updateStop(kind: Kind, next: Target | undefined, elapsed: number) {
  const stop = stops[kind];
  if (stop && stop.id === next?.id) {
    stop.ms += elapsed;
    return;
  }

  endStop(kind);
  if (next) stops[kind] = { id: next.id, params: next.params, ms: 0 };
}

/**
 * The section holding the middle of the screen. The last match wins because the
 * hero is sticky: it stays pinned behind the sheet, so it always matches too.
 */
function currentSection(): Target | undefined {
  const middle = window.innerHeight / 2;
  const match = [...document.querySelectorAll("section[id]")].findLast((section) => {
    const { top, bottom } = section.getBoundingClientRect();
    return top <= middle && bottom > middle;
  });
  if (!match) return undefined;
  return { id: match.id === "top" ? "hero" : match.id, params: {}, visible: 0 };
}

function measureSections(elapsed: number) {
  const section = currentSection();
  if (section) setCurrentSection(section.id);
  updateStop("section", section, elapsed);

  const stop = stops.section;
  if (stop && stop.ms >= SECTION_VIEW_MS && !sectionsSeen.has(stop.id)) {
    sectionsSeen.add(stop.id);
    track("section_view", { section_id: stop.id });
  }
}

function measureTargets(elapsed: number) {
  const screen = window.innerHeight;
  const best: Partial<Record<Kind, Target>> = {};
  const seenThisTick = new Set<string>();

  document.querySelectorAll<HTMLElement>("[data-attention]").forEach((el) => {
    const { top, bottom, height } = el.getBoundingClientRect();
    // A closed disclosure has no height, so a closed plane never registers.
    if (height < 1) return;

    const visible = Math.min(bottom, screen) - Math.max(top, 0);
    if (visible <= 0) return;

    const kind = el.dataset.attention as "project" | "experience";
    const params = JSON.parse(el.dataset.attentionParams ?? "{}") as Record<string, string>;
    const id = kind === "project" ? params.project_slug : params.experience_slug;
    const share = visible / Math.min(height, screen);

    if (kind === "project" && share >= SEEN_SHARE && !projectsSeen.has(id)) {
      if (projectsPending.has(id)) {
        projectsSeen.add(id);
        track("project_impression", {
          ...(params as unknown as ProjectParams),
          section_id: "projects",
        });
      }
      seenThisTick.add(id);
    }

    if (el.dataset.attentionDwell === "off") return;
    if (share < DWELL_SHARE && visible / screen < DWELL_SCREEN_SHARE) return;
    if (!best[kind] || visible > best[kind].visible) best[kind] = { id, params, visible };
  });

  projectsPending.clear();
  seenThisTick.forEach((id) => projectsPending.add(id));

  updateStop("project", best.project, elapsed);
  updateStop("experience", best.experience, elapsed);
}

function measureScroll() {
  const { scrollHeight } = document.documentElement;
  const percent = Math.min(
    100,
    Math.ceil(((window.scrollY + window.innerHeight) / scrollHeight) * 100),
  );
  maxScroll = Math.max(maxScroll, percent);

  for (const milestone of SCROLL_MILESTONES) {
    if (maxScroll < milestone || milestonesPassed.has(milestone)) continue;
    milestonesPassed.add(milestone);
    track("scroll_depth", { scroll_percent: milestone });
  }
}

function tick() {
  const now = performance.now();

  if (now - lastInput > IDLE_MS) {
    endAllStops();
    stopTimer();
    return;
  }

  const elapsed = Math.min(now - lastTick, MAX_TICK_MS);
  lastTick = now;
  activeMs += elapsed;

  measureSections(elapsed);
  measureTargets(elapsed);
  measureScroll();
}

function startTimer() {
  if (timer !== null) return;
  lastTick = performance.now();
  timer = setInterval(tick, TICK_MS);
  tick();
}

function stopTimer() {
  if (timer === null) return;
  clearInterval(timer);
  timer = null;
}

/** A timestamp and nothing else: this runs on every pointer move. */
function onInput() {
  lastInput = performance.now();
  if (timer === null && !document.hidden) startTimer();
}

function onVisibilityChange() {
  if (document.hidden) {
    endAllStops();
    stopTimer();
  } else {
    lastInput = performance.now();
    startTimer();
  }
}

let summarySent = false;

function sendSummary(clickCount: number) {
  if (summarySent) return;
  summarySent = true;

  const top = [...projectMs.values()].reduce<{ title: string; ms: number } | undefined>(
    (best, project) => (!best || project.ms > best.ms ? project : best),
    undefined,
  );

  track("visit_summary", {
    visit_seconds: seconds(activeMs),
    max_scroll_percent: maxScroll,
    sections_seen: sectionsSeen.size,
    projects_seen: projectsSeen.size,
    click_count: clickCount,
    top_project: top?.title,
  });
}

const INPUT_EVENTS = ["pointermove", "pointerdown", "keydown", "scroll", "wheel", "touchstart"];

/** Installs the engine. `clickCount` reads the listener's running total. */
export function startAttention(clickCount: () => number) {
  const onPageHide = () => {
    endAllStops();
    stopTimer();
    sendSummary(clickCount());
  };

  INPUT_EVENTS.forEach((name) =>
    window.addEventListener(name, onInput, { passive: true, capture: true }),
  );
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);

  lastInput = performance.now();
  if (!document.hidden) startTimer();

  return () => {
    INPUT_EVENTS.forEach((name) => window.removeEventListener(name, onInput, { capture: true }));
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
    stopTimer();
  };
}
