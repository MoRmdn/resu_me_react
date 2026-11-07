"use client";
import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";

import { MoRmdnMark } from "@/components/brand/MoRmdnMark";
import { site } from "@/content/site";

import { trackAttrs } from "@/lib/analytics/attrs";
import { useViews } from "@/lib/useViews";

export function Footer({ locale = "en" }: LocaleProps) {
  const { footerCopy } = getCopy(locale);
  const copy = ui[locale];
  const views = useViews();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[22] border-t border-line bg-ink-800">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-8 font-mono text-[0.71875rem] tracking-[0.12em] text-bone-52 md:px-8">
        <p className="flex items-center gap-2.5">
          <MoRmdnMark size={16} />
          {site.shortName} &copy; {year} &middot; {footerCopy.builtWith}
        </p>

        <p className="tabular">
          {site.designCodename} {site.designVersion}
          {views !== null && (
            <>
              {" "}
              &middot; {views.toLocaleString()} {copy.views}
            </>
          )}
        </p>

        <div className="flex items-center gap-6">
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
            {footerCopy.backToTop} &uarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
