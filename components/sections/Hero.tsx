import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";
import { getProjects } from "@/content/projects-i18n";
import { experiences } from "@/content/experience";
import { clientCountries, clientsIn } from "@/content/clients";
import { countryName } from "@/content/countries-i18n";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { projectNames } from "@/lib/projectNames";
import { trackAttrs } from "@/lib/analytics/attrs";
import { stagger } from "@/lib/motion";
import { whatsappWith } from "@/lib/paths";
import { cn } from "@/lib/cn";

/** Staggered tops for the three promos, so the sheet reads as hand-laid. */
const OFFSETS = ["", "mt-8", "mt-4"];

export function Hero({ locale = "en" }: LocaleProps) {
  const { hero, contactCopy } = getCopy(locale);
  const { orderedProjects } = getProjects(locale);
  const firstYear = Math.min(...experiences.map((e) => Number(e.start.slice(0, 4))));
  // The country with the most client accounts, whichever it is when the data changes.
  const topCountry = clientCountries.reduce((top, c) => (clientsIn(c, "all") > clientsIn(top, "all") ? c : top));

  const ledger = [
    { label: hero.ledger.reviews, value: hero.ledger.reviewsValue },
    { label: hero.ledger.clients, value: hero.ledger.clientsValue },
    { label: hero.ledger.topCountry, value: countryName(topCountry.id, topCountry.name, locale) },
    { label: hero.ledger.since, value: String(firstYear) },
  ];

  return (
    <section id="top" className="mx-auto w-full max-w-content px-5 pt-28 pb-16 md:px-8 md:pt-36">
      <p className="enter flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.875rem] text-bone-70" style={stagger(0)}>
        <span className="inline-flex items-center gap-2 font-medium text-jade">
          <span aria-hidden className="size-[7px] rounded-pill bg-jade" />
          {hero.status}
        </span>
        <span aria-hidden className="h-px w-6 bg-line-strong" />
        <span>
          {hero.role}, {hero.place}
        </span>
      </p>

      <h1 className="hero-headline rise-lcp mt-7 max-w-[16ch]">{hero.headline.join(" ")}</h1>

      <div className="mt-8 grid items-start gap-10 md:mt-12 lg:grid-cols-[5fr_7fr] lg:gap-14">
        {/* The intro and both actions paint with the headline, so a way to get
            in touch is on screen from the first frame. They only move. */}
        <div className="rise-lcp lg:pt-4">
          <p className="max-w-[36rem] text-body-l text-bone-70">{hero.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappWith(hero.primaryCta.href, contactCopy.whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-md bg-copper px-5 font-semibold text-on-copper transition-colors duration-fast ease-fast hover:bg-copper-bright active:bg-copper-dim"
              {...trackAttrs("contact_channel_click", {
                channel_id: "whatsapp",
                channel_label: hero.primaryCta.label,
                channel_placement: "hero",
              })}
            >
              {hero.primaryCta.label}
              <span aria-hidden className="rtl:-scale-x-100">→</span>
              <span className="sr-only">{ui[locale].external}</span>
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex min-h-12 items-center rounded-md border border-line-strong px-5 font-medium text-bone transition-colors duration-fast ease-fast hover:border-bone"
              {...trackAttrs("cta_click", {
                cta_id: "hero_see_work",
                link_text: hero.secondaryCta.label,
              })}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <figure style={stagger(3)} className="enter rounded-[24px] border border-line bg-ink-700 px-4 pt-4 pb-2.5 shadow-[0_28px_56px_-28px_var(--color-shadow)]">
          <figcaption className="sr-only">{hero.figureCaption}</figcaption>
          <ul className="grid grid-cols-3 items-start gap-3">
            {hero.promos.map((promo, i) => {
              const project = orderedProjects.find((p) => p.slug === promo.slug);
              return (
                <li key={promo.slug} className={cn("enter", OFFSETS[i])} style={stagger(4 + i)}>
                  <ProjectImage
                    file={promo.file}
                    widths={[280, 560]}
                    sizes="(min-width: 1040px) 220px, 30vw"
                    alt={promo.alt}
                    width={promo.width}
                    height={promo.height}
                    loading="eager"
                    className="promo block aspect-[5/8] h-auto w-full rounded-[9px] bg-ink-800 object-cover object-top"
                  />
                  {project && (
                    <p className="mx-0.5 mt-2.5 text-[0.875rem] leading-snug font-medium">
                      <bdi>{projectNames(project.title).name}</bdi>
                      <span className="block text-[0.78125rem] font-normal text-bone-52">{project.country}</span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </figure>
      </div>

      <dl style={stagger(7)} className="enter hairline-grid mt-16 grid-cols-2 border-y border-line md:grid-cols-4">
        {ledger.map(({ label, value }) => (
          <div key={label} className="bg-ink-900 py-4.5 pe-4.5 md:ps-4.5 md:first:ps-0">
            <dt className="text-caption text-bone-52">{label}</dt>
            <dd className="mt-1.5 font-mono text-[0.9375rem] tabular">
              <bdi>{value}</bdi>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
