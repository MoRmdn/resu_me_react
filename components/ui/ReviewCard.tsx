import { PlatformMark } from "@/components/brand/PlatformMark";
import { platformOf, type Review } from "@/content/reviews";

import { reviewUi, reviewMeta } from "@/content/review-copy";
import { reviewTranslations } from "@/content/reviews-ar";
import type { Locale } from "@/content/locale";
import { trackAttrs } from "@/lib/analytics/attrs";

/** Total characters at which a card needs more width than the default. */
const WIDE_AT = 400;
/** Below this, a quote is short enough to be set as a pull quote. */
const SHORT_BELOW = 90;
/** A client's line break costs about as much height as this many characters. */
const LINE_BREAK = 60;

/**
 * Width variants are retained for portable card exports. On the site the
 * static grid sets the width, and translations use an original-text disclosure.
 */
function layoutOf(review: Review) {
  const text = review.quote + (review.translation ?? "");
  const length = text.length + (text.split("\n").length - 1) * LINE_BREAK;
  if (length < SHORT_BELOW) return "short";
  if (length < WIDE_AT) return "base";
  return "wide";
}

/**
 * One review. Styled entirely by the `.review-card` classes in globals.css
 * rather than utilities, so it can be copied into another project along with
 * that block. `npm run export:reviews` does exactly that.
 *
 * The hover (lift, brand hairline, stars filling in sequence) is CSS only: the
 * card is a server component, and thirty of them never need a re-render.
 */
export function ReviewCard({ review, locale = "en" }: { review: Review; locale?: Locale }) {
  const copy = reviewUi[locale];
  const translated =
    review.lang !== locale
      ? locale === "en"
        ? review.translation
        : reviewTranslations[review.id]
      : undefined;
  const platform = platformOf(review);
  const meta = reviewMeta(review, locale);

  return (
    <article
      className="review-card"
      data-review={review.id}
      data-platform={review.platform}
      data-layout={layoutOf(review)}
    >
      <span aria-hidden className="review-card__glyph">
        &ldquo;
      </span>

      <header className="review-card__top">
        <PlatformMark
          platform={review.platform}
          label={platform.label}
          className="review-card__mark"
        />
        <span role="img" aria-label={copy.rating} className="review-card__rating">
          <span aria-hidden className="review-card__stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="review-card__star"
                style={{ "--star": i } as React.CSSProperties}
              />
            ))}
          </span>
          <span aria-hidden>{"5.0"}</span>
        </span>
      </header>

      <div className="review-card__body">
        {translated && (
          <p className="review-card__label">
            {review.lang === "ar" ? copy.fromArabic : copy.fromEnglish}
          </p>
        )}
        <blockquote
          lang={translated ? locale : review.lang}
          dir={(translated ? locale : review.lang) === "ar" ? "rtl" : "ltr"}
          className="review-card__quote"
        >
          {translated ?? review.quote}
        </blockquote>
        {translated && (
          <details className="review-original">
            <summary {...trackAttrs("review_original_toggle", { toggle_action: "open" })}>
              {copy.original}
            </summary>
            <blockquote
              lang={review.lang}
              dir={review.lang === "ar" ? "rtl" : "ltr"}
              className="review-card__quote"
            >
              {review.quote}
            </blockquote>
          </details>
        )}
      </div>

      <footer className="review-card__foot">
        <div>
          <p dir="auto" className="review-card__author">
            {review.author}
            {review.repeat && <span className="review-card__repeat">{copy.repeat}</span>}
          </p>
          <p className="review-card__meta">{meta}</p>
        </div>
        <p className="review-card__source">
          {copy.on} {platform.label}
        </p>
      </footer>
    </article>
  );
}
