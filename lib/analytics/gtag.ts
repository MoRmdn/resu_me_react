"use client";

import { site } from "@/content/site";
import type { EventName, EventParams, UserProperty } from "./catalog";
import { SENTENCES } from "./sentences";

/**
 * The only file that talks to Google.
 *
 * gtag.js rather than the Firebase Analytics SDK: it reports to the same GA4
 * property without pulling Firebase in for it. It is requested after the `load`
 * event at browser idle, so it stays off the critical path, and anything tracked
 * before then waits in `dataLayer`.
 *
 * Only the live host sends anything. Localhost, preview channels and the
 * duplicate m0rmdn.web.app send nothing, so testing never pollutes the numbers.
 *
 * Query flags, all sticky for the browser or tab they are used in:
 *   ?analytics_debug=1    log every event to the console, on any host
 *   ?internal=1           tag this browser as the owner's (?internal=0 clears it)
 *   ?analytics_region=eu  behave as a visitor in a consent region (or =other)
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export type Params = Record<string, string | number | undefined>;
export type ConsentChoice = "accepted" | "declined";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const LIVE_HOST = new URL(site.url).hostname;

/** GA cuts a parameter value at 100 characters. */
const MAX_VALUE_LENGTH = 100;

const CONSENT_KEY = "analytics-consent";
const INTERNAL_KEY = "analytics-internal";
const DEBUG_KEY = "analytics-debug";
const REGION_KEY = "analytics-region";

/** The EEA, the UK and Switzerland, as ISO codes for Google's `region` default. */
const CONSENT_REGIONS = [
  "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR",
  "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "SE",
  "SI", "SK",
];

/** European territories whose time zones are not under `Europe/`. */
const EUROPEAN_ZONES = [
  "Arctic/Longyearbyen",
  "Atlantic/Azores",
  "Atlantic/Canary",
  "Atlantic/Faroe",
  "Atlantic/Madeira",
  "Atlantic/Reykjavik",
];

/** Nothing on the site is an advert, so these never change. */
const NO_ADS = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

/** Storage can be blocked outright, and a blocked read must never break a page. */
function read(storage: "localStorage" | "sessionStorage", key: string) {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
}

function write(storage: "localStorage" | "sessionStorage", key: string, value: string | null) {
  try {
    if (value === null) window[storage].removeItem(key);
    else window[storage].setItem(key, value);
  } catch {
    // Blocked storage only means the flag lasts for this page load.
  }
}

let flagsRead = false;
let debug = false;
let internal = false;

function readFlags() {
  if (flagsRead) return;
  flagsRead = true;

  const query = new URLSearchParams(window.location.search);
  if (query.has("internal")) {
    write("localStorage", INTERNAL_KEY, query.get("internal") === "1" ? "1" : null);
  }
  if (query.get("analytics_debug") === "1") write("sessionStorage", DEBUG_KEY, "1");
  if (query.has("analytics_region")) {
    write("sessionStorage", REGION_KEY, query.get("analytics_region"));
  }

  debug = read("sessionStorage", DEBUG_KEY) === "1";
  internal = read("localStorage", INTERNAL_KEY) === "1";
}

/**
 * The time zone stands in for a location: a static site has no server to ask.
 * It decides who sees the notice. Google's `region` default in `startTag` is the
 * backup for a visitor whose time zone and location disagree, and it errs towards
 * denied, so a mismatch can only ever collect less.
 */
function inConsentRegion() {
  readFlags();
  const override = read("sessionStorage", REGION_KEY);
  if (override) return override === "eu";

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  return zone.startsWith("Europe/") || EUROPEAN_ZONES.includes(zone);
}

/* Consent store, shaped for useSyncExternalStore. */

let choice: ConsentChoice | null | undefined;
const consentListeners = new Set<() => void>();

export function subscribeConsent(listener: () => void) {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
}

export function getConsentChoice(): ConsentChoice | null {
  if (choice === undefined) {
    const stored = read("localStorage", CONSENT_KEY);
    choice = stored === "accepted" || stored === "declined" ? stored : null;
  }
  return choice;
}

export function isConsentNoticeNeeded() {
  return getConsentChoice() === null && inConsentRegion();
}

