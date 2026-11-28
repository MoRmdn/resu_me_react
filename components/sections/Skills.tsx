import { stagger } from "@/lib/motion";
import type { LocaleProps } from "@/content/locale";
import { getCopy } from "@/content/copy-i18n";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSkills } from "@/content/profile-i18n";
import { coreSkills } from "@/content/skills";
import { sectionNumber } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Ledger plates: the blurb on the left, one plate per group on the right.
 * Every second plate sits lower on wide screens so the grid reads laid by
 * hand; the core skills are the only filled chips.
 */
export function Skills({ locale = "en" }: LocaleProps) {
  const { skillsCopy } = getCopy(locale);
  const skillGroups = getSkills(locale);
  return (
    <Section id="skills" tone="ink-900">
      <div className="grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <div data-reveal>
          <Eyebrow index={sectionNumber("skills")}>{skillsCopy.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-display-l">{skillsCopy.headline}</h2>
          <p className="mt-5 max-w-[36ch] text-body text-bone-70">{skillsCopy.blurb}</p>
        </div>

        <ul className="grid items-start gap-4 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <li
              key={group.label}
              data-reveal
              style={stagger(i)}
              className={cn(
                "rounded-lg border border-line bg-ink-700 p-6",
                i % 2 === 1 && "sm:mt-10",
              )}
            >
              <h3 className="text-[1.0625rem] leading-snug font-semibold">{group.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5 text-[0.875rem]">
                {group.items.map((item) => {
                  const core = coreSkills.includes(item);
                  return (
                    <li
                      key={item}
                      className={cn(
                        "rounded-sm px-2.5 py-1",
                        core ? "bg-bone font-medium text-ink-900" : "border border-line-strong text-bone-70",
                      )}
                    >
                      <bdi>{item}</bdi>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
