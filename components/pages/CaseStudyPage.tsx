import { JsonLd } from "@/components/JsonLd";
import { SubpageHeader } from "@/components/SubpageHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { Footer } from "@/components/sections/Footer";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HighlightList, ProjectLinks, TechList } from "@/components/ui/ProjectMeta";
import { ProjectPlate, ScreenStrip } from "@/components/ui/ProjectPlate";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { Section } from "@/components/ui/Section";
import { caseStudySlugs } from "@/content/case-studies";
import { getCaseStudy } from "@/content/case-studies-i18n";
import { getCopy, ui } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { projects } from "@/content/projects";
import { localizeProject } from "@/content/projects-i18n";
import { selectedReviews } from "@/content/reviews";
import { findService } from "@/content/services-i18n";
import { channels } from "@/content/site";
import type { Service } from "@/content/types";
import { attentionAttrs, projectParams, swipeAttrs, trackAttrs } from "@/lib/analytics/attrs";
import { stagger } from "@/lib/motion";
import { caseStudyPath, homePath, localePath, servicePath, whatsappWith } from "@/lib/paths";
import { projectNames } from "@/lib/projectNames";
import { caseStudyGraph } from "@/lib/structured-data";

function localProject(slug: string, locale: Locale) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`A case study names a project that does not exist: ${slug}`);
  return localizeProject(project, locale);
}

/** Section headings below the H1 stay at normal width: wide type at 24px reads as squashed. */
const H2 = "text-h2 [font-variation-settings:normal]";

/**
 * One project's full story, at /projects/<slug>/. The order follows the case
 * studies of Very Good Ventures and LeanCode: what was asked, what was decided
 * and why, what changed, what a client with a similar project should know, and
 * the services that did the work.
 *
 * The H1 paints at full opacity from the first frame (`rise-lcp`), so it can be
 * the page's LCP. Everything after it reveals on scroll, and the served HTML,
 * crawlers and no-JS visitors get the finished page.
 *
 * The WhatsApp button under the summary holds the first viewport's copper, the
 * final band holds the last one's, and both are on screen from the first
 * frame. No Ledger numbers here: they belong to the homepage section eyebrows
 * alone.
 */
