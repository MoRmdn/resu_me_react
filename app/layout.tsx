import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { site, contact, socials, channels, publisherNamespace } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import "./globals.css";

/**
 * Fonts are self-hosted by next/font rather than pulled from the Google Fonts
 * CDN with a <link>, as the Flutter app did. That removes a render-blocking
 * third-party round trip and the layout shift that came with it.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Flutter developer",
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
    // Application ids, so an identifier search resolves to their author.
    ...projects.map((p) => p.bundleId).filter((id): id is string => Boolean(id)),
    ...channels.map((c) => `${site.shortName} ${c.label}`),
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: `${site.name} — ${site.title}`,
    title: `${site.name} — ${site.title}`,
    description: site.description,
    url: site.url,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
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
   * m0rmdn.web.app cannot use a Search Console "Domain" property: that requires
   * a DNS record on the domain you own, and `web.app` is Google's, not ours. So
   * it is a "URL prefix" property, verified by this meta tag.
   *
   * Set GOOGLE_SITE_VERIFICATION in .env (and as a GitHub secret for CI) to the
   * token Search Console gives you. Left unset, the tag is simply omitted.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * A schema.org @graph rather than a lone Person.
 *
 * Two jobs. `sameAs` folds eight scattered marketplace and social profiles into
 * one entity, which is the single highest-value thing on this page for search.
 * And each shipped app becomes a SoftwareApplication carrying its real
 * `identifier`, so a query for an application id resolves to its author.
 *
 * Note the identifiers are not all under `com.mormdn`: the earlier apps use
 * namespaces the client chose, and their store links are rendered on this same
 * page. Publishing the real values means those searches land here too.
 */
function jsonLd() {
  const personId = `${site.url}/#person`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.shortName,
    jobTitle: site.title,
    description: site.description,
    url: site.url,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mansoura",
      addressCountry: "EG",
    },
    // Every profile that is demonstrably the same person.
    sameAs: [...socials.map((s) => s.url), ...channels.map((c) => c.url)].filter((url) =>
      url.startsWith("http"),
    ),
    knowsAbout: [...skillGroups.flatMap((g) => g.items), publisherNamespace],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Mansoura University" },
    knowsLanguage: [
      { "@type": "Language", name: "Arabic" },
      { "@type": "Language", name: "English" },
    ],
  };

  const apps = projects
    .filter((p) => !p.links.website)
    .map((p) => ({
      "@type": "MobileApplication",
      "@id": `${site.url}/#${p.slug}`,
      name: p.title,
      description: p.description,
      applicationCategory: p.category,
      operatingSystem: "Android, iOS",
      author: { "@id": personId },
      // Omitted rather than emitted empty: an app with no confirmed identifier
      // or store listing should carry neither key. An empty `identifier` is
      // worse than an absent one.
      ...(p.bundleId ? { identifier: p.bundleId } : {}),
      ...(p.media?.icon
        ? { image: `${site.url}/images/projects/${p.media.icon.file}/${p.media.icon.file}-128.webp` }
        : {}),
      ...(p.links.playStore || p.links.appStore
        ? { installUrl: [p.links.playStore, p.links.appStore].filter(Boolean) }
        : {}),
    }));

  const webApps = projects
    .filter((p) => p.links.website)
    .map((p) => ({
      "@type": "WebApplication",
      "@id": `${site.url}/#${p.slug}`,
      name: p.title,
      description: p.description,
      applicationCategory: p.category,
      url: p.links.website,
      author: { "@id": personId },
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: `${site.name} — ${site.title}`,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profile`,
        url: site.url,
        name: `${site.name} — ${site.title}`,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
      },
      ...apps,
      ...webApps,
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-ink-900 text-bone antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled string — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-copper focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900"
        >
          Skip to content
        </a>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
