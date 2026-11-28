import type { CaseStudy } from "./types";

/**
 * Case studies, one page each at /projects/<slug>/. The Arabic text is in
 * case-studies-i18n.ts.
 *
 * Every fact comes from content/ (projects.ts, experience.ts), the CV or the
 * verbatim reviews. A number appears only where the site already defends it.
 * A period that is not on record is left out, never guessed. Private clients
 * stay unnamed, and only the screens already cleared for the site are shown.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "ayco",
    headline: "Paperless maintenance reports that work without a signal",
    summary:
      "A field-service app I built alone for a medical-equipment maintenance company: offline visits, signed Arabic PDF reports and batches of up to 100 devices.",
    facts: {
      client: "A medical-equipment maintenance company. A private client, not named here",
      role: "Sole developer: the Flutter app, the Firebase back end and the release builds",
      platforms: "Android, on an invite-only Google Play listing",
    },
    context: [
      "The client maintains medical equipment in hospitals. Every visit ends with a numbered report for each device, signed by the technician and by the client.",
      "AYCO puts that report on the technician's phone. They scan the device's serial number, the app fills in its registry data, both sign on the screen, and the phone produces the PDF in Arabic. A QR code printed on the report opens it again later.",
    ],
    challenge: [
      "Technicians need to complete maintenance visits and issue Arabic reports even when connectivity is unreliable.",
      "Some visits cover many devices at once. Every report needs a number that is never issued twice, and what a technician may do has to differ from what an administrator may do.",
    ],
    decisions: [
      {
        title: "A dropped connection never stops a visit",
        body: "When the network doesn't answer, the app keeps the report as queued instead of failing it, and the technician carries on.",
      },
      {
        title: "Arabic first, on paper too",
        body: "The screens, the PDF and the printed form were designed right to left from the first day, not mirrored at the end.",
      },
      {
        title: "A big visit is one job, not a hundred",
        body: "A technician can report up to 100 devices in one visit, under one signature, and every report still gets its own number.",
      },
      {
        title: "Each role sees only its own work",
        body: "Technicians, administrators and the super admin get different permissions, and the server enforces them, not just the screens.",
      },
    ],
    outcomes: [
      { value: "Offline", label: "Visits finish without a connection" },
      { value: "RTL", label: "Signed Arabic PDF reports" },
      { value: "100", label: "Devices in one batch visit" },
      { value: "3", label: "Roles enforced on the server" },
    ],
    highlights: [
      "Made every write offline-safe by racing Firestore writes against a timeout and surfacing the result as queued rather than failed, so technicians can complete visits without connectivity.",
      "Batched up to 100 devices per visit in resumable 25-report transaction chunks to stay within the Firestore transaction limit, with report numbering issued transactionally.",
      "Enforced a three-role permission model — super admin, admin, technician — server-side in Cloud Functions and security rules, and shipped two build flavours bound to separate development and production Firebase projects.",
      "Localised Arabic-first with full RTL: 906 strings across ar/en ARB files, with the layout, PDF and printed forms designed right-to-left.",
    ],
    lessons: [
      "Decide early which actions must work offline, and what the user sees while they wait. That decision shapes every screen after it.",
      "If your app produces a document, design the document right to left from the start. Arabic PDFs and printed forms are where late RTL work shows most.",
      "Put permissions on the server. A hidden button is not a permission.",
    ],
    // Only what has a page. The build fails on an id that resolves to nothing
    // (lib/closed-set.ts). When SAAD or Mutabbib get a study, add them to `related`.
    services: ["new_app", "existing_app"],
    related: [],
    message: "Hi Mohamed, I saw AYCO on your site and I need something similar.",
  },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);

export const hasCaseStudy = (slug: string) => caseStudySlugs.includes(slug);
