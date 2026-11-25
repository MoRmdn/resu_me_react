import { technologyStripItems } from "@/content/skills";

import type { LocaleProps } from "@/content/locale";
import { ui } from "@/content/copy-i18n";

export function TechStrip({ locale = "en" }: LocaleProps) {
  return (
    <div className="relative z-10 border-y border-line bg-ink-800">
      <ul aria-label={ui[locale].technologies} className="mx-auto flex max-w-content flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-caption text-bone-52 md:px-8">
        {technologyStripItems.map((item) => <li key={item}><bdi>{item}</bdi></li>)}
      </ul>
    </div>
  );
}