export function setConsentChoice(next: ConsentChoice) {
  choice = next;
  write("localStorage", CONSENT_KEY, next);
  consentListeners.forEach((listener) => listener());

  if (next === "accepted") {
    startTag();
    if (tagStarted) gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  if (tagStarted) gtag("consent", "update", { analytics_storage: "denied" });
  clearGaCookies();
}

/** A decline has to undo an earlier accept, so GA's cookies go with it. */
function clearGaCookies() {
  const domain = window.location.hostname;
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
  }
}

/* The tag. */

function canSend() {
  return (
    window.location.hostname === LIVE_HOST &&
    Boolean(MEASUREMENT_ID) &&
    getConsentChoice() !== "declined"
  );
}

/** gtag.js only reads an `arguments` object. A plain array is silently ignored. */
const gtag: (...args: unknown[]) => void = function () {
  // eslint-disable-next-line prefer-rest-params -- see the comment above.
  window.dataLayer?.push(arguments);
};

function userProperties(): Record<UserProperty, string> {
  const matches = (query: string) => window.matchMedia(query).matches;
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection;

  return {
    input_type: matches("(pointer: coarse)") ? "touch" : "mouse",
    reduced_motion: matches("(prefers-reduced-motion: reduce)") ? "reduce" : "no_preference",
    color_scheme: matches("(prefers-color-scheme: light)") ? "light" : "dark",
    connection_type: connection?.effectiveType ?? "unknown",
  };
}

function loadTag() {
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

function loadWhenIdle() {
  const idle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(loadTag, { timeout: 2000 });
    else setTimeout(loadTag, 1);
  };

  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

let tagStarted = false;

function startTag() {
  readFlags();
  if (tagStarted || !canSend()) return;
  tagStarted = true;

  window.dataLayer ??= [];

  // The region default goes first, as Google's documentation sets it out; the
  // most specific default wins whatever the order.
  gtag("consent", "default", { ...NO_ADS, analytics_storage: "denied", region: CONSENT_REGIONS });
  gtag("consent", "default", {
    ...NO_ADS,
    analytics_storage: inConsentRegion() ? "denied" : "granted",
  });
  if (getConsentChoice() === "accepted") {
    gtag("consent", "update", { analytics_storage: "granted" });
  }

  gtag("js", new Date());
  gtag("set", "user_properties", userProperties());
  gtag("config", MEASUREMENT_ID, {
    // Off on purpose. On a site this size Google signals trigger thresholding,
    // which hides rows from the reports the whole setup exists to read.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(debug ? { debug_mode: true } : {}),
    ...(internal ? { traffic_type: "internal" } : {}),
  });

  loadWhenIdle();
}

/** Starts the tag, which sends the page_view. Rendered once by AnalyticsRoot. */
export function startAnalytics() {
  startTag();
}

/* Sending. */

let currentSection = "hero";

export function setCurrentSection(id: string) {
  currentSection = id;
}

function describe(name: EventName, params: Params) {
  const sentence = SENTENCES[name].replace(/\{(\w+)\}/g, (_, key: string) =>
    String(params[key] ?? "").replaceAll("_", " "),
  );
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function clean(params: Params) {
  const result: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    result[key] = typeof value === "string" ? value.slice(0, MAX_VALUE_LENGTH) : value;
  }
  return result;
}

/**
 * Every event goes through here, so every event carries its sentence and its
 * section. `name` is checked by the callers: `track` by the compiler, and the
 * delegated listener by the attributes `trackAttrs` wrote.
 */
export function sendEvent(name: EventName, params: Params) {
  readFlags();
  const payload = clean({
    ...params,
    section_id: params.section_id ?? currentSection,
  });
  payload.event_description = describe(name, payload).slice(0, MAX_VALUE_LENGTH);

  if (debug) console.info("[analytics]", name, payload);
  if (!canSend()) return;

  startTag();
  gtag("event", name, payload);
}

/** For what a data attribute cannot express: timers, keys, anything not a click. */
export function track<E extends EventName>(
  name: E,
  params: EventParams<E> & { section_id?: string },
) {
  sendEvent(name, params as Params);
}