export default function CaseStudyPage({ slug, locale }: { slug: string; locale: Locale }) {
  const { caseStudyCopy: copy, projectsCopy } = getCopy(locale);
  const study = getCaseStudy(slug, locale);
  const project = localProject(slug, locale);
  const { name } = projectNames(project.title);
  const params = projectParams(project, "case_study");
  const whatsapp = channels.find((c) => c.id === "whatsapp")!;
  const external = <span className="sr-only">{ui[locale].external}</span>;

  const crumbs: Crumb[] = [
    { label: copy.homeLabel, href: homePath(locale), target: "home" },
    { label: copy.projectsLabel, href: `${homePath(locale)}#projects`, target: "projects" },
    { label: name, target: slug },
  ];
  const reviews = selectedReviews(study.reviewIds ?? []);
  // Only services that have a page yet: a link to a page that doesn't exist is a 404.
  const services = study.services
    .map((id) => findService(id, locale))
    .filter((s): s is Service => Boolean(s));
  const related = study.related
    .filter((s) => caseStudySlugs.includes(s))
    .map((s) => ({ study: getCaseStudy(s, locale), project: localProject(s, locale) }));

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: copy.factLabels.client, value: study.facts.client },
    { label: copy.factLabels.role, value: study.facts.role },
    ...(study.facts.period ? [{ label: copy.factLabels.period, value: study.facts.period }] : []),
    { label: copy.factLabels.platforms, value: study.facts.platforms },
    { label: copy.factLabels.builtWith, value: <TechList technologies={project.technologies} className="mt-1" /> },
    ...(project.bundleId
      ? [
          {
            label: projectsCopy.bundleIdLabel,
            // Visible text, not only structured data: a literal identifier
            // search is matched against the served HTML.
            value: (
              <span className="font-mono text-[0.8125rem] break-all" dir="ltr">
                {project.bundleId}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <JsonLd
        data={caseStudyGraph(study, project, locale, [
          { name: copy.homeLabel, path: "" },
          { name: copy.projectsLabel, path: "#projects" },
          { name },
        ])}
      />
      <SubpageHeader locale={locale} path={caseStudyPath(slug)} message={study.message} />

      <main id="main">
        <article {...attentionAttrs("project", params)}>
          <section id="case-study" className="relative w-full bg-ink-900 pt-6 pb-20 md:pt-8 md:pb-24">
            <div className="mx-auto w-full max-w-content px-5 md:px-8">
              <Breadcrumb locale={locale} items={crumbs} />
              <div className="mt-10 max-w-[58rem] md:mt-14">
                <Eyebrow>
                  {copy.eyebrow} · <bdi>{name}</bdi>
                </Eyebrow>
                <h1 className="rise-lcp mt-4 text-display-l">{study.headline}</h1>
              </div>

              <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[7fr_5fr] lg:gap-16">
                {/* No entrance: as large as the H1, the lede can be the LCP too. */}
                <div>
                  <p className="max-w-[62ch] text-body-l text-bone-70">{study.summary}</p>
                  <p className="mt-6 text-caption text-bone-52">
                    {projectsCopy.availability[project.availability]}
                  </p>
                  <div className="mt-3">
                    <ProjectLinks locale={locale} project={project} placement="case_study" buttons />
                  </div>
                  <a
                    href={whatsappWith(whatsapp.url, study.message)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-flex min-h-12 items-center gap-2.5 rounded-md bg-copper px-5 font-semibold text-on-copper transition-colors duration-fast ease-fast hover:bg-copper-bright active:bg-copper-dim"
                    {...trackAttrs("contact_channel_click", {
                      channel_id: whatsapp.id,
                      channel_label: copy.ctaLabel,
                      channel_placement: "case_study",
                    })}
                  >
                    {copy.ctaLabel}
                    <span aria-hidden className="rtl:-scale-x-100">
                      →
                    </span>
                    {external}
                  </a>
                  <div>
                {/* Who is behind the page, for a visitor who landed here first. */}
                <a
                  href={`${homePath(locale)}#reviews`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-caption text-bone-70 underline decoration-line-strong underline-offset-4 transition-colors duration-fast ease-fast hover:text-bone hover:decoration-bone"
                  {...trackAttrs("nav_link_click", {
                    link_target: "reviews",
                    link_text: ui[locale].proof,
                    nav_location: "case_study_page",
                  })}
                >
                  {ui[locale].proof}
                  <span aria-hidden className="rtl:-scale-x-100">
                    →
                  </span>
                </a>
                  </div>
                </div>

                <dl
                  style={stagger(2)}
                  className="enter hairline-grid overflow-hidden rounded-lg border border-line"
                >
                  {facts.map((fact) => (
                    <div key={fact.label} className="bg-ink-700 p-5">
                      <dt className="text-caption text-bone-52">{fact.label}</dt>
                      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-bone">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {project.media && (
            <Section id="screens" tone="ink-800">
              <div data-reveal>
                {project.media.screens ? (
                  <ScreenStrip
                    screens={project.media.screens}
                    label={projectsCopy.screensLabel(project.title)}
                    swipe={swipeAttrs(params)}
                  />
                ) : (
                  <ProjectPlate
                    media={project.media}
                    title={project.title}
                    className="rounded-lg border border-line"
                  />
                )}
              </div>
            </Section>
          )}

          <Section id="story">
            <div className="flex flex-col gap-16 md:gap-20">
              {[
                { id: "context", label: copy.contextLabel, paragraphs: study.context },
                { id: "challenge", label: copy.challengeLabel, paragraphs: study.challenge },
              ].map((block) => (
                <div key={block.id} data-reveal className="grid gap-5 lg:grid-cols-[4fr_8fr] lg:gap-16">
                  <h2 className={H2}>{block.label}</h2>
                  <div className="flex max-w-[64ch] flex-col gap-4">
                    {block.paragraphs.map((p) => (
                      <p key={p} className="text-body-l text-bone-70">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="decisions" tone="ink-800">
            <h2 data-reveal className={H2}>
              {copy.decisionsLabel}
            </h2>
            <ul
              data-reveal
              style={stagger(1)}
              className="hairline-grid mt-8 overflow-hidden rounded-lg border border-line sm:grid-cols-2"
            >
              {study.decisions.map((decision) => (
                <li key={decision.title} className="bg-ink-700 p-6 md:p-7">
                  <h3 className="text-h3">{decision.title}</h3>
                  <p className="mt-3 text-body text-bone-70">{decision.body}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="outcomes">
            <h2 data-reveal className={H2}>
              {copy.outcomesLabel}
            </h2>
            <dl
              data-reveal
              style={stagger(1)}
              className="hairline-grid mt-8 grid-cols-2 overflow-hidden rounded-lg border border-line md:grid-cols-4"
            >
              {study.outcomes.map((outcome) => (
                <div key={outcome.label} className="flex flex-col-reverse justify-end gap-2 bg-ink-800 p-5 md:p-6">
                  <dt className="text-caption text-bone-52">{outcome.label}</dt>
                  {outcome.value && (
                    <dd className="tabular font-mono text-h2 text-bone">{outcome.value}</dd>
                  )}
                </div>
              ))}
            </dl>

            {study.highlights && (
              <div data-reveal className="mt-16 grid gap-5 md:mt-20 lg:grid-cols-[4fr_8fr] lg:gap-16">
                <h2 className={H2}>{copy.highlightsLabel}</h2>
                <HighlightList highlights={study.highlights} />
              </div>
            )}
          </Section>

          {reviews.length > 0 && (
            <Section id="review" tone="ink-800">
              <h2 data-reveal className={H2}>
                {copy.reviewLabel}
              </h2>
              <div className="review-grid mt-8">
                <ul className="review-list">
                  {reviews.map((review) => (
                    <li key={review.id} data-reveal className="review-slot">
                      <ReviewCard review={review} locale={locale} />
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          )}

          <Section id="lessons" tone={reviews.length > 0 ? "ink-900" : "ink-800"}>
            <div data-reveal className="grid gap-5 lg:grid-cols-[4fr_8fr] lg:gap-16">
              <h2 className={H2}>{copy.lessonsLabel}</h2>
              <ul className="flex max-w-[64ch] flex-col border-t border-line">
                {study.lessons.map((lesson) => (
                  <li key={lesson} className="flex gap-4 border-b border-line py-4 text-body-l text-bone">
                    <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-bone-52" />
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </article>

        <Section id="next" tone="ink-900" className="band text-bone" border={false}>
          <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div data-reveal>
              <h2 className="text-display-l">{copy.ctaHeadline}</h2>
              <p className="mt-5 max-w-[46ch] text-body-l text-bone-70">{copy.ctaBody}</p>
              <a
                href={whatsappWith(whatsapp.url, study.message)}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-md bg-copper px-5 font-semibold text-on-copper transition-colors duration-fast ease-fast hover:bg-copper-bright active:bg-copper-dim"
                {...trackAttrs("contact_channel_click", {
                  channel_id: whatsapp.id,
                  channel_label: copy.ctaLabel,
                  channel_placement: "case_study",
                })}
              >
                {copy.ctaLabel}
                <span aria-hidden className="rtl:-scale-x-100">
                  →
                </span>
                {external}
              </a>
            </div>

            {services.length > 0 && (
              <div data-reveal style={stagger(1)}>
                <h3 className="eyebrow text-bone-52">{copy.servicesLabel}</h3>
                <ul className="mt-4 border-t border-line">
                  {services.map((service) => (
                    <li key={service.id} className="border-b border-line">
                      <a
                        href={localePath(locale, servicePath(service.slug))}
                        className="flex min-h-12 items-center justify-between gap-4 py-3 text-body text-bone transition-colors duration-fast ease-fast hover:text-bone-70"
                        {...trackAttrs("service_page_click", {
                          service_id: service.id,
                          link_text: service.title,
                          nav_location: "case_study_page",
                        })}
                      >
                        {service.title}
                        <span aria-hidden className="text-bone-52 rtl:-scale-x-100">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {related.length > 0 && (
            <div data-reveal className="mt-16 border-t border-line pt-8 md:mt-20">
              <h3 className="eyebrow text-bone-52">{copy.relatedLabel}</h3>
              <ul className="hairline-grid mt-5 overflow-hidden rounded-lg border border-line md:grid-cols-3">
                {related.map((item) => {
                  const relatedName = projectNames(item.project.title).name;
                  return (
                    <li key={item.study.slug} className="bg-ink-700">
                      <a
                        href={localePath(locale, caseStudyPath(item.study.slug))}
                        className="flex h-full flex-col gap-2 p-6 transition-colors duration-fast ease-fast hover:bg-ink-600"
                        {...trackAttrs("case_study_click", {
                          ...projectParams(item.project, "related"),
                          link_text: relatedName,
                        })}
                      >
                        <span className="text-caption text-bone-52">
                          {item.project.country} · {item.project.category}
                        </span>
                        <span className="text-h3">{relatedName}</span>
                        <span className="text-body text-bone-70">{item.study.headline}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Section>
      </main>

      <Footer locale={locale} />
      <RevealObserver />
    </>
  );
}
