import type { LocaleProps } from "@/content/locale";
import { getCopy, ui } from "@/content/copy-i18n";
import Image from "next/image";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { trackAttrs } from "@/lib/analytics/attrs";

export function Hero({ locale = "en" }: LocaleProps) {
  const { hero } = getCopy(locale);

  return (
    <section id="top" className="hero-workbench relative isolate overflow-hidden bg-ink-900">
      <div className="relative mx-auto w-full max-w-content px-5 pt-32 md:px-8 md:pt-40">
        <div className="relative z-10 max-w-[42rem]">
          <p className="eyebrow text-bone-70">{hero.place}</p>
          <h1 className="hero-headline rise-lcp mt-5 font-semibold text-balance">
            {hero.headline.map((line, index) => (
              <span key={line} className="block">{index > 0 && " "}{line}</span>
            ))}
          </h1>
          <p className="mt-6 max-w-[42ch] text-body-l text-bone-70">{hero.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={hero.primaryCta.href}
              className="inline-flex min-h-12 items-center rounded-md bg-copper px-5 font-medium text-ink-900 transition-colors duration-fast ease-fast hover:bg-copper-bright active:bg-copper-dim"
              {...trackAttrs("cta_click", {
                cta_id: "hero_see_work",
                link_text: hero.primaryCta.label,
              })}
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-12 items-center rounded-md border border-line-strong px-5 font-medium text-bone transition-colors duration-fast ease-fast hover:bg-bone-06"
              {...trackAttrs("contact_channel_click", {
                channel_id: "whatsapp",
                channel_label: hero.secondaryCta.label,
                channel_placement: "hero",
              })}
            >
              {hero.secondaryCta.label}
              <span className="sr-only">{ui[locale].external}</span>
            </a>
          </div>
        </div>

        <picture className="hero-scene">
          <source type="image/avif" srcSet="/images/hero-workbench-840.avif 840w, /images/hero-workbench-1672.avif 1672w" sizes="100vw" />
          <source type="image/webp" srcSet="/images/hero-workbench-840.webp 840w, /images/hero-workbench-1672.webp 1672w" sizes="100vw" />
          <Image
            src="/images/hero-workbench-840.webp"
            alt={hero.sceneAlt}
            width={1672}
            height={941}
            loading="eager"
            fetchPriority="high"
            unoptimized
          />
        </picture>

        <div className="relative z-10 grid gap-4 lg:mt-20 lg:grid-cols-[1fr_25rem] lg:items-start lg:gap-12">
          <dl className="grid max-w-[34rem] grid-cols-3 gap-4 border-t border-line py-6 lg:mt-8">
            {hero.trackRecord.map(({ value, suffix, label }) => (
              <div key={label} className="flex flex-col gap-2">
                <dt className="text-caption text-bone-70">{label}</dt>
                <dd className="order-first text-h2 tabular"><bdi dir="ltr">{value}{suffix}</bdi></dd>
              </div>
            ))}
          </dl>

          <figure className="grid w-full max-w-[25rem] grid-cols-[1fr_clamp(7.5rem,33vw,10rem)] items-center gap-4 justify-self-end rounded-t-lg border border-b-0 border-line bg-ink-800 px-4 pt-4 lg:gap-6 lg:px-6">
            <figcaption className="pb-4">
              <p className="text-h3"><bdi>{hero.preview.title}</bdi></p>
              <p className="mt-2 text-caption text-bone-70">{hero.preview.caption}</p>
            </figcaption>
            <ProjectImage
              file="saad-screen-1"
              widths={[280, 560]}
              sizes="(min-width: 680px) 160px, 33vw"
              alt={hero.preview.alt}
              width={1200}
              height={2133}
              className="h-auto w-full rounded-t-md"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
