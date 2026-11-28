import type { Metadata } from "next";
import { getCopy } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { site } from "@/content/site";
import { localePath } from "@/lib/paths";

/**
 * Metadata for every page below the homepage.
 *
 * Next merges metadata shallowly: a page that sets `openGraph` or `twitter`
 * replaces the layout's whole object, so this sets them in full. The title is
 * absolute because the layout's title is a plain string and carries no
 * template.
 */
export function subpageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  /** Under the locale root, with a trailing slash: `projects/ayco/`. */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { metaCopy } = getCopy(locale);
  // The page's own phrase first, then the brand word: the name is in the
  // description and the structured data, and a title has about 60 characters.
  const fullTitle = `${title} | ${site.shortName}`;
  const url = localePath(locale, path);
  const image = { url: metaCopy.ogImage, width: 1200, height: 630, alt: fullTitle };
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: { en: `/${path}`, ar: `/ar/${path}`, "x-default": `/${path}` },
    },
    openGraph: {
      type: "article",
      siteName: metaCopy.siteName,
      title: fullTitle,
      description,
      url: `${site.url}${url}`,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
    robots: { index: true, follow: true },
  };
}
