import type { Review } from "./reviews";
import type { Locale } from "./locale";
export const reviewUi = {
  en: {
    rating: "Rated 5 out of 5",
    original: "Show original",
    repeat: "Repeat client",
    on: "on",
    fromArabic: "Translated from Arabic",
    fromEnglish: "Translated from English",
  },
  ar: {
    rating: "التقييم 5 من 5",
    original: "عرض النص الأصلي",
    repeat: "عميل متكرر",
    on: "على",
    fromArabic: "مترجم من العربية",
    fromEnglish: "مترجم من الإنجليزية",
  },
};
const projectLabels: Record<string, string> = {
  "Arcit-AI Flutter app": "تطبيق Arcit-AI باستخدام Flutter",
  "Flutter app changes & fixes": "تعديلات وإصلاحات لتطبيق Flutter",
  "Flutter app fixes": "إصلاحات لتطبيق Flutter",
  "Update and publish on both stores": "تحديث ونشر على المتجرين",
  "Map view and sharing for a trip-planning app": "عرض الخرائط والمشاركة لتطبيق تخطيط الرحلات",
  "Ride-hailing app": "تطبيق لطلب الرحلات",
  "App maintenance and bug fixes": "صيانة التطبيق وإصلاح الأخطاء",
  "Lpermis enhancements": "تحسينات Lpermis",
  "Payment gateway for a Flutter app": "بوابة دفع لتطبيق Flutter",
  "Flutter app for Android & iOS": "تطبيق Flutter لـAndroid وiOS",
  "Flutter graduation project": "مشروع تخرج باستخدام Flutter",
  "Flutter errors on iOS": "أخطاء Flutter على iOS",
  "Flutter real-estate app reskin": "تجديد واجهة تطبيق عقارات باستخدام Flutter",
  "Mobile app work": "تطوير تطبيق هاتف",
  "Flutter bug fixes and new features": "إصلاح أخطاء وميزات جديدة في Flutter",
  "Flutter push notifications": "إشعارات فورية في Flutter",
};
const countries: Record<string, string> = {
  "United Kingdom": "المملكة المتحدة",
  Italy: "إيطاليا",
  Romania: "رومانيا",
  "Saudi Arabia": "السعودية",
  France: "فرنسا",
  Egypt: "مصر",
  Morocco: "المغرب",
  Jordan: "الأردن",
  "United States": "الولايات المتحدة",
};
const months: Record<string, string> = {
  May: "مايو",
  Feb: "فبراير",
  Apr: "أبريل",
  Jan: "يناير",
  Nov: "نوفمبر",
};
export function reviewMeta(review: Review, locale: Locale) {
  if (locale === "en")
    return [review.country, review.project, review.date].filter(Boolean).join(" · ");
  return [
    review.country ? (countries[review.country] ?? review.country) : undefined,
    projectLabels[review.project] ?? review.project,
    review.date.replace(/^[A-Za-z]+/, (month) => months[month] ?? month),
  ]
    .filter(Boolean)
    .join(" · ");
}
