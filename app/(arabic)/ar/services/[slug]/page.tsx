import type { Metadata } from "next";
import ServicePage from "@/components/pages/ServicePage";
import { serviceSlugs } from "@/content/services";
import { serviceMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ slug: string }> };

// Static export: every service page is generated at build time, and any other
// slug is a real 404 rather than a page rendered on request.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return serviceMetadata((await params).slug, "ar");
}

export default async function Page({ params }: Props) {
  return <ServicePage slug={(await params).slug} locale="ar" />;
}
