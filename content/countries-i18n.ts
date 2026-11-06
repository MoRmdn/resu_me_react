import type { Locale } from "./locale";
const arabic: Record<string, string> = {
  SA: "السعودية",
  EG: "مصر",
  MA: "المغرب",
  JO: "الأردن",
  PS: "فلسطين",
  OM: "عُمان",
  AE: "الإمارات العربية المتحدة",
  IQ: "العراق",
  SD: "السودان",
  KW: "الكويت",
  TR: "تركيا",
  IN: "الهند",
  SY: "سوريا",
  GB: "المملكة المتحدة",
  DE: "ألمانيا",
  RO: "رومانيا",
  PK: "باكستان",
  US: "الولايات المتحدة",
  FR: "فرنسا",
  IT: "إيطاليا",
};
export function countryName(id: string, fallback: string, locale: Locale) {
  return locale === "ar" ? (arabic[id] ?? fallback) : fallback;
}
