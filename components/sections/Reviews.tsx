import { ClientMap } from "@/components/sections/ClientMap";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { ReviewLanguageToggle } from "@/components/ui/ReviewLanguageToggle";
import { PlatformMark } from "@/components/brand/PlatformMark";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { MarqueeToggle } from "@/components/motion/MarqueeToggle";
import { reviewsCopy } from "@/content/copy";
import { reviewPlatforms, reviews, type Review } from "@/content/reviews";
import { trackAttrs } from "@/lib/analytics/attrs";

const WALL_ID = "review-wall";

/** Alternating, so neither row ends up with one platform's reviews. */
const rows: { reviews: Review[]; duration: number; reverse?: boolean }[] = [
  { reviews: reviews.filter((_, i) => i % 2 === 0), duration: 260 },
  { reviews: reviews.filter((_, i) => i % 2 === 1), duration: 300, reverse: true },
];

/**
 * Two rows of review cards drifting in opposite directions, under a ledger of
 * the score on each platform.
 *
 * Only the first copy of each track is real content. It is plain server HTML,
 * so every quote is in the page source. The second copy exists to make the loop
 * seamless, so it is `aria-hidden` and `inert`, and it is dropped under reduced
 * motion, where the row becomes a scroller.
 *
 * No `Review` structured data: Google ignores reviews a person publishes about
 * themselves, and these already live on the platforms that collected them.
 */
export function Reviews() {
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
                  {platform.countLabel} · {reviewsCopy.scoreLabel}
                  <span className="sr-only">
                    {" "}
                    on {platform.label} (opens in a new tab)
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.08}>
        {/* Full-bleed out of the content column. The Section clips the
            horizontal overflow that 100vw leaves behind a scrollbar. */}
        <div
          id={WALL_ID}
          data-review-lang="translation"
          className="review-wall relative left-1/2 mt-14 w-screen -translate-x-1/2"
        >
          {rows.map((row, i) => (
            <div
              key={i}
              className="marquee review-row"
              data-direction={row.reverse ? "reverse" : undefined}
              style={{ "--marquee-duration": `${row.duration}s` } as React.CSSProperties}
            >
              <div className="marquee-track">
                <ul className="review-list">
                  {row.reviews.map((review) => (
                    <li key={review.id} className="review-slot">
                      <ReviewCard review={review} />
                    </li>
                  ))}
                </ul>
                <ul className="review-list" aria-hidden inert>
                  {row.reviews.map((review) => (
                    <li key={review.id} className="review-slot">
                      <ReviewCard review={review} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-caption text-bone-52">{reviewsCopy.note}</p>
        <div className="flex flex-wrap items-center gap-2">
          <ReviewLanguageToggle
            target={WALL_ID}
            showOriginalLabel={reviewsCopy.showOriginalLabel}
            showTranslationLabel={reviewsCopy.showTranslationLabel}
          />
          <MarqueeToggle
            target={WALL_ID}
            pauseLabel={reviewsCopy.pauseLabel}
            playLabel={reviewsCopy.playLabel}
          />
        </div>
      </div>

      <ClientMap />
    </Section>
  );
}
