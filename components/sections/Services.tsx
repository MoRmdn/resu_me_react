import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/sections/FaqList";
import { servicesCopy } from "@/content/copy";
import { faqs, services } from "@/content/services";

/**
 * What he can be hired for, then the questions clients ask before hiring.
 *
 * Sits between Reviews and Contact on purpose: the reviews make the claim
 * credible, this turns it into something a client can buy, and Contact is the
 * next scroll.
 *
 * It spends no copper. The Contact plane that follows holds the Tier 1 fill, and
 * the two can share a viewport.
 *
 * The FAQ answers start collapsed (see FaqList), but stay in the served HTML.
 */
export function Services() {
  return (
    <Section id="services" tone="ink-800" z={20} offset={-40}>
      <Reveal>
        <div className="mb-16 grid items-end gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <Eyebrow>{servicesCopy.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-display-l text-balance">{servicesCopy.headline}</h2>
          </div>
          <p className="max-w-[46ch] text-body text-bone-70">{servicesCopy.blurb}</p>
        </div>
      </Reveal>

      <ul className="grid gap-2.5 md:grid-cols-2">
        {services.map((service, i) => (
          <Reveal
            as="li"
            key={service.slug}
            delay={Math.min(i * 0.06, 0.24)}
            className="flex flex-col rounded-lg bg-ink-700 p-7 elevation-card transition-[border-color,background-color] duration-fast ease-fast hover:border-copper/35 hover:bg-ink-600 md:p-[30px_34px]"
          >
            <span aria-hidden className="font-mono text-[2.5rem] leading-[0.9] text-bone-10 tabular">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-h3 text-bone">{service.title}</h3>
            <p className="mt-3 max-w-[62ch] flex-1 text-body text-bone-70">{service.body}</p>
            <p className="mt-6 border-t border-line pt-5 font-mono text-caption text-bone-52 tabular">
              {service.proof}
            </p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-24 grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <Reveal>
          <Eyebrow>{servicesCopy.faqEyebrow}</Eyebrow>
          <h3 className="mt-6 max-w-[16ch] text-h1 text-balance">{servicesCopy.faqHeadline}</h3>
        </Reveal>

        <FaqList faqs={faqs} />
      </div>
    </Section>
  );
}
