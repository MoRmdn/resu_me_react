import { stagger } from "@/lib/motion";
import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";
import { getProfile } from "@/content/profile-i18n";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { trackAttrs } from "@/lib/analytics/attrs";

/** A WhatsApp link that opens the chat with the visitor's first line written. */
function whatsappWith(url: string, message: string) {
  return `${url}?text=${encodeURIComponent(message)}`;
}

/**
 * What a client can hire for, how they can engage, and what happens after the
 * first message. Sits directly above Contact, so the process ends where the
 * channels begin.
 *
 * Each offer answers, in order: who it is for, what it includes, where it was
 * done before (links into this page), and how to ask about it. The ask opens
 * WhatsApp with a first line already written for that offer.
 *
 * No copper here: Contact's WhatsApp cell holds the copper fill and can share
 * this viewport. The steps are an ordered list with no visible numbers,
 * because Ledger numbering belongs to the section eyebrows alone.
 */
export function Services({ locale = "en" }: LocaleProps) {
  const { servicesCopy } = getCopy(locale);
  const copy = ui[locale];
  const { channels } = getProfile(locale);
  const whatsapp = channels.find((c) => c.id === "whatsapp")!;
  const external = <span className="sr-only">{copy.external}</span>;

  return (
    <Section id="services" tone="ink-800">
      <div className="grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index={6}>{servicesCopy.eyebrow}</Eyebrow>
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
          {servicesCopy.offers.map((offer) => (
            <li key={offer.id} className="flex flex-col bg-ink-700 p-6 md:p-7">
              <h3 className="text-[1.0625rem] leading-snug font-semibold">{offer.title}</h3>
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
                        href={`#${p.target}`}
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
                <a
                  href={whatsappWith(whatsapp.url, offer.message)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-bone transition-colors duration-fast ease-fast hover:text-bone-70"
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
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div data-reveal style={stagger(2)} className="mt-16 md:mt-20">
        <h3 className="eyebrow text-bone-52">{servicesCopy.modelsLabel}</h3>
        <ul className="hairline-grid mt-5 overflow-hidden rounded-lg border border-line md:grid-cols-3">
          {servicesCopy.models.map((model) => (
            <li key={model.id} className="flex flex-col bg-ink-900 p-6">
              <p className="text-[1.0625rem] leading-snug font-semibold">{model.title}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-bone-70">{model.body}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                {model.channels.map((id) => {
                  const channel = channels.find((c) => c.id === id)!;
                  const isExternal = channel.url.startsWith("http");
                  return (
                    <li key={id}>
                      <a
                        href={channel.url}
                        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-[0.875rem] text-bone transition-colors duration-fast ease-fast hover:border-bone"
                        {...trackAttrs("contact_channel_click", {
                          channel_id: channel.id,
                          channel_label: channel.label,
                          channel_placement: "services",
                        })}
                      >
                        {channel.label}
                        <span aria-hidden className={isExternal ? "text-bone-52" : "text-bone-52 rtl:-scale-x-100"}>
                          {isExternal ? "↗" : "→"}
                        </span>
                        {isExternal && external}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div data-reveal style={stagger(3)} className="mt-16 md:mt-20">
        <h3 className="eyebrow text-bone-52">{servicesCopy.processLabel}</h3>
        <ol className="mt-5 grid gap-x-8 gap-y-8 border-line sm:grid-cols-2 lg:grid-cols-4 lg:border-t">
          {servicesCopy.steps.map((step) => (
            <li
              key={step.title}
              // A short bone tick on the hairline marks where each step starts:
              // a track, not a numbered list. One shared line across the row
              // at four columns; below that, each step carries its own.
              className="relative flex flex-col border-t border-line pt-6 before:absolute before:-top-px before:start-0 before:h-0.5 before:w-8 before:bg-bone before:content-[''] lg:border-t-0"
            >
              <p className="text-[1.0625rem] leading-snug font-semibold">{step.title}</p>
              <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-bone-70">{step.body}</p>
              <p className="mt-auto pt-4 text-caption">
                <span className="text-bone-52">{servicesCopy.youGetLabel}: </span>
                <span className="text-bone">{step.deliverable}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
