import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { site, contact, socials } from "@/content/site";
import { skillGroups } from "@/content/skills";
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
    "Egypt",
    site.name,
    site.shortName,
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
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** schema.org Person — what makes the page legible to search engines as a CV. */
function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
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
    sameAs: socials.map((s) => s.url),
    knowsAbout: skillGroups.flatMap((g) => g.items),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Mansoura University",
    },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
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
