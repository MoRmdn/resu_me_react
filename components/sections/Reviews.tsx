import { ClientMap } from "@/components/sections/ClientMap";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { PlatformMark } from "@/components/brand/PlatformMark";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { getCopy, ui } from "@/content/copy-i18n";
import type { LocaleProps } from "@/content/locale";
import { reviewPlatforms, reviews, initialReviewIds, selectedReviews } from "@/content/reviews";
import { trackAttrs } from "@/lib/analytics/attrs";

export function Reviews({ locale = "en" }: LocaleProps) {
  const { reviewsCopy } = getCopy(locale);
  const copy = ui[locale];
  const initial = selectedReviews(initialReviewIds);
  const remaining = reviews.filter((r) => !initialReviewIds.includes(r.id));
  return (
    <Section id="reviews" tone="ink-900" z={19} offset={-40} className="overflow-x-clip">
      <div className="mb-12 grid items-end gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <Reveal>
          <Eyebrow>{reviewsCopy.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-display-l text-balance">{reviewsCopy.headline}</h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="max-w-[46ch] text-body text-bone-70">{reviewsCopy.blurb}</p>
        </Reveal>
      </div>

      <Reveal>
        <ul className="hairline-grid grid-cols-2 overflow-hidden rounded-lg border border-line lg:grid-cols-5">
          {reviewPlatforms.map((platform) => (
            <li
              key={platform.id}
              data-platform={platform.id}
              className="group relative flex flex-col gap-5 bg-ink-700 p-5 transition-colors duration-fast ease-fast last:col-span-2 hover:bg-ink-600 lg:last:col-span-1"
            >
              <div className="flex h-6 items-center justify-between gap-2">
                <PlatformMark
                  platform={platform.id}
                  label={platform.label}
                  className="review-card__mark"
                />
                <span
                  aria-hidden
                  className="text-[0.75rem] text-bone-28 transition-transform duration-fast ease-fast group-hover:translate-x-0.5"
                >
                  &#8599;
                </span>
              </div>
              <div>
                <p className="text-metric text-bone">
                  <CountUp value={platform.count} />
                </p>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  // Stretched link: the whole cell is the target.
                  className="mt-2 inline-block text-caption text-bone-52 after:absolute after:inset-0 after:content-['']"
                  {...trackAttrs("review_platform_click", {
                    platform_id: platform.id,
                    platform_label: platform.label,
                    review_count: platform.count,
                  })}
                >
                  {locale === "ar"
                    ? platform.id === "upwork"
                      ? copy.completedJobs
                      : copy.reviews
                    : platform.countLabel}{" "}
                  · {reviewsCopy.scoreLabel}
                  <span className="sr-only">
                    {" "}
                    {copy.on} {platform.label} {copy.external}
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="review-grid mt-10">
        <ul className="review-list">
          {initial.map((review) => (
            <li key={review.id} className="review-slot">
              <ReviewCard review={review} locale={locale} />
            </li>
          ))}
        </ul>
        <details className="reviews-more mt-6">
          <summary
            className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line px-5 text-caption text-bone"
            {...trackAttrs("reviews_expand", { toggle_action: "open" })}
          >
            <span className="when-closed">{copy.moreReviews}</span>
            <span className="when-open">{copy.fewerReviews}</span>
          </summary>
          <ul className="review-list">
            {remaining.map((review) => (
              <li key={review.id} className="review-slot">
                <ReviewCard review={review} locale={locale} />
              </li>
            ))}
          </ul>
        </details>
      </div>
      <p className="mt-6 text-caption text-bone-52">{reviewsCopy.note}</p>

      <ClientMap locale={locale} />
    </Section>
  );
}
