import type { Metadata } from "next";
import { ConsentControl } from "@/components/analytics/ConsentNotice";
import { Footer } from "@/components/sections/Footer";
import { Section } from "@/components/ui/Section";
import { privacyCopy } from "@/content/copy";
import { contact } from "@/content/site";
import { trackAttrs } from "@/lib/analytics/attrs";

/**
 * Google Analytics' terms require a privacy policy, so this exists. It carries
 * `noindex` and stays out of the sitemap: for search, the site is still the one
 * page. The links here are plain anchors on purpose: a full page load is what
 * starts a fresh count of sections, projects and scroll depth for the next page.
 */
export const metadata: Metadata = {
  title: privacyCopy.title,
  description: privacyCopy.description,
  alternates: { canonical: "/privacy/" },
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return (
    <>
      <main id="main">
        <Section id="privacy" tone="ink-900" border={false} innerClassName="max-w-[760px]">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load resets the per-load analytics state. */}
          <a
            href="/"
            className="eyebrow inline-flex min-h-11 items-center text-bone-52 transition-colors duration-fast ease-fast hover:text-bone"
            {...trackAttrs("nav_link_click", {
              link_target: "home",
              link_text: privacyCopy.backLabel,
              nav_location: "privacy_page",
            })}
          >
            &larr; {privacyCopy.backLabel}
          </a>

          <p className="eyebrow mt-10 text-bone-52">{privacyCopy.eyebrow}</p>
          <h1 className="mt-6 text-display-l text-balance">{privacyCopy.headline}</h1>
          <p className="mt-7 text-body-l text-bone-70">{privacyCopy.intro}</p>
          <p className="mt-4 text-caption text-bone-52">{privacyCopy.updated}</p>

          <div className="mt-12 rounded-lg border border-line bg-ink-700 p-7 elevation-card">
            <h2 className="text-h3">{privacyCopy.choiceTitle}</h2>
            <p className="mt-3 mb-6 text-body text-bone-70">{privacyCopy.choiceBody}</p>
            <ConsentControl />
          </div>

          {privacyCopy.sections.map((section) => (
            <section key={section.title} className="mt-12">
              <h2 className="text-h3">{section.title}</h2>
              <ul className="mt-4 border-t border-line">
                {section.items.map((item) => (
                  <li key={item} className="border-b border-line py-3.5 text-body text-bone-70">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="mt-12">
            <h2 className="text-h3">{privacyCopy.contactTitle}</h2>
            <p className="mt-4 text-body text-bone-70">
              {privacyCopy.contactBody}{" "}
              <a
                href={contact.emailUrl}
                className="text-bone underline decoration-line underline-offset-4 transition-colors duration-fast ease-fast hover:decoration-bone"
                {...trackAttrs("nav_link_click", {
                  link_target: "email",
                  link_text: "Privacy contact email",
                  nav_location: "privacy_page",
                })}
              >
                {contact.email}
              </a>
              .
            </p>
          </section>
        </Section>
      </main>
      <Footer />
    </>
  );
}
