import { stagger } from "@/lib/motion";
import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";
import { getProfile } from "@/content/profile-i18n";
import { sectionNumber } from "@/content/site";
import { findService } from "@/content/services-i18n";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProcessSteps, WorkModels } from "@/components/sections/ServiceParts";
import { trackAttrs } from "@/lib/analytics/attrs";
import { localePath, servicePath, whatsappWith } from "@/lib/paths";
import { proofHref } from "@/lib/proof";

/**
 * What a client can hire for, how they can engage, and what happens after the
 * first message. The first section after the hero: the offer comes before the
 * work and the reviews that back it.
 *
 * Each offer answers, in order: who it is for, what it includes, where it was
 * done before, and how to ask about it. The ask opens WhatsApp with a first
 * line already written for that offer. An offer with its own page links to it
 * from its title and its Details link.
 *
 * No copper here: the hero's WhatsApp button holds the copper fill and can
 * share this viewport.
 */
export function Services({ locale = "en" }: LocaleProps) {
  const { servicesCopy, servicePageCopy } = getCopy(locale);
  const copy = ui[locale];
  const { channels } = getProfile(locale);
  const whatsapp = channels.find((c) => c.id === "whatsapp")!;
  const external = <span className="sr-only">{copy.external}</span>;

  return (
    <Section id="services" tone="ink-800">
      <div className="grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index={sectionNumber("services")}>{servicesCopy.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-l">{servicesCopy.headline}</h2>
          <p className="mt-5 max-w-[36ch] text-body text-bone-70">{servicesCopy.blurb}</p>
          <a
            href={whatsappWith(whatsapp.url, servicesCopy.ctaMessage)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-md border border-line-strong px-5 font-medium text-bone transition-colors duration-fast ease-fast hover:border-bone"
            {...trackAttrs("contact_channel_click", {
              channel_id: whatsapp.id,
              channel_label: servicesCopy.ctaLabel,
              channel_placement: "services",
            })}
          >
            {servicesCopy.ctaLabel}
            <span aria-hidden className="rtl:-scale-x-100">
              →
            </span>
            {external}
          </a>
        </div>

        <ul data-reveal style={stagger(1)} className="hairline-grid overflow-hidden rounded-lg border border-line sm:grid-cols-2">
          {servicesCopy.offers.map((offer) => {
            const page = findService(offer.id, locale);
            const pageHref = page && localePath(locale, servicePath(page.slug));
            return (
              <li key={offer.id} className="flex flex-col bg-ink-700 p-6 md:p-7">
                <h3 className="text-[1.0625rem] leading-snug font-semibold">
                  {pageHref ? (
                    <a
                      href={pageHref}
                      className="underline decoration-transparent underline-offset-4 transition-colors duration-fast ease-fast hover:decoration-bone"
                      {...trackAttrs("service_page_click", {
                        service_id: offer.id,
                        link_text: offer.title,
                        nav_location: "services_section",
                      })}
                    >
                      {offer.title}
                    </a>
                  ) : (
                    offer.title
                  )}
                </h3>
                <p className="mt-1.5 text-caption text-bone-52">{offer.audience}</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone-70">{offer.body}</p>

                <p className="eyebrow mt-5 text-bone-52">{servicesCopy.includesLabel}</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-[0.875rem] leading-snug text-bone">
                  {offer.includes.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.6em] h-px w-2.5 shrink-0 bg-bone-52" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <p className="border-t border-line pt-4 text-caption text-bone-52">
                    {servicesCopy.proofLabel}{" "}
                    {offer.proof.map((p, i) => (
                      <span key={p.target}>
                        {i > 0 && <span aria-hidden> · </span>}
                        <a
                          href={proofHref(locale, p.target, { onHome: true })}
                          className="text-bone-70 underline decoration-line-strong underline-offset-4 transition-colors duration-fast ease-fast hover:text-bone hover:decoration-bone"
                          {...trackAttrs("service_proof_click", {
                            service_id: offer.id,
                            link_target: p.target,
                            link_text: p.name,
                          })}
                        >
                          <bdi>{p.name}</bdi>
                        </a>
                      </span>
                    ))}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6">
                    <a
                      href={whatsappWith(whatsapp.url, offer.message)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-bone transition-colors duration-fast ease-fast hover:text-bone-70"
                      {...trackAttrs("contact_channel_click", {
                        channel_id: whatsapp.id,
                        channel_label: servicesCopy.askLabel,
                        channel_placement: "services",
                        service_id: offer.id,
                      })}
                    >
                      {servicesCopy.askLabel}
                      <span aria-hidden className="rtl:-scale-x-100">
                        →
                      </span>
                      {external}
                    </a>
                    {pageHref && (
                      <a
                        href={pageHref}
                        className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-bone-70 transition-colors duration-fast ease-fast hover:text-bone"
                        {...trackAttrs("service_page_click", {
                          service_id: offer.id,
                          link_text: servicePageCopy.detailsLabel,
                          nav_location: "services_section",
                        })}
                      >
                        {servicePageCopy.detailsLabel}
                        <span aria-hidden className="rtl:-scale-x-100">
                          →
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div data-reveal style={stagger(2)} className="mt-16 md:mt-20">
        <h3 className="eyebrow text-bone-52">{servicesCopy.modelsLabel}</h3>
        <WorkModels locale={locale} placement="services" />
      </div>

      <div data-reveal style={stagger(3)} className="mt-16 md:mt-20">
        <h3 className="eyebrow text-bone-52">{servicesCopy.processLabel}</h3>
        <ProcessSteps locale={locale} />
      </div>
    </Section>
  );
}
