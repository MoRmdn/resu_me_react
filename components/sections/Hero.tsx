"use client";

import { MoRmdnMarkDraw } from "@/components/brand/MoRmdnMarkDraw";
import { CountUp } from "@/components/motion/CountUp";
import { hero } from "@/content/copy";
import { useViews } from "@/lib/useViews";

/**
 * Held hero — the page slides over it rather than pushing it away.
 *
 * Two v2 changes worth naming. The headline no longer accents its final word:
 * §1.3 spends this viewport's single Tier 1 on the CTA, and two full-chroma
 * coppers in one viewport is exactly the contradiction the tiers resolve. And
 * all three track-record metrics are bone, not copper — live values are jade,
 * because jade is the status hue and is exempt from the accent count.
 */
export function Hero() {
  const views = useViews({ increment: true });

  const rise = (i: number) =>
    ({ "--rise-delay": `${0.15 + i * 0.08}s` }) as React.CSSProperties;

  return (
    <section
      id="top"
      className="hero-held relative isolate flex min-h-[680px] items-center overflow-hidden bg-ink-900 py-32 md:h-[880px] md:py-0"
    >
      {/* The mark appears once at full strength in the nav and once here as an
          oversized watermark at 5.5%. LOGO.md forbids a third placement. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[120px] -right-[70px] z-0 hidden opacity-[0.055] md:block"
      >
        <MoRmdnMarkDraw size={620} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-content items-end gap-14 px-5 md:px-8 lg:grid-cols-[7fr_5fr] lg:gap-[72px]">
        <div className="flex flex-col gap-7 lg:pb-2">
          <div className="rise flex flex-wrap items-center gap-4" style={rise(0)}>
            <span className="inline-flex items-center gap-2 rounded-pill border border-jade/32 py-[7px] pr-[13px] pl-[11px]">
              <span className="pulse-dot size-1.5 rounded-full bg-jade" aria-hidden />
              <span className="eyebrow text-jade">{hero.status}</span>
            </span>
            <span className="eyebrow text-bone-52">{hero.place}</span>
          </div>

          <h1 className="text-[clamp(2.75rem,7.5vw,6.75rem)] leading-[0.9] font-semibold tracking-[-0.04em] text-balance">
            {hero.headline.map((line) => (
              <span key={line} className="rise block" style={rise(1)}>
                {line}
              </span>
            ))}
          </h1>

          <p className="rise max-w-[46ch] text-body-l text-bone-70" style={rise(3)}>
            {hero.intro}
          </p>

          <div className="rise mt-3 flex flex-wrap items-center gap-3.5" style={rise(4)}>
            {/* The one Tier 1 solid fill in this viewport. */}
            <a
              href={hero.primaryCta.href}
              className="inline-flex h-12 items-center rounded-md bg-copper px-[22px] text-[0.9375rem] font-medium text-ink-900 transition-[transform,background-color] duration-fast ease-fast hover:-translate-y-0.5 hover:bg-copper-bright active:translate-y-0 active:bg-copper-dim"
            >
              {hero.primaryCta.label} &rarr;
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-12 items-center rounded-md border border-line px-[22px] text-[0.9375rem] font-medium text-bone transition-[transform,border-color,background-color] duration-fast ease-fast hover:-translate-y-0.5 hover:border-line-strong hover:bg-bone-06 active:translate-y-0"
            >
              {hero.secondaryCta.label}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={hero.resumeCta.href}
              download
              className="eyebrow inline-flex min-h-11 items-center border-b border-copper/38 pb-1 text-bone-70 transition-colors duration-fast ease-fast hover:border-copper hover:text-bone"
            >
              {hero.resumeCta.label} &darr;
            </a>
          </div>
        </div>

        <div
          className="rise rounded-lg bg-ink-700 p-7 elevation-card"
          style={{ "--rise-delay": "0.6s" } as React.CSSProperties}
        >
          <div className="flex items-baseline justify-between border-b border-line pb-5">
            <p className="eyebrow text-bone-52">{hero.trackRecordLabel}</p>
            <p className="eyebrow tabular text-bone-52">2021 &rarr;</p>
          </div>

          <dl>
            {hero.trackRecord.map((m, i) => (
              <div
                key={m.label}
                className={`flex items-baseline gap-4 py-[22px] ${
                  i < hero.trackRecord.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <dd className="min-w-[96px] text-[2.875rem] leading-none font-semibold tracking-[-0.03em] tabular">
                  <CountUp value={m.value} suffix={m.suffix} />
                </dd>
                <dt className="text-caption text-bone-52">{m.label}</dt>
              </div>
            ))}
          </dl>

          {views !== null && (
            <p className="mt-2 flex items-center gap-2.5 border-t border-line pt-[18px] text-caption text-bone-52">
              <span className="pulse-dot size-1.5 rounded-full bg-jade" aria-hidden />
              <span className="tabular font-mono text-jade">{views.toLocaleString()}</span>
              {hero.viewsLabel}
            </p>
          )}
        </div>
      </div>

      {/* The seam the nav border resolves against as the page slides up. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgb(242 118 46 / 0.14), transparent 62%)",
        }}
      />
    </section>
  );
}
