import { JsonLd } from "@/components/JsonLd";
import { SubpageHeader } from "@/components/SubpageHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { Footer } from "@/components/sections/Footer";
import { ProcessSteps, WorkModels } from "@/components/sections/ServiceParts";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { Section } from "@/components/ui/Section";
import { getCopy, ui } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { reviews as allReviews, selectedReviews } from "@/content/reviews";
import { findService, getService } from "@/content/services-i18n";
import { channels } from "@/content/site";
import type { Service } from "@/content/types";
import { trackAttrs } from "@/lib/analytics/attrs";
import { stagger } from "@/lib/motion";
import { homePath, localePath, servicePath, whatsappWith } from "@/lib/paths";
import { proofHref, proofKind } from "@/lib/proof";
import { serviceGraph } from "@/lib/structured-data";

/** Section headings below the H1 stay at normal width: wide type at 24px reads as squashed. */
const H2 = "text-h2 [font-variation-settings:normal]";
const LEAD_REVIEWS = 6;

/** A dash-marked list, the same mark the homepage offers use. */
function DashList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={className ?? "mt-3 flex flex-col gap-2 text-body text-bone"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-bone-52" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One service, at /services/<slug>/. The order follows the service pages of
 * LeanCode and Netguru: who it is for, the situations a client recognises,
 * what is included and delivered, where it was done before, what clients said
 * about that kind of work, how a project runs, the questions that come up, and
 * what is deliberately not promised.
 *
 * The hero's WhatsApp button holds the first viewport's copper; the final band
 * holds the last one's. The header's link is a hairline button for that reason.
 */
export default function ServicePage({ slug, locale }: { slug: string; locale: Locale }) {
  const { servicePageCopy: copy, servicesCopy } = getCopy(locale);
  const service = getService(slug, locale);
  const whatsapp = channels.find((c) => c.id === "whatsapp")!;
  const external = <span className="sr-only">{ui[locale].external}</span>;
  const cta = whatsappWith(whatsapp.url, service.message);

  const crumbs: Crumb[] = [
    { label: copy.homeLabel, href: homePath(locale), target: "home" },
    { label: copy.servicesLabel, href: `${homePath(locale)}#services`, target: "services" },
    { label: service.title, target: service.slug },
  ];

  // The lead reviews first, in their order; the rest in the order of reviews.json.
  const matching = allReviews.filter((r) => service.reviewProjects?.includes(r.project));
  const lead = selectedReviews(service.leadReviewIds ?? []).slice(0, LEAD_REVIEWS);
  const rest = matching.filter((r) => !lead.some((l) => l.id === r.id));
  const related = service.related
    .map((id) => findService(id, locale))
    .filter((s): s is Service => Boolean(s));

  return (
    <>
      <JsonLd
        data={serviceGraph(service, locale, [
          { name: copy.homeLabel, path: "" },
          { name: copy.servicesLabel, path: "#services" },
          { name: service.title },
        ])}
      />
      <SubpageHeader
        locale={locale}
        path={servicePath(service.slug)}
        message={service.message}
        serviceId={service.id}
      />

      <main id="main">
        <section id="service" className="relative w-full bg-ink-900 pt-6 pb-20 md:pt-8 md:pb-24">
          <div className="mx-auto w-full max-w-content px-5 md:px-8">
            <Breadcrumb locale={locale} items={crumbs} />
            <div className="mt-10 grid items-end gap-10 md:mt-14 lg:grid-cols-[7fr_5fr] lg:gap-16">
              <div>
                <Eyebrow>{copy.groupLabels[service.group]}</Eyebrow>
                <h1 className="rise-lcp mt-4 text-display-l">{service.headline}</h1>
                {/* No entrance: as large as the H1, it can be the LCP too. */}
                <p className="mt-6 max-w-[58ch] text-body-l text-bone-70">{service.summary}</p>
                {/* Who is behind the page, for a visitor who landed here first. */}
                <a
                  href={`${homePath(locale)}#reviews`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-caption text-bone-70 underline decoration-line-strong underline-offset-4 transition-colors duration-fast ease-fast hover:text-bone hover:decoration-bone"
                  {...trackAttrs("nav_link_click", {
                    link_target: "reviews",
                    link_text: ui[locale].proof,
                    nav_location: "service_page",
                  })}
                >
                  {ui[locale].proof}
                  <span aria-hidden className="rtl:-scale-x-100">
                    →
                  </span>
                </a>
              </div>
              {/* No fade: the WhatsApp button is on screen from the first frame. */}
              <div className="rise-lcp lg:pb-2">
                <p className="text-caption text-bone-52">{service.audience}</p>
                <p className="mt-2 text-body text-bone">{service.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={cta}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-12 items-center gap-2.5 rounded-md bg-copper px-5 font-semibold text-on-copper transition-colors duration-fast ease-fast hover:bg-copper-bright active:bg-copper-dim"
                    {...trackAttrs("contact_channel_click", {
                      channel_id: whatsapp.id,
                      channel_label: copy.ctaLabel,
                      channel_placement: "service_page",
                      service_id: service.id,
                    })}
                  >
                    {copy.ctaLabel}
                    <span aria-hidden className="rtl:-scale-x-100">
                      →
                    </span>
                    {external}
                  </a>
                  <a
                    href="#proof"
                    className="inline-flex min-h-12 items-center rounded-md border border-line-strong px-5 font-medium text-bone transition-colors duration-fast ease-fast hover:border-bone"
                    {...trackAttrs("nav_link_click", {
                      link_target: "proof",
                      link_text: copy.seeWorkLabel,
                      nav_location: "service_page",
                    })}
                  >
                    {copy.seeWorkLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section id="situations" tone="ink-800">
          <h2 data-reveal className={H2}>
            {copy.situationsLabel}
          </h2>
          <ul
            data-reveal
            style={stagger(1)}
            className="hairline-grid mt-8 overflow-hidden rounded-lg border border-line sm:grid-cols-2"
          >
            {service.situations.map((situation) => (
              <li key={situation.title} className="bg-ink-700 p-6 md:p-7">
                <h3 className="text-h3">{situation.title}</h3>
                <p className="mt-3 text-body text-bone-70">{situation.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="included">
          <div className="grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-16">
            <h2 data-reveal className={`${H2} lg:sticky lg:top-12 lg:self-start`}>
              {copy.scopeLabel}
            </h2>
            <div data-reveal style={stagger(1)} className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {service.scope.map((group) => (
                <div key={group.title} className="border-t border-line pt-5">
                  <h3 className="text-[1.0625rem] leading-snug font-semibold">{group.title}</h3>
                  <DashList items={group.items} />
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="mt-16 grid gap-5 md:mt-20 lg:grid-cols-[4fr_8fr] lg:gap-16">
            <h2 className={H2}>{copy.deliverablesLabel}</h2>
            <DashList
              items={service.deliverables}
              className="flex max-w-[60ch] flex-col gap-3 text-body-l text-bone"
            />
          </div>
        </Section>

        <Section id="proof" tone="ink-800">
          <h2 data-reveal className={H2}>
            {copy.proofLabel}
          </h2>
          <ul
            data-reveal
            style={stagger(1)}
            className="hairline-grid mt-8 overflow-hidden rounded-lg border border-line sm:grid-cols-2"
          >
            {service.proof.map((proof) => (
              <li key={proof.name} className="flex flex-col bg-ink-700 p-6 md:p-7">
                <h3 className="text-h3">
                  <bdi>{proof.name}</bdi>
                </h3>
                <p className="mt-3 text-body text-bone-70">{proof.note}</p>
                <a
                  href={proofHref(locale, proof.target)}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-[0.9375rem] font-medium text-bone transition-colors duration-fast ease-fast hover:text-bone-70"
                  {...trackAttrs("service_proof_click", {
                    service_id: service.id,
                    link_target: proof.target,
                    link_text: proof.name,
                  })}
                >
                  {copy.proofLinkLabel[proofKind(proof.target)]}
                  <span aria-hidden className="rtl:-scale-x-100">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {matching.length > 0 && (
          <Section id="reviews">
            <div data-reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
              <h2 className={H2}>{copy.reviewsLabel}</h2>
              <p className="text-caption text-bone-52">{copy.reviewsNote(matching.length)}</p>
            </div>
            <div className="review-grid mt-8">
              <ul className="review-list">
                {lead.map((review, i) => (
                  <li key={review.id} data-reveal style={stagger(i % 3)} className="review-slot">
                    <ReviewCard review={review} locale={locale} />
                  </li>
                ))}
              </ul>
              {rest.length > 0 && (
                <details className="reviews-more mt-6">
                  <summary
                    className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line-strong px-5 text-caption text-bone transition-colors duration-fast ease-fast hover:border-bone"
                    {...trackAttrs("reviews_expand", { toggle_action: "open" })}
                  >
                    <span className="when-closed">{copy.moreReviewsLabel(rest.length)}</span>
                    <span className="when-open">{copy.fewerReviewsLabel}</span>
                  </summary>
                  <ul className="review-list">
                    {rest.map((review) => (
                      <li key={review.id} className="review-slot">
                        <ReviewCard review={review} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </Section>
        )}

        <Section id="process" tone={matching.length > 0 ? "ink-800" : "ink-900"}>
          <div data-reveal>
            <h2 className={H2}>{servicesCopy.processLabel}</h2>
            <ProcessSteps locale={locale} />
          </div>
          <div data-reveal className="mt-16 md:mt-20">
            <h2 className={H2}>{servicesCopy.modelsLabel}</h2>
            <WorkModels locale={locale} placement="service_page" serviceId={service.id} message={service.message} />
          </div>
        </Section>

        <Section id="faq" tone={matching.length > 0 ? "ink-900" : "ink-800"}>
          <div className="grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-16">
            <h2 data-reveal className={`${H2} lg:sticky lg:top-12 lg:self-start`}>
              {copy.faqLabel}
            </h2>
            <div data-reveal style={stagger(1)}>
              <div className="border-t border-line">
                {service.faq.map((item) => (
                  <details key={item.id} className="faq group border-b border-line">
                    <summary
                      className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.0625rem] leading-snug font-semibold text-bone [&::-webkit-details-marker]:hidden"
                      {...trackAttrs("faq_toggle", {
                        service_id: service.id,
                        link_text: item.q,
                        toggle_action: "open",
                      })}
                    >
                      {item.q}
                      <span
                        aria-hidden
                        className="grid size-7 shrink-0 place-items-center rounded-sm border border-line text-base leading-none font-normal text-bone-52"
                      >
                        <span className="transition-transform duration-fast ease-fast group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="max-w-[64ch] pb-6 text-body text-bone-70">{item.a}</p>
                  </details>
                ))}
              </div>

              {service.boundaries && (
                <div className="mt-14">
                  <h3 className="eyebrow text-bone-52">{copy.boundariesLabel}</h3>
                  <DashList items={service.boundaries} className="mt-4 flex max-w-[64ch] flex-col gap-3 text-body text-bone" />
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section id="start" tone="ink-900" className="band text-bone" border={false}>
          <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div data-reveal>
              <h2 className="text-display-l">{copy.ctaHeadline}</h2>
              <p className="mt-5 max-w-[46ch] text-body-l text-bone-70">{servicesCopy.blurb}</p>
              <a
                href={cta}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-md bg-copper px-5 font-semibold text-on-copper transition-colors duration-fast ease-fast hover:bg-copper-bright active:bg-copper-dim"
                {...trackAttrs("contact_channel_click", {
                  channel_id: whatsapp.id,
                  channel_label: copy.ctaLabel,
                  channel_placement: "service_page",
                  service_id: service.id,
                })}
              >
                {copy.ctaLabel}
                <span aria-hidden className="rtl:-scale-x-100">
                  →
                </span>
                {external}
              </a>
            </div>

            {related.length > 0 && (
              <div data-reveal style={stagger(1)}>
                <h3 className="eyebrow text-bone-52">{copy.relatedLabel}</h3>
                <ul className="mt-4 border-t border-line">
                  {related.map((item) => (
                    <li key={item.id} className="border-b border-line">
                      <a
                        href={localePath(locale, servicePath(item.slug))}
                        className="flex min-h-12 items-center justify-between gap-4 py-3 text-body text-bone transition-colors duration-fast ease-fast hover:text-bone-70"
                        {...trackAttrs("service_page_click", {
                          service_id: item.id,
                          link_text: item.title,
                          nav_location: "service_page",
                        })}
                      >
                        {item.title}
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
        </Section>
      </main>

      <Footer locale={locale} />
      <RevealObserver />
    </>
  );
}
