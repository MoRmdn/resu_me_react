import type { Locale } from "@/content/locale";

/**
 * Every page has an English and an Arabic document. `path` is the part after
 * the locale root, with a trailing slash and no leading one: `projects/ayco/`.
 *
 * Links between pages are plain anchors, never next/link: a full page load is
 * what starts a fresh count of sections, projects and scroll depth.
 */
export const homePath = (locale: Locale) => (locale === "ar" ? "/ar/" : "/");

export const localePath = (locale: Locale, path: string) => `${homePath(locale)}${path}`;

export const caseStudyPath = (slug: string) => `projects/${slug}/`;

export const servicePath = (slug: string) => `services/${slug}/`;

/** A WhatsApp link that opens the chat with the visitor's first line written. */
export function whatsappWith(url: string, message: string) {
  return `${url}?text=${encodeURIComponent(message)}`;
}

/** An email link that opens the draft with its subject written. */
export function mailtoWith(url: string, subject: string) {
  return `${url}?subject=${encodeURIComponent(subject)}`;
}

/**
 * A contact channel's link with the visitor's first line written, where the
 * channel takes one: WhatsApp gets the message, email the subject, and a
 * marketplace profile stays as it is. `content/site.ts` keeps the bare URLs,
 * because the structured data lists them as `sameAs`.
 */
export function channelHref(
  channel: { id: string; url: string },
  prefill: { whatsappMessage: string; emailSubject: string },
) {
  if (channel.id === "whatsapp") return whatsappWith(channel.url, prefill.whatsappMessage);
  if (channel.id === "email") return mailtoWith(channel.url, prefill.emailSubject);
  return channel.url;
}
