import { ui } from "@/content/copy-i18n";
import type { LocaleProps } from "@/content/locale";
import { selectedReviews, testimonialIds } from "@/content/reviews";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { trackAttrs } from "@/lib/analytics/attrs";

export function SocialProof({ locale = "en" }: LocaleProps) {
  const copy = ui[locale];
  return (
    <section
      id="social-proof"
      aria-label={copy.testimonials}
      className="relative z-[11] border-b border-line bg-ink-900"
    >
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-6 md:px-8">
        <p className="text-caption text-bone-70">{copy.proof}</p>
        <a
          href="#reviews"
          className="inline-flex min-h-11 items-center text-caption text-bone underline decoration-line underline-offset-4"
          {...trackAttrs("review_summary_click", {})}
        >
          {copy.proofLink}
        </a>
      </div>
    </section>
  );
}
export function Testimonials({ locale = "en" }: LocaleProps) {
  return (
    <div className="review-grid mb-12">
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
