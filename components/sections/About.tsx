import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { getProfile } from "@/content/profile-i18n";
import { trackAttrs } from "@/lib/analytics/attrs";

/**
 * Ledger 4/7 split: the record on the left (title, credentials, what is being
 * learned now), the story and the four figures on the right.
 */
export function About({ locale = "en" }: LocaleProps) {
  const { about, learning } = getCopy(locale);
  const copy = ui[locale];
  const { education, learningNow } = getProfile(locale);
  return (
    <Section id="about" tone="ink-900">
      <div className="grid gap-14 lg:grid-cols-[4fr_7fr] lg:gap-16">
        <div className="flex flex-col gap-10">
          <div>
            <Eyebrow index={1}>{about.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-display-l">{about.headline.join(" ")}</h2>
          </div>

          <div>
            <p className="eyebrow text-bone-52">{copy.credentials}</p>
            <ul className="mt-3 border-t border-line">
              {education.map((item) => (
                <li key={item} className="border-b border-line py-3 text-[0.875rem] leading-normal text-bone-70">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* The move into front-end work. Kept apart from Credentials so an
              in-progress course is never mistaken for a finished one. */}
          <div className="rounded-lg border border-line bg-ink-700 p-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
              <p className="eyebrow text-bone-52">{learning.eyebrow}</p>
              <p className="font-mono text-[0.75rem] text-bone-52 tabular">{learningNow.period}</p>
            </div>

            <dl className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-[7rem_1fr] gap-4">
                <dt className="eyebrow pt-0.5 text-bone-52">{learning.completedLabel}</dt>
                <dd className="text-caption text-bone">
                  {learningNow.completed.map((c) => (
                    <span key={c.title} className="block">
                      {c.title} <span className="text-bone-52">· {c.provider}</span>
                    </span>
                  ))}
                </dd>
              </div>

              <div className="grid grid-cols-[7rem_1fr] gap-4">
                <dt className="eyebrow pt-0.5 text-bone-52">{learning.inProgressLabel}</dt>
                <dd className="text-caption text-bone">
                  {learningNow.inProgress.map((c) => (
                    <span key={c.title} className="flex items-center gap-2">
                      {c.title}
                      <span className="size-1.5 rounded-full bg-jade" aria-hidden />
                    </span>
                  ))}
                </dd>
              </div>

              <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line pt-4">
                <dt className="eyebrow pt-3 text-bone-52">{learning.builtLabel}</dt>
                <dd className="text-caption">
                  <a
                    href={learningNow.built.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-11 items-center gap-1 text-bone underline decoration-line-strong underline-offset-4 transition-colors duration-fast ease-fast hover:decoration-bone"
                    {...trackAttrs("about_link_click", {
                      link_text: learningNow.built.title,
                      link_url: learningNow.built.href,
                    })}
                  >
                    {learningNow.built.title} <span aria-hidden className="rtl:-scale-x-100">&#8599;</span>
                    <span className="sr-only">{copy.external}</span>
                  </a>
                  <span className="block text-bone-52">{learningNow.built.note}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <p className="wide max-w-[30ch] text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.3] font-medium tracking-[-0.02em]">
            {about.lede}
          </p>
          {about.body.map((para, i) => (
            <p key={i} className="mt-5 max-w-[62ch] text-body text-bone-70 first-of-type:mt-7">
              {renderWithCode(para)}
            </p>
          ))}

          <dl className="hairline-grid mt-11 grid-cols-2 overflow-hidden rounded-lg border border-line sm:grid-cols-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col bg-ink-700 p-5">
                <dt className="order-last mt-1.5 text-[0.8125rem] leading-snug text-bone-52">{stat.label}</dt>
                <dd className="font-mono text-[1.75rem] leading-none font-medium tracking-[-0.03em] tabular">
                  <bdi dir="ltr">{stat.value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

/** Renders `backticked` spans as mono, the way the source copy marks main.dart. */
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
