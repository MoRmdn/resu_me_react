import { getCopy, ui } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { getProfile } from "@/content/profile-i18n";
import type { ServiceId } from "@/content/types";
import { trackAttrs } from "@/lib/analytics/attrs";
import { channelHref } from "@/lib/paths";

/**
 * The two blocks every service shares: the ways to work together and how a
 * project runs. Rendered by the homepage Services section and by each service
 * page, so the terms never differ between them. Callers supply the heading.
 */
export function WorkModels({
  locale,
  placement,
  serviceId,
  message,
}: {
  locale: Locale;
  placement: "services" | "service_page";
  serviceId?: ServiceId;
  /** The WhatsApp first line; a service page passes its own. */
  message?: string;
}) {
  const { servicesCopy, contactCopy } = getCopy(locale);
  const prefill = { ...contactCopy, whatsappMessage: message ?? contactCopy.whatsappMessage };
  const { channels } = getProfile(locale);
  const external = <span className="sr-only">{ui[locale].external}</span>;
  return (
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
                    href={channelHref(channel, prefill)}
                    {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-[0.875rem] text-bone transition-colors duration-fast ease-fast hover:border-bone"
                    {...trackAttrs("contact_channel_click", {
                      channel_id: channel.id,
                      channel_label: channel.label,
                      channel_placement: placement,
                      ...(serviceId ? { service_id: serviceId } : {}),
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
  );
}

/**
 * The steps are an ordered list with no visible numbers: Ledger numbering
 * belongs to the homepage section eyebrows alone. A short bone tick on the
 * hairline marks where each step starts.
 */
export function ProcessSteps({ locale }: { locale: Locale }) {
  const { servicesCopy } = getCopy(locale);
  return (
    <ol className="mt-5 grid gap-x-8 gap-y-8 border-line sm:grid-cols-2 lg:grid-cols-4 lg:border-t">
      {servicesCopy.steps.map((step) => (
        <li
          key={step.title}
          // One shared line across the row at four columns; below that, each
          // step carries its own.
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
  );
}
