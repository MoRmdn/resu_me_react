import type { LocaleProps } from "@/content/locale";
import { getCopy } from "@/content/copy-i18n";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSkills } from "@/content/profile-i18n";

export function Skills({ locale = "en" }: LocaleProps) {
  const { skillsCopy } = getCopy(locale);
  const skillGroups = getSkills(locale);
  return (
    <Section id="skills" tone="ink-800" z={18} offset={64}>
      <div className="mb-8 grid items-end gap-6 md:mb-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <div>
          <Eyebrow>{skillsCopy.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-l">{skillsCopy.headline}</h2>
        </div>
        <p className="max-w-[46ch] text-body text-bone-70">{skillsCopy.blurb}</p>
      </div>

      <div className="border-t border-line">
        {skillGroups.map((group) => (
          <div key={group.label} className="grid gap-3 border-b border-line py-5 md:grid-cols-[1fr_2fr] md:items-baseline md:gap-8">
            <h3 className="text-h3">{group.label}</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-caption text-bone-70">
              {group.items.map((item) => (
                <li key={item}><bdi>{item}</bdi></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
