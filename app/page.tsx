import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { TechStrip } from "@/components/sections/TechStrip";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { RevealRoot } from "@/components/motion/RevealRoot";

/**
 * Plane rhythm — DESIGN-SYSTEM v2 §3.1.
 *
 * The hero is held at the top and the page slides over it. Everything after the
 * hero lives in one opaque sheet: the planes alternate two backgrounds and
 * overlap (-1px at the marquee seam, -40px at Projects and Contact) or open a
 * 112px gap, and the sheet's own ground is what shows through those gaps.
 *
 * The sheet is load-bearing. Without it the gaps are transparent and the held
 * hero shows through them mid-page, which looks like a rendering fault. The
 * artboard needs no equivalent because its hero is a static block.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <RevealRoot />
      <Nav />
      <main id="main">
        <Hero />
        <div className="relative z-10 bg-ink-900">
          {/* The nav watches this to know when the hero's CTA has gone, so the
              hero button and the nav button are never both copper (§1.3). It
              sits here rather than inside the Hero because the hero is sticky —
              anything inside it stays pinned and never crosses the nav line. */}
          <div id="hero-end" aria-hidden className="h-px w-px" />
          <TechStrip />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
