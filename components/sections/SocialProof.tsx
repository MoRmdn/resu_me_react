import { ui } from "@/content/copy-i18n";
import type { LocaleProps } from "@/content/locale";
import { selectedReviews, testimonialIds } from "@/content/reviews";
import { ReviewCard } from "@/components/ui/ReviewCard";

/**
 * Three client quotes, set inside Projects after the first featured panel.
 * The strip that used to sit under the hero is gone: the hero's own intro and
 * ledger carry the review total.
 */
export function Testimonials({ locale = "en" }: LocaleProps) {
  return (
    <div className="review-grid my-12 md:my-14">
      <h3 className="eyebrow mb-5 text-bone-52">{ui[locale].testimonials}</h3>
      <ul className="testimonial-list">
        {selectedReviews(testimonialIds).map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
