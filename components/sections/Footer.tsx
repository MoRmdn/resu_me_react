"use client";
import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";

import { MoRmdnMark } from "@/components/brand/MoRmdnMark";
import { site } from "@/content/site";

import { trackAttrs } from "@/lib/analytics/attrs";
import { useViews } from "@/lib/useViews";

export function Footer({ locale = "en" }: LocaleProps) {
  const { footerCopy, hero } = getCopy(locale);
  const copy = ui[locale];
  const views = useViews({ increment: true });
  const year = new Date().getFullYear();

  return (
    <footer className="band border-t border-line bg-ink-900 text-bone">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-8 text-caption text-bone-52 md:px-8">
        <p className="flex items-center gap-2">
          <MoRmdnMark size={16} />
          {site.shortName} &copy; {year}
        </p>

        {views !== null && (
          <p className="tabular">
            <bdi>{views.toLocaleString("en")}</bdi> {copy.views}
          </p>
        )}

        <div className="flex items-center gap-6">
          <a
            href={hero.resumeCta.href}
            download
            className="min-h-11 py-3 transition-colors duration-fast ease-fast hover:text-bone"
            {...trackAttrs("resume_download", {
              file_name: hero.resumeCta.href.split("/").pop() ?? hero.resumeCta.href,
            })}
          >
            {hero.resumeCta.label}
          </a>
          <a
            href={footerCopy.privacyHref}
            className="min-h-11 py-3 transition-colors duration-fast ease-fast hover:text-bone"
            {...trackAttrs("nav_link_click", {
              link_target: "privacy",
              link_text: footerCopy.privacyLabel,
              nav_location: "footer",
            })}
          >
            {footerCopy.privacyLabel}
          </a>
          <a
            href="#top"
            className="min-h-11 py-3 transition-colors duration-fast ease-fast hover:text-bone"
            {...trackAttrs("nav_link_click", {
              link_target: "top",
              link_text: footerCopy.backToTop,
              nav_location: "footer",
            })}
          >
            {footerCopy.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
