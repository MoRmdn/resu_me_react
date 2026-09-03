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
 * Backgrounds alternate ink-900 / ink-800 down the page so sections separate
 * without rules between them.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <RevealRoot />
      <Nav />
      <main id="main">
        <Hero />
        <TechStrip />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
