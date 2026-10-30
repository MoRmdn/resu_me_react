"use client";

import { useSyncExternalStore } from "react";
import { consentCopy } from "@/content/copy";
import { trackAttrs } from "@/lib/analytics/attrs";
import type { EventParams } from "@/lib/analytics/catalog";
import {
  getConsentChoice,
  isConsentNoticeNeeded,
  setConsentChoice,
  subscribeConsent,
} from "@/lib/analytics/gtag";
import { cn } from "@/lib/cn";

const BUTTON =
  "inline-flex min-h-11 items-center rounded-md border border-line px-4 text-caption text-bone transition-colors duration-fast ease-fast hover:border-line-strong hover:bg-bone-06";

function ConsentButtons({
  source,
  current,
}: {
  source: EventParams<"consent_choice">["consent_source"];
  current?: ReturnType<typeof getConsentChoice>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={current === undefined ? undefined : current === "accepted"}
        onClick={() => setConsentChoice("accepted")}
        className={cn(BUTTON, current === "accepted" && "border-line-strong bg-ink-600")}
        {...trackAttrs("consent_choice", { consent_decision: "accepted", consent_source: source })}
      >
        {consentCopy.acceptLabel}
      </button>
      <button
        type="button"
        aria-pressed={current === undefined ? undefined : current === "declined"}
        onClick={() => setConsentChoice("declined")}
        className={cn(BUTTON, current === "declined" && "border-line-strong bg-ink-600")}
        {...trackAttrs("consent_choice", { consent_decision: "declined", consent_source: source })}
      >
        {consentCopy.declineLabel}
      </button>
    </div>
  );
}

/**
 * Shown only where consent is required, and only until it is answered. It never
 * blocks the page and takes no copper: this viewport's accent belongs to the
 * page. Client-only by design, since the region is a browser fact, so it can
 * never be the LCP element or shift the served layout. It stays off the privacy
 * page, which has the same choice in the page itself.
 */
export function ConsentNotice() {
  const needed = useSyncExternalStore(
    subscribeConsent,
    () => isConsentNoticeNeeded() && window.location.pathname !== consentCopy.policyHref,
    () => false,
  );
  if (!needed) return null;

  return (
    <aside
      aria-label={consentCopy.label}
      className="fixed inset-x-5 bottom-5 z-50 rounded-lg border border-line bg-ink-700 p-5 elevation-card md:right-auto md:left-8 md:max-w-[440px]"
    >
      <p className="text-caption text-bone-70">
        {consentCopy.body}{" "}
        <a
          href={consentCopy.policyHref}
          className="text-bone underline decoration-line underline-offset-4 transition-colors duration-fast ease-fast hover:decoration-bone"
          {...trackAttrs("nav_link_click", {
            link_target: "privacy",
            link_text: consentCopy.policyLabel,
            nav_location: "consent_notice",
          })}
        >
          {consentCopy.policyLabel}
        </a>
      </p>
      <div className="mt-4">
        <ConsentButtons source="notice" />
      </div>
    </aside>
  );
}

/** The same choice on the privacy page, open to every visitor at any time. */
export function ConsentControl() {
  const current = useSyncExternalStore(subscribeConsent, getConsentChoice, () => null);

  return (
    <div>
      <p className="eyebrow mb-3 text-bone-52">
        {current ? consentCopy.currentLabel[current] : consentCopy.currentLabel.none}
      </p>
      <ConsentButtons source="privacy_page" current={current} />
    </div>
  );
}
