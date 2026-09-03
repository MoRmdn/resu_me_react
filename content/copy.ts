/**
 * Section prose. Kept out of the components so a wording change never means
 * touching layout code.
 *
 * The hero intro previously said "four years" — the CV says over five.
 */
import { contact, metrics, site } from "./site";

export const hero = {
  status: "Open to work",
  place: `${site.location} · ${site.timezone}`,
  headline: ["Flutter apps", "that actually", "ship."],
  /** The final word of the headline carries the single copper accent. */
  headlineAccentIndex: 2,
  intro: `I'm ${site.name} — a mobile developer with ${metrics.yearsExperience} years spent building cross-platform products for teams in ${metrics.countries} countries. Bloc, GetX, Cubit, clean architecture, and a stubborn preference for 60fps.`,
  primaryCta: { label: "See the work", href: "#projects" },
  secondaryCta: { label: contact.email, href: contact.emailUrl },
  resumeCta: { label: "Download CV", href: contact.resumeUrl },
  trackRecordLabel: "Track record",
  trackRecord: [
    { value: metrics.yearsExperience, suffix: "+", label: "Years shipping Flutter" },
    { value: metrics.appsLiveOnBothStores, suffix: "", label: "Apps live on both stores" },
    { value: metrics.teams, suffix: "", label: `Teams across ${metrics.countries} countries` },
  ],
  viewsLabel: "page views",
};

export const about = {
  eyebrow: "01 / About",
  headline: ["Bioinformatics", "degree, mobile", "obsession."],
  lede: "I build cross-platform apps that behave like native ones — fast to open, smooth under the thumb, and honest about state.",
  body: [
    "My final-year project was mobile data analysis and visualisation; that's where the habit started. Since then I've led products from an empty `main.dart` to the App Store: a driving-school platform in Morocco, a medical social network in Libya, an AI matchmaking product in Saudi Arabia, a multi-vendor marketplace in Türkiye, and a field-service reporting system built solo end to end. Different domains, same discipline — Bloc or Cubit for anything with real business logic, clean architecture so the next developer isn't cursing my name, and unit and widget tests where they earn their keep.",
    "I like the unglamorous wins: cutting data load times by 20%, shaving 10% off a bundle, upgrading a legacy app to null safety before it became someone's emergency.",
  ],
  stats: [
    { value: "20%", label: "Faster data load, Eleven Stars" },
    { value: "25%", label: "More bookings, Mutabbib" },
    { value: "15%", label: "Retention lift, Arcit-AI" },
    { value: "10%", label: "Smaller binary, Cyparta" },
  ],
};

export const experienceCopy = {
  eyebrow: "02 / Experience",
  headline: "Seven teams, six countries.",
  hint: "tap a row to expand",
  currentBadge: "CURRENT",
};

export const projectsCopy = {
  eyebrow: "03 / Projects",
  headline: "Live on both stores.",
  flagshipLabel: "Flagship",
  privateLabel: "Private client · no public listing",
  appStoreLabel: "App Store",
  playStoreLabel: "Google Play",
};

export const skillsCopy = {
  eyebrow: "04 / Skills",
  headline: "The toolbox.",
  blurb:
    "Depth where it matters — Dart, Flutter, state management and payments — and enough breadth to talk to backend, data and design without a translator.",
};

export const contactCopy = {
  eyebrow: "05 / Contact",
  headline: ["Got an app", "to build?"],
  blurb:
    "Full-time, contract or a second pair of hands on a release that's slipping — send the details and I'll reply within a day.",
  availabilityLabel: "AVAILABILITY",
  availability: "Taking new work · Mansoura / remote",
  formEyebrow: "Or send a message directly",
  fields: {
    name: { label: "Full Name", placeholder: "Enter your full name" },
    email: { label: "Email Address", placeholder: "Enter your email address" },
    projectType: { label: "Project Type", placeholder: "e.g., Mobile App" },
    budget: { label: "Budget Range", placeholder: "e.g., $5,000 - $10,000" },
    message: { label: "Project Description", placeholder: "Tell me about your project..." },
  },
  submit: "Send Message",
  submitting: "Sending…",
  success: "Message sent successfully! I'll get back to you soon.",
  failure: "Failed to send message. Please try again.",
  errors: {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    message: "Please tell me a little about the project.",
  },
};

export const footerCopy = {
  backToTop: "Back to top",
  builtWith: "Built with Next.js",
};
