import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { about, learning } from "@/content/copy";
import { education, learningNow } from "@/content/site";

/**
 * 7/5 split. The right column drops 80px below the left — the deliberate
 * asymmetry the design system asks for instead of two flush columns.
 */
export function About() {
  return (
    <Section id="about" tone="ink-900" z={12} offset={-1} border={false}>
      <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <Reveal>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-display-l text-balance">
              {about.headline.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="max-w-[46ch] text-body-l text-bone">{about.lede}</p>
          </Reveal>

          {about.body.map((para, i) => (
            <Reveal key={i} delay={0.06 * (i + 2)}>
              <p className="max-w-[62ch] text-body text-bone-70">{renderWithCode(para)}</p>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-11 lg:pt-20">
          <Reveal>
            <p className="eyebrow text-bone-52">Credentials</p>
            <ul className="mt-4">
              {education.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-3.5 border-t border-line py-3.5 font-mono text-[0.78125rem] leading-relaxed text-bone-70"
                >
                  <span aria-hidden className="text-bone-28">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="grid grid-cols-2 border-t border-l border-line">
              {about.stats.map((stat) => (
                <div key={stat.label} className="border-r border-b border-line p-5">
                  <dd className="text-[2.375rem] leading-none font-semibold tracking-[-0.03em] tabular">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-[0.75rem] leading-snug text-bone-52">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* September 2026 — the move into front-end work. Kept separate from
              Credentials above so an in-progress course is never mistaken for
              a finished one. */}
          <Reveal delay={0.14}>
            <div className="rounded-lg border border-line bg-ink-700 p-6">
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <p className="eyebrow text-bone-52">{learning.eyebrow}</p>
                <p className="eyebrow text-bone-52">{learningNow.period}</p>
              </div>

              <dl className="mt-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <dt className="eyebrow w-24 shrink-0 pt-1 text-bone-52">
                    {learning.completedLabel}
                  </dt>
                  <dd className="text-caption text-bone">
                    {learningNow.completed.map((c) => (
                      <span key={c.title} className="block">
                        {c.title} <span className="text-bone-52">· {c.provider}</span>
                      </span>
                    ))}
                  </dd>
                </div>

                <div className="flex gap-4">
                  <dt className="eyebrow w-24 shrink-0 pt-1 text-bone-52">
                    {learning.inProgressLabel}
                  </dt>
                  <dd className="text-caption text-bone">
                    {learningNow.inProgress.map((c) => (
                      <span key={c.title} className="flex items-center gap-2">
                        {c.title}
                        <span className="size-1.5 rounded-full bg-jade" aria-hidden />
                      </span>
                    ))}
                  </dd>
                </div>

                <div className="flex gap-4 border-t border-line pt-4">
                  <dt className="eyebrow w-24 shrink-0 pt-1 text-bone-52">
                    {learning.builtLabel}
                  </dt>
                  <dd className="text-caption">
                    <a
                      href={learningNow.built.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center text-bone underline decoration-line underline-offset-4 transition-colors duration-fast ease-fast hover:decoration-copper"
                    >
                      {learningNow.built.title} <span aria-hidden>&#8599;</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <span className="mt-1 block text-bone-52">{learningNow.built.note}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/** Renders `backticked` spans as mono, the way the source copy marks main.dart. */
function renderWithCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="font-mono text-[0.9em] text-bone-52">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}
