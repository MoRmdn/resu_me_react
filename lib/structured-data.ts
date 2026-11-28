import { clientCountries } from "@/content/clients";
import { getCopy } from "@/content/copy-i18n";
import { caseStudySlugs } from "@/content/case-studies";
import { experiences } from "@/content/experience";
import type { Locale } from "@/content/locale";
import { projects } from "@/content/projects";
import { localizeProject } from "@/content/projects-i18n";
import { channels, contact, publisherNamespace, site, socials } from "@/content/site";
import { skillGroups } from "@/content/skills";
import type { CaseStudy, Project, Service } from "@/content/types";
import { caseStudyPath, homePath, localePath, servicePath } from "@/lib/paths";
import { projectNames } from "@/lib/projectNames";

/**
 * schema.org graphs, one per kind of page. Every page carries the site-wide
 * Person and WebSite (rendered by the layout); each page adds what it is about.
 *
 * `sameAs` on the Person folds eight scattered marketplace and social profiles
 * into one entity, which is the single highest-value thing here for search.
 * Each shipped app is a SoftwareApplication carrying its real `identifier`, so
 * a query for an application id resolves to its author.
 *
 * The identifiers are not all under `com.mormdn`: the earlier apps use
 * namespaces the client chose, and their store links are on the site too.
 */
const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;
/**
 * Same constant the sitemap's lastmod comes from, normalised the same way. A
 * bare "2026-09-03" is a valid schema.org Date but Google's structured-data
 * parser rejects it for `dateModified`: it wants a full ISO 8601 instant.
 */
const modified = new Date(site.contentLastChanged).toISOString();

const absolute = (locale: Locale, path: string) => `${site.url}${localePath(locale, path)}`;

/** The Person and the WebSite, on every page. */
export function siteGraph(locale: Locale) {
  /**
   * The current employer, from the same array the Experience section renders.
   * Only the current one: `worksFor` is present tense. `company` carries the
   * bilingual display string ("MisMar | مسمار"): the part before the pipe is
   * the name and anything after it is an alias.
   */
  const currentRole = experiences.find((e) => e.isCurrent);
  const [employerName, ...employerAliases] = (currentRole?.company ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.alternateNames,
    jobTitle: site.title,
    description: site.description,
    url: site.url,
    email: contact.email,
    telephone: contact.phone,
    address: { "@type": "PostalAddress", addressLocality: "Mansoura", addressCountry: "EG" },
    // Every profile that is demonstrably the same person.
    sameAs: [...socials.map((s) => s.url), ...channels.map((c) => c.url)].filter((url) =>
      url.startsWith("http"),
    ),
    knowsAbout: [...skillGroups.flatMap((g) => g.items), publisherNamespace],
    // The page this entity is described by, closing the loop with
    // ProfilePage.mainEntity on the homepage.
    mainEntityOfPage: { "@id": `${site.url}${homePath(locale)}#profile` },
    /**
     * `jobTitle` is a bare string. `hasOccupation` is the typed property, and it
     * carries where the work happens and what it involves.
     */
    hasOccupation: {
      "@type": "Occupation",
      name: site.title,
      occupationLocation: {
        "@type": "City",
        name: "Mansoura",
        address: { "@type": "PostalAddress", addressLocality: "Mansoura", addressCountry: "EG" },
      },
      skills: skillGroups.flatMap((g) => g.items),
    },
    ...(employerName
      ? {
          worksFor: {
            "@type": "Organization",
            name: employerName,
            ...(employerAliases.length ? { alternateName: employerAliases } : {}),
          },
        }
      : {}),
    alumniOf: { "@type": "CollegeOrUniversity", name: "Mansoura University" },
    knowsLanguage: [
      { "@type": "Language", name: "Arabic" },
      { "@type": "Language", name: "English" },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        // The brand word leads: it is what the domain and every profile say.
        name: site.shortName,
        alternateName: [`${site.shortName} — ${site.name}`, ...site.alternateNames.slice(1)],
        inLanguage: locale,
        publisher: { "@id": personId },
      },
    ],
  };
}

