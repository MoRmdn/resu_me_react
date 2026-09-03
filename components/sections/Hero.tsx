"use client";

import { MoRmdnMarkDraw } from "@/components/brand/MoRmdnMarkDraw";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/motion/CountUp";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { hero } from "@/content/copy";
import { useViews } from "@/lib/useViews";

/**
 * The one memorable moment on the page: the mark draws itself once on load
 * while the headline rises line by line and the track-record panel arrives
 * last. Everything below the fold is deliberately quieter than this.
 */
export function Hero() {
  const views = useViews({ increment: true });

  const rise = (i: number) =>
    ({ "--rise-delay": `${0.15 + i * 0.09}s` }) as React.CSSProperties;

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-ink-900 pt-36 pb-24 md:pt-44 md:pb-32"
    >
      <CursorGlow />

      {/* Oversized watermark — the one permitted second placement of the mark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-32 z-0 hidden opacity-[0.055] md:block"
      >
        <MoRmdnMarkDraw size={560} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-content gap-16 px-5 md:px-8 lg:grid-cols-[155fr_100fr] lg:items-end lg:gap-20">
        <div>
          <div className="rise mb-8 flex flex-wrap items-center gap-3" style={rise(0)}>
            <span className="inline-flex items-center gap-2">
              <span className="pulse-dot size-1.5 rounded-full bg-jade" aria-hidden />
              <span className="eyebrow text-jade">{hero.status}</span>
            </span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <span className="eyebrow text-bone-52">{hero.place}</span>
          </div>

          <h1 className="text-display-xl text-balance">
            {hero.headline.map((text, i) => (
              <span key={text} className="rise block" style={rise(i + 1)}>
                <span className={i === hero.headlineAccentIndex ? "text-copper" : undefined}>
                  {text}
                </span>
              </span>
            ))}
          </h1>

          <p className="rise mt-8 max-w-[46ch] text-body-l text-bone-70" style={rise(4)}>
            {hero.intro}
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={rise(5)}>
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label} &rarr;</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="ghost">
              {hero.secondaryCta.label}
            </ButtonLink>
            <a
              href={hero.resumeCta.href}
              download
              className="inline-flex min-h-11 items-center gap-2 px-1 text-[0.96875rem] text-bone-62 underline decoration-line underline-offset-4 transition-colors duration-fast ease-fast hover:text-bone hover:decoration-copper"
            >
              {hero.resumeCta.label} &darr;
            </a>
          </div>
        </div>

        <div
          className="rise rounded-lg bg-ink-700 p-7 elevation-card"
          style={{ "--rise-delay": "0.6s" } as React.CSSProperties}
        >
          <p className="eyebrow mb-7 text-bone-52">{hero.trackRecordLabel}</p>
          <dl className="flex flex-col gap-7">
            {hero.trackRecord.map((m, i) => (
              <div key={m.label}>
                <dd className={`text-metric ${i === 0 ? "text-copper" : "text-bone"}`}>
                  <CountUp value={m.value} suffix={m.suffix} />
                </dd>
                <dt className="mt-1.5 text-caption text-bone-52">{m.label}</dt>
              </div>
            ))}
          </dl>

          {views !== null && (
            <p className="mt-7 flex items-center gap-2 border-t border-line pt-5 text-caption text-bone-52">
              <span className="size-1.5 rounded-full bg-jade" aria-hidden />
              <span className="tabular font-mono">{views.toLocaleString()}</span>
              {hero.viewsLabel}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
