"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { ConsentNotice } from "@/components/analytics/ConsentNotice";
import { startAttention } from "@/lib/analytics/attention";
import { startAnalytics, track } from "@/lib/analytics/gtag";
import { clickCount, startListeners } from "@/lib/analytics/listeners";

type WebVital = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];

/** Outside the component so the reporter is never re-registered. */
function reportWebVital({ name, value, rating }: WebVital) {
  track("web_vital", {
    metric_name: name,
    // CLS is a small unitless score, and GA reads whole numbers best.
    metric_value: Math.round(name === "CLS" ? value * 1000 : value),
    metric_rating: rating,
  });
}

/**
 * Installs analytics. Rendered once, in the root layout, so the privacy page and
 * the 404 are covered as well as the home page.
 */
export function AnalyticsRoot() {
  useReportWebVitals(reportWebVital);

  useEffect(() => {
    startAnalytics();
    const stopListeners = startListeners();
    const stopAttention = startAttention(clickCount);
    return () => {
      stopListeners();
      stopAttention();
    };
  }, []);

  return <ConsentNotice />;
}