/**
 * One app as a schema.org entity. `sameAs` ties it to the store page Google
 * already knows, which is what lets a search for the app surface its author.
 * The `@id` is the same on every page; `url` is its case study, when it has one.
 */
function appEntity(project: Project, locale: Locale) {
  const { name, alternateName } = projectNames(project.title);
  const listings = [project.links.playStore, project.links.appStore, project.links.github].filter(
    (url): url is string => Boolean(url),
  );
  const identity = {
    "@id": `${site.url}/#${project.slug}`,
    name,
    ...(alternateName.length ? { alternateName } : {}),
    ...(listings.length ? { sameAs: listings } : {}),
    description: project.description,
    applicationCategory: project.category,
    author: { "@id": personId },
  };

  if (project.links.website) {
    return { "@type": "WebApplication", ...identity, url: project.links.website };
  }
  return {
    "@type": "MobileApplication",
    ...identity,
    operatingSystem: "Android, iOS",
    ...(caseStudySlugs.includes(project.slug)
      ? { url: absolute(locale, caseStudyPath(project.slug)) }
      : {}),
    // Omitted rather than emitted empty: an app with no confirmed identifier or
    // store listing should carry neither key.
    ...(project.bundleId ? { identifier: project.bundleId } : {}),
    ...(project.media?.icon
      ? {
          image: `${site.url}/images/projects/${project.media.icon.file}/${project.media.icon.file}-128.webp`,
        }
      : {}),
    ...(project.links.playStore || project.links.appStore
      ? { installUrl: [project.links.playStore, project.links.appStore].filter(Boolean) }
      : {}),
  };
}

/** The homepage: a ProfilePage about the Person, mentioning every app. */
export function profileGraph(locale: Locale) {
  const pageUrl = `${site.url}${homePath(locale)}`;
  const localized = projects.map((p) => localizeProject(p, locale));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile`,
        url: pageUrl,
        inLanguage: locale,
        name: getCopy(locale).metaCopy.title,
        isPartOf: { "@id": websiteId },
        dateModified: modified,
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        // The apps are described on this page too, not only by their author.
        mentions: localized.map((p) => ({ "@id": `${site.url}/#${p.slug}` })),
      },
      ...localized.map((p) => appEntity(p, locale)),
    ],
  };
}

type Crumb = { name: string; path?: string };

function breadcrumbs(locale: Locale, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path !== undefined ? { item: absolute(locale, crumb.path) } : {}),
    })),
  };
}

/** A case study: an Article about the app, with the app itself and the trail. */
export function caseStudyGraph(
  study: CaseStudy,
  project: Project,
  locale: Locale,
  crumbs: Crumb[],
) {
  const pageUrl = absolute(locale, caseStudyPath(study.slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: study.headline,
        description: study.summary,
        inLanguage: locale,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        image: `${site.url}/og.png`,
        dateModified: modified,
        author: { "@id": personId },
        publisher: { "@id": personId },
        about: { "@id": `${site.url}/#${project.slug}` },
        isPartOf: { "@id": websiteId },
      },
      appEntity(project, locale),
      breadcrumbs(locale, crumbs),
    ],
  };
}

/** A service page: the Service, its questions, and the trail. */
export function serviceGraph(service: Service, locale: Locale, crumbs: Crumb[]) {
  const pageUrl = absolute(locale, servicePath(service.slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: service.headline,
        serviceType: service.title,
        description: service.summary,
        url: pageUrl,
        provider: { "@id": personId },
        availableLanguage: ["ar", "en"],
        // Where clients have actually hired from, per content/clients.json.
        areaServed: clientCountries.map((c) => ({ "@type": "Country", name: c.name })),
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: locale,
        mainEntity: service.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumbs(locale, crumbs),
    ],
  };
}
