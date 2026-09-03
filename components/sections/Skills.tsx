import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { skillGroups } from "@/content/skills";
import { skillsCopy } from "@/content/copy";

/**
 * 4/7 split. Each capability is its own chip rather than a run-on string — the
 * Flutter version rendered these as one dot-separated line per group, which was
 * the flattest thing on the page.
 */
export function Skills() {
  return (
    <Section id="skills" tone="ink-800">
      <div className="grid gap-14 md:grid-cols-11 md:gap-16">
        <div className="md:col-span-4">
          <Reveal>
            <Eyebrow>{skillsCopy.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h1">{skillsCopy.headline}</h2>
            <p className="mt-6 max-w-[46ch] text-body text-bone-70">{skillsCopy.blurb}</p>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <dl className="hairline-grid border border-line">
            {skillGroups.map((group, i) => (
              <Reveal key={group.label} delay={Math.min(i * 0.05, 0.25)}>
                <div className="bg-ink-800 p-6 md:p-7">
                  <dt
                    className={`eyebrow ${group.highlighted ? "text-copper" : "text-bone-52"}`}
                  >
                    {group.label}
                  </dt>
                  <dd className="mt-4 flex flex-wrap gap-x-2 gap-y-2.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-sm border border-line bg-ink-700 px-2.5 py-1.5 text-[0.8125rem] text-bone-70"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
