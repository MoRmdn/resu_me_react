import type { Metadata } from "next";
import CaseStudyPage from "@/components/pages/CaseStudyPage";
import { caseStudySlugs } from "@/content/case-studies";
import { caseStudyMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ slug: string }> };

// Static export: every case study is generated at build time, and any other
// slug is a real 404 rather than a page rendered on request.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata((await params).slug, "ar");
}

export default async function Page({ params }: Props) {
  return <CaseStudyPage slug={(await params).slug} locale="ar" />;
}
