import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { about } from "@/content/copy";
import { education } from "@/content/site";

/**
 * 4/7 asymmetric split. The stat grid uses the hairline-grid pattern: a
 * line-coloured container showing through 1px gaps between ink-filled cells.
 */
export function About() {
  return (
    <Section id="about" tone="ink-900">
      <div className="grid gap-14 md:grid-cols-11 md:gap-16">
        <div className="md:col-span-4">
          <Reveal>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h1 text-balance">
              {about.headline.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-10 border-t border-line">
              {education.map((item) => (
                <li
                  key={item}
                  className="border-b border-line py-3.5 font-mono text-[0.78125rem] leading-relaxed text-bone-52"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal>
            <p className="max-w-[46ch] text-h3 font-normal text-bone">{about.lede}</p>
          </Reveal>

          {about.body.map((para, i) => (
            <Reveal key={i} delay={0.06 * (i + 1)}>
              <p className="mt-6 max-w-[62ch] text-body text-bone-70">
                {renderWithCode(para)}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <dl className="hairline-grid mt-12 grid-cols-2 border border-line lg:grid-cols-4">
              {about.stats.map((stat, i) => (
                <div key={stat.label} className="bg-ink-900 p-6">
                  <dd
                    className={`text-[1.625rem] font-semibold tracking-[-0.03em] ${
                      i === 0 ? "text-copper" : "text-bone"
                    }`}
                  >
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-caption text-bone-52">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/** Renders `backticked` spans as mono, the way the Flutter copy did for main.dart. */
function renderWithCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="font-mono text-[0.9em] text-bone">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}
