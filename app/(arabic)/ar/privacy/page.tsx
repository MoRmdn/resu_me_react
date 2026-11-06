import type { Metadata } from "next";
import PrivacyPage from "@/components/PrivacyPage";
import { getCopy } from "@/content/copy-i18n";
const copy = getCopy("ar").privacyCopy;
export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/ar/privacy/", languages: { en: "/privacy/", ar: "/ar/privacy/" } },
  robots: { index: false, follow: true },
};
export default function Page() {
  return <PrivacyPage locale="ar" />;
}
