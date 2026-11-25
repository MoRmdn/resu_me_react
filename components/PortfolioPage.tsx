import type { LocaleProps } from "@/content/locale";
import { SocialProof } from "@/components/sections/SocialProof";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { TechStrip } from "@/components/sections/TechStrip";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Reviews } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
export default function PortfolioPage({ locale = "en" }: LocaleProps) {
  return (
    <>
      <Nav locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <div className="relative z-10 bg-ink-900">
          <TechStrip locale={locale} />
          <SocialProof locale={locale} />
          <About locale={locale} />
          <Experience locale={locale} />
          <Projects locale={locale} />
          <Skills locale={locale} />
          <Reviews locale={locale} />
          <Contact locale={locale} />
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
