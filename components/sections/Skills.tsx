import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { skillGroups } from "@/content/skills";
import { skillsCopy } from "@/content/copy";

/**
 * Six numbered plates on the 7/5 split, replacing v1's flat hairline table.
 *
 * Every second plate indents (see `.plate` in globals.css) so the stack reads
 * as a stagger rather than a list. Group 01 spends the section's single Tier 2
 * copper on its label; no other plate is accented. The oversized index numeral is bone at 10% — decorative,
 * below the contrast floor by design, and hidden from assistive tech.
 */
export function Skills() {
  return (
    <Section id="skills" tone="ink-800" z={18} offset={112}>
      <div className="mb-16 grid items-end gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div>
          <Eyebrow>{skillsCopy.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-display-l">{skillsCopy.headline}</h2>
        </div>
        <p className="max-w-[46ch] text-body text-bone-70">{skillsCopy.blurb}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {skillGroups.map((group, i) => (
          <div
            key={group.label}
            className="plate rounded-lg bg-ink-700 p-7 elevation-card transition-[border-color,background-color] duration-fast ease-fast hover:border-copper/35 hover:bg-ink-600 md:p-[30px_34px]"
            style={{ "--plate-delay": `${Math.min(i * 0.06, 0.3)}s` } as React.CSSProperties}
          >
            <div className="grid items-start gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
              <div className="flex items-start gap-6.5">
                <span
                  aria-hidden
                  className="hidden shrink-0 font-mono text-[3.5rem] leading-[0.9] text-bone-10 tabular sm:block"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2.5 pt-1.5">
                  <h3
                    className={`font-mono text-[clamp(1.125rem,2.2vw,1.625rem)] leading-tight tracking-[-0.01em] ${
                      group.highlighted ? "text-copper" : "text-bone"
                    }`}
                  >
                    {group.label}
                  </h3>
                  <p className="eyebrow text-bone-52">{group.items.length} capabilities</p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-1.5 pt-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-sm border border-line px-2.5 py-1.5 text-[0.8125rem] text-bone-70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
