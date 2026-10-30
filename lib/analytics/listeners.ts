"use client";

import type { EventName, ProjectParams } from "./catalog";
import { sendEvent, track, type Params } from "./gtag";

const HOVER_TILE_MS = 1000;
const HOVER_REVIEW_MS = 1500;
const MAX_ERRORS = 5;
const TEXT_LENGTH = 60;

const CONTROLS = "a, button, [role='button'], input, select, textarea, summary";
const TILE = "[data-attention-dwell='off']";
const REVIEW = ".review-card[data-review]";

let clicks = 0;
let errors = 0;
let landed = false;

const reported = new Set<string>();
let hovered: Element | null = null;
let hoverTimer: ReturnType<typeof setTimeout> | undefined;

/** Once per page load. Returns false the second time. */
function once(key: string) {
  if (reported.has(key)) return false;
  reported.add(key);
  return true;
}

function parse(json: string | undefined): Params {
  try {
    return JSON.parse(json ?? "{}") as Params;
  } catch {
    return {};
  }
}

export function sectionOf(el: Element) {
  if (el.closest("header, #mobile-nav")) return "navigation";
  if (el.closest("footer")) return "footer";
  const id = el.closest("section[id]")?.id;
  return id === "top" ? "hero" : id;
}

function projectOf(el: Element) {
  const project = el.closest<HTMLElement>("[data-attention='project']");
  return project ? parse(project.dataset.attentionParams) : {};
}

/** Never reads inside a review card: that text carries the reviewer's name. */
function textOf(el: Element) {
  if (el.closest(".review-card")) return "";
  const label = el.getAttribute("aria-label") ?? el.getAttribute("alt") ?? el.textContent ?? "";
  return label.trim().replace(/\s+/g, " ").slice(0, TEXT_LENGTH);
}

/**
 * Capture phase on `window`, for two reasons. It runs before React, so a control
 * whose attributes change on click is read as it was when it was clicked. And
 * nothing further down can stop the event reaching it.
 */
function onClick(event: MouseEvent) {
  if (event.type === "auxclick" && event.button !== 1) return;
  if (!(event.target instanceof Element)) return;
  const { target } = event;
  clicks += 1;

  const tagged = target.closest<HTMLElement>("[data-track]");
  if (tagged) {
    sendEvent(tagged.dataset.track as EventName, {
      ...parse(tagged.dataset.trackParams),
      section_id: sectionOf(tagged),
    });
    return;
  }

  const control = target.closest(CONTROLS);
  if (control) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics] untagged control. Add trackAttrs():", control);
    }
    sendEvent("ui_click", {
      element_tag: control.tagName.toLowerCase(),
      element_text: textOf(control),
      section_id: sectionOf(control),
    });
    return;
  }

  if (target === document.documentElement || target === document.body) return;

  sendEvent("content_click", {
    element_tag: target.tagName.toLowerCase(),
    element_text: textOf(target),
    section_id: sectionOf(target),
    ...projectOf(target),
  });
}

/** The length and where it happened. The copied text never leaves the page. */
function onCopy() {
  const selection = window.getSelection();
  const length = selection?.toString().length ?? 0;
  if (!selection?.anchorNode || length === 0) return;

  const { anchorNode } = selection;
  const el = anchorNode instanceof Element ? anchorNode : anchorNode.parentElement;
  if (!el) return;

  sendEvent("text_copy", {
    char_count: length,
    section_id: sectionOf(el),
    ...projectOf(el),
  });
}

/** `pointerover` fires on crossing an element, not on moving within one. */
function onPointerOver(event: PointerEvent) {
  if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;

  const el = event.target.closest(`${TILE}, ${REVIEW}`);
  if (el === hovered) return;

  clearTimeout(hoverTimer);
  hovered = el;
  if (!el) return;

  hoverTimer = setTimeout(() => reportHover(el), el.matches(REVIEW) ? HOVER_REVIEW_MS : HOVER_TILE_MS);
}

function reportHover(el: Element) {
  const { dataset } = el as HTMLElement;

  if (el.matches(REVIEW)) {
    const id = dataset.review ?? "";
    if (once(`review:${id}`)) {
      track("review_hover", {
        review_ref: reviewRef(id),
        platform_id: dataset.platform ?? "",
        section_id: sectionOf(el),
      });
    }
    return;
  }

  // An open tile is already being timed through its detail plane.
  if (dataset.open === "true") return;
  const params = parse(dataset.attentionParams);
  if (once(`tile:${params.project_slug}`)) {
    track("project_hover", { ...(params as unknown as ProjectParams), section_id: sectionOf(el) });
  }
}

/**
 * Review ids contain the reviewer's first name, so they stay on the page. This
 * is a stable hash: the same review always reports the same reference, and the
 * reference can be matched to a card without the name ever being sent.
 */
function reviewRef(id: string) {
  let hash = 5381;
  for (const char of id) hash = (Math.imul(hash, 33) ^ char.charCodeAt(0)) >>> 0;
  return `r${hash.toString(36)}`;
}

/** `scroll` does not bubble, so this listens in the capture phase. */
function onScroll(event: Event) {
  if (!(event.target instanceof HTMLElement)) return;
  const params = event.target.dataset.trackSwipe;
  if (!params) return;

  const project = parse(params) as unknown as ProjectParams;
  if (once(`swipe:${project.project_slug}`)) {
    track("project_screens_swipe", { ...project, section_id: sectionOf(event.target) });
  }
}

function reportError(message: string, source: string) {
  if (errors >= MAX_ERRORS) return;
  errors += 1;
  track("client_error", { error_message: message, error_source: source });
}

/** Other people's scripts report as "Script error." and are not ours to fix. */
function onError(event: ErrorEvent) {
  if (!event.filename?.startsWith(window.location.origin)) return;
  const file = event.filename.slice(window.location.origin.length);
  reportError(event.message, `${file}:${event.lineno}`);
}

function onRejection(event: PromiseRejectionEvent) {
  const { reason } = event;
  reportError(reason instanceof Error ? reason.message : String(reason), "unhandled promise");
}

function reportLanding() {
  const landing = window.location.hash.slice(1);
  if (landed || !landing) return;
  landed = true;
  track("deep_link_landing", { landing_hash: landing });
}

/** Installs every delegated listener. Rendered once by AnalyticsRoot. */
export function startListeners() {
  window.addEventListener("click", onClick, { capture: true });
  window.addEventListener("auxclick", onClick, { capture: true });
  document.addEventListener("copy", onCopy);
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);

  reportLanding();

  return () => {
    window.removeEventListener("click", onClick, { capture: true });
    window.removeEventListener("auxclick", onClick, { capture: true });
    document.removeEventListener("copy", onCopy);
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("scroll", onScroll, { capture: true });
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    clearTimeout(hoverTimer);
  };
}

export function clickCount() {
  return clicks;
}
