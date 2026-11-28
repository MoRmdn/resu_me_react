import type { LocaleProps } from "@/content/locale";
import { navSections, type SectionId } from "@/content/site";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd } from "@/components/JsonLd";
import { profileGraph } from "@/lib/structured-data";

/**
 * One component per section id. The order is not written here: the page maps
 * over `navSections` in content/site.ts, so the page, the nav and the Ledger
 * numbers cannot disagree. A new id without a component fails to compile.
 */
const SECTIONS: Record<SectionId, (props: LocaleProps) => React.ReactNode> = {
  services: Services,
  projects: Projects,
  reviews: Reviews,
  about: About,
  experience: Experience,
  skills: Skills,
  contact: Contact,
};

export default function PortfolioPage({ locale = "en" }: LocaleProps) {
  return (
    <>
      {/* The page is the Person's profile, and mentions every app. */}
      <JsonLd data={profileGraph(locale)} />
      <Nav locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        {navSections.map(({ id }) => {
          const Band = SECTIONS[id];
          return <Band key={id} locale={locale} />;
        })}
      </main>
      <Footer locale={locale} />
      <RevealObserver />
    </>
  );
}
