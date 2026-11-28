import { MoRmdnMark } from "@/components/brand/MoRmdnMark";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ui } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { channels } from "@/content/site";
import type { ServiceId } from "@/content/types";
import { trackAttrs } from "@/lib/analytics/attrs";
import { homePath, whatsappWith } from "@/lib/paths";

/**
 * The header of every page below the homepage: the name back home, the other
 * language of this same page, the theme, and a way to start a project.
 *
 * The homepage's nav island is built around its section anchors, so these
 * pages get this plain bar instead. The WhatsApp link is a hairline button,
 * never copper: the page's own call to action holds the viewport's copper.
 *
 * `id="top"` is what the footer's Back to top lands on.
 */
export function SubpageHeader({
  locale,
  path,
  message,
  serviceId,
}: {
  locale: Locale;
  /** This page under the locale root, for the language switch. */
  path: string;
  /** Prefills the WhatsApp chat. */
  message: string;
  serviceId?: ServiceId;
}) {
  const copy = ui[locale];
  const whatsapp = channels.find((c) => c.id === "whatsapp")!;
  return (
    <header id="top" className="border-b border-line bg-ink-900">
      <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a
          href={homePath(locale)}
          aria-label={`${copy.name}, ${copy.home}`}
          className="inline-flex min-h-11 items-center gap-2.5 text-[0.9375rem] font-semibold text-bone"
          {...trackAttrs("nav_link_click", {
            link_target: "home",
            link_text: copy.name,
            nav_location: "page_header",
          })}
        >
          <MoRmdnMark size={22} />
          <span className="hidden min-[400px]:inline">{copy.name}</span>
        </a>

        <div className="flex items-center gap-1">
          <LanguageSwitch locale={locale} path={path} className="rounded-md px-3 hover:bg-bone-06" />
          <ThemeToggle
            locale={locale}
            className="grid size-11 shrink-0 place-items-center rounded-md text-bone transition-colors duration-fast ease-fast hover:bg-bone-06"
          />
          <a
            href={whatsappWith(whatsapp.url, message)}
            target="_blank"
            rel="noreferrer noopener"
            className="ms-1 inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong px-4 text-[0.875rem] font-medium whitespace-nowrap text-bone transition-colors duration-fast ease-fast hover:border-bone"
            {...trackAttrs("contact_channel_click", {
              channel_id: whatsapp.id,
              channel_label: copy.whatsapp,
              channel_placement: "page_header",
              ...(serviceId ? { service_id: serviceId } : {}),
            })}
          >
            {copy.whatsapp}
            <span className="sr-only">{copy.external}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
