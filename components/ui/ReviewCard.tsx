import { PlatformMark } from "@/components/brand/PlatformMark";
import { platformOf, reviewCardCopy, type Review } from "@/content/reviews";

/** Total characters at which a card needs more width than the default. */
const WIDE_AT = 400;
/** Below this, a quote is short enough to be set as a pull quote. */
const SHORT_BELOW = 90;
/** A client's line break costs about as much height as this many characters. */
const LINE_BREAK = 60;

/**
 * Cards in a row stretch to the tallest one, so a single long stacked card
 * leaves every neighbour half empty. Long reviews trade height for width: with
 * a translation, the two sit side by side.
 */
function layoutOf(review: Review) {
  const text = review.quote + (review.translation ?? "");
  const length = text.length + (text.split("\n").length - 1) * LINE_BREAK;
  if (length < SHORT_BELOW) return "short";
  if (length < WIDE_AT) return "base";
  return review.translation ? "split" : "wide";
}

/**
 * One review. Styled entirely by the `.review-card` classes in globals.css
 * rather than utilities, so it can be copied into another project along with
 * that block. `npm run export:reviews` does exactly that.
 *
 * The hover (lift, brand hairline, stars filling in sequence) is CSS only: the
 * card is a server component, and thirty of them never need a re-render.
 */
export function ReviewCard({ review }: { review: Review }) {
  const platform = platformOf(review);
  const meta = [review.country, review.project, review.date].filter(Boolean).join(" · ");

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
        <span role="img" aria-label={reviewCardCopy.ratingLabel} className="review-card__rating">
          <span aria-hidden className="review-card__stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ "--star": i } as React.CSSProperties}
              >
                <path d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
              </svg>
            ))}
          </span>
          <span aria-hidden>{reviewCardCopy.ratingValue}</span>
        </span>
      </header>

      <div className="review-card__body">
        <blockquote
          lang={review.lang}
          dir={review.lang === "ar" ? "rtl" : "ltr"}
          className="review-card__quote"
        >
          {review.quote}
        </blockquote>

        {review.translation && (
          <div className="review-card__translation">
            <p className="review-card__label">{reviewCardCopy.translatedLabel}</p>
            <p>{review.translation}</p>
          </div>
        )}
      </div>

      <footer className="review-card__foot">
        <div>
          <p dir="auto" className="review-card__author">
            {review.author}
            {review.repeat && <span className="review-card__repeat">{reviewCardCopy.repeatLabel}</span>}
          </p>
          <p className="review-card__meta">{meta}</p>
        </div>
        <p className="review-card__source">
          {reviewCardCopy.sourceLabel} {platform.label}
        </p>
      </footer>
    </article>
  );
}
