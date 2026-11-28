import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site, channels, publisherNamespace } from "@/content/site";
import { projects } from "@/content/projects";
import { AnalyticsRoot } from "@/components/analytics/AnalyticsRoot";
import { JsonLd } from "@/components/JsonLd";
import { trackAttrs } from "@/lib/analytics/attrs";
import { projectNames } from "@/lib/projectNames";
import { siteGraph } from "@/lib/structured-data";
import "@/app/globals.css";
import type { Locale } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";
import { themeScript } from "@/lib/theme";

/**
 * Fonts are self-hosted by next/font rather than pulled from the Google Fonts
 * CDN with a <link>, as the Flutter app did. That removes a render-blocking
 * third-party round trip and the layout shift that came with it.
 *
 * The files are committed under `app/fonts/` (Google Fonts subsets, OFL)
 * rather than fetched by `next/font/google` at build time. Google sometimes
 * answers with `/l/font?kit=…&skey=…` URLs, and Turbopack's font loader splits
 * that `&` into extra query entries and fails the whole build. Local files make
 * the build independent of whatever Google serves that day.
 *
 * Archivo and JetBrains Mono are variable fonts, so one file covers every
 * weight. Only the Latin subset ships; `content/` uses nothing outside it.
 * Values must be literals (next/font reads them at compile time), which is why
 * the Arabic unicode-range is written out in place.
 */
const archivo = localFont({
  src: "../app/fonts/archivo-latin-var.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  // The file is instanced to wdth 100–118: body text at 100, Ledger's
  // display headings at 118 (see the `wide` utility in globals.css).
  declarations: [{ prop: "font-stretch", value: "100% 118%" }],
});

const jetbrainsMono = localFont({
  src: "../app/fonts/jetbrains-mono-latin-var.woff2",
  weight: "400 500",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * Only the reviews and a couple of Arabic names need this, none of them above
 * the fold, so it stays off the preload list. It sits behind Archivo in
 * `--font-sans` and its unicode-range keeps Latin text from ever fetching it.
 */
const plexArabic = localFont({
  src: [
    { path: "../app/fonts/plex-sans-arabic-400-arabic.woff2", weight: "400" },
    { path: "../app/fonts/plex-sans-arabic-500-arabic.woff2", weight: "500" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0600-06FF, U+0750-077F, U+0870-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC",
    },
  ],
});

const keywordProjects = projects.filter((p) => !p.hideFromKeywords);
const appNames = keywordProjects.map((p) => projectNames(p.title).name);

const englishMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: getCopy("en").metaCopy.title,
    template: `%s | ${site.shortName}`,
  },
  /**
   * The search snippet names every app, so a query for one of them can match
   * this page's description and not only a heading buried mid-page. Share
   * cards keep the short version below — they have no room for the list.
   */
  description: `${site.description} Apps: ${appNames.join(", ")}.`,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Software engineer",
    "Mobile developer",
    "Cross-platform",
    "Dart",
    "Bloc",
    "Riverpod",
    "Firebase",
    "React",
    "Next.js",
    "Egypt",
    "Mansoura",
    site.name,
    site.shortName,
    publisherNamespace,
    // App names and their aliases ("مسمار"), so a name search resolves too.
    ...keywordProjects.flatMap((p) => {
      const { name, alternateName } = projectNames(p.title);
      return [name, ...alternateName];
    }),
    // Application ids, so an identifier search resolves to their author.
    ...projects.map((p) => p.bundleId).filter((id): id is string => Boolean(id)),
    ...channels.map((c) => `${site.shortName} ${c.label}`),
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: getCopy("en").metaCopy.siteName,
    title: getCopy("en").metaCopy.title,
    description: site.description,
    url: site.url,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: getCopy("en").metaCopy.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: getCopy("en").metaCopy.title,
    description: site.description,
    images: ["/og.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/Icon-180.png",
  },
  robots: { index: true, follow: true },

  /**
   * Google Search Console ownership.
   *
   * mormdn.com can use a Search Console "Domain" property, verified with a DNS
   * TXT record. This meta tag remains useful if a separate "URL prefix"
   * property is configured as well.
   *
   * Set GOOGLE_SITE_VERIFICATION in .env (and as a GitHub secret for CI) to the
   * token Search Console gives you. Left unset, the tag is simply omitted.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#100e0d" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function DocumentShell({
  children,
  locale,
}: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${archivo.variable} ${jetbrainsMono.variable} ${plexArabic.variable}`}
      // The pre-paint script sets data-theme before React hydrates.
      suppressHydrationWarning
    >
      <body className="bg-ink-900 text-bone antialiased">
        <script
          // Static, author-controlled string. First in <body>, so it runs
          // before anything paints: the stored theme, else the system one,
          // and it keeps following the system while the choice is auto.
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {/* The Person and the WebSite, on every page. Each page adds the
            graph of what it is about: lib/structured-data.ts. */}
        <JsonLd data={siteGraph(locale)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-copper focus:px-4 focus:py-2 focus:font-semibold focus:text-on-copper"
          {...trackAttrs("nav_link_click", {
            link_target: "main",
            link_text: "Skip to content",
            nav_location: "skip_link",
          })}
        >
          {ui[locale].skip}
        </a>
        {children}
        <AnalyticsRoot locale={locale} />
      </body>
    </html>
  );
}

export function pageMetadata(locale: Locale): Metadata {
  const { metaCopy } = getCopy(locale);
  const title = metaCopy.title;
  // English keeps the app names after the sentence, so a search for one of
  // them can match the snippet; the share card gets the sentence alone.
  const description = locale === "ar" ? metaCopy.description : englishMetadata.description;
  const path = locale === "ar" ? "/ar/" : "/";
  const image = { url: metaCopy.ogImage, width: 1200, height: 630, alt: title };
  return {
    ...englishMetadata,
    title,
    description,
    alternates: { canonical: path, languages: { en: "/", ar: "/ar/", "x-default": "/" } },
    openGraph: {
      ...englishMetadata.openGraph,
      siteName: metaCopy.siteName,
      title,
      description: metaCopy.description,
      url: `${site.url}${path}`,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      images: [image],
    },
    twitter: {
      ...englishMetadata.twitter,
      title,
      description: metaCopy.description,
      images: [image.url],
    },
  };
}
