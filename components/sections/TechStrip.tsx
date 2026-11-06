import { Marquee } from "@/components/motion/Marquee";
import { marqueeItems } from "@/content/skills";

import type { LocaleProps } from "@/content/locale";
import { ui } from "@/content/copy-i18n";

export function TechStrip({ locale = "en" }: LocaleProps) {
  return (
    <div className="relative z-10 border-y border-line bg-ink-800">
      <Marquee
        label={ui[locale].technologies}
        items={marqueeItems}
        className="h-[54px] items-center py-4"
      />
    </div>
  );
}
