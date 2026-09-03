"use client";

import { MoRmdnMark } from "@/components/brand/MoRmdnMark";
import { site } from "@/content/site";
import { footerCopy } from "@/content/copy";
import { useViews } from "@/lib/useViews";

export function Footer() {
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
          {views !== null && <> &middot; {views.toLocaleString()} views</>}
        </p>

        <a
          href="#top"
          className="min-h-11 py-3 transition-colors duration-fast ease-fast hover:text-bone"
        >
          {footerCopy.backToTop} &uarr;
        </a>
      </div>
    </footer>
  );
}
