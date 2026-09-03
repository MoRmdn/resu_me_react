"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { contactCopy } from "@/content/copy";
import { channels, contact, socials } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * No form. Enquiries used to land in a Firebase console; they now go straight
 * to a channel Mohamed already watches, and the world-writable database path
 * that fed the form is closed.
 *
 * The 5fr/7fr split is inverted here — the only section that does that — and
 * WhatsApp, as the first channel, holds this viewport's single Tier 1 copper
 * fill (DESIGN-SYSTEM v2 §1.3).
 */
export function Contact() {
  return (
    <Section id="contact" tone="ink-900" z={20} offset={-40}>
      <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>{contactCopy.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-display-l text-balance">
              <span className="block">{contactCopy.headline[0]}</span>
              <span className="block">{contactCopy.headline[1]}</span>
            </h2>
            <p className="mt-7 max-w-[46ch] text-body-l text-bone-70">{contactCopy.blurb}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 flex items-center gap-3 border-t border-line pt-7">
              <span className="pulse-dot size-1.5 rounded-full bg-jade" aria-hidden />
              <div>
                <p className="eyebrow text-bone-52">{contactCopy.availabilityLabel}</p>
                <p className="mt-1.5 text-body text-bone-70">{contactCopy.availability}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-11 items-center gap-2 text-[0.84375rem] text-bone-70 transition-colors duration-fast ease-fast hover:text-bone"
                  >
                    {s.label}
                    <span className="text-bone-52">{s.handle}</span>
                    <span aria-hidden className="text-bone-52">
                      &#8599;
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <div className="rounded-lg border border-line bg-ink-700 p-7 elevation-card md:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5">
              <p className="eyebrow text-bone-52">{contactCopy.channelsLabel}</p>
              <p className="text-caption text-bone-52">{contactCopy.channelsNote}</p>
            </div>

            <ul className="hairline-grid mt-6 border border-line sm:grid-cols-2">
              {channels.map((channel) => (
                <li key={channel.id} className="bg-ink-700">
                  <ChannelCard channel={channel} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

type Channel = (typeof channels)[number];

function ChannelCard({ channel }: { channel: Channel }) {
  const isPrimary = "primary" in channel && channel.primary;
  const isExternal = channel.url.startsWith("http");

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-2 p-5 transition-colors duration-fast ease-fast",
        isPrimary ? "bg-copper text-ink-900" : "hover:bg-ink-600",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <a
          href={channel.url}
          {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          // Stretched link: the whole cell is the target, so the tap area is
          // the card rather than the label.
          className="eyebrow inline-flex min-h-6 items-center after:absolute after:inset-0 after:content-['']"
        >
          <span className={isPrimary ? "text-ink-900" : "text-bone-52"}>{channel.label}</span>
          {isExternal && <span className="sr-only">(opens in a new tab)</span>}
        </a>
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-[0.75rem] transition-transform duration-fast ease-fast group-hover:translate-x-0.5",
            isPrimary ? "text-ink-900/70" : "text-bone-28",
          )}
        >
          {isExternal ? "↗" : "→"}
        </span>
      </div>

      <p
        className={cn(
          "font-mono text-[0.8125rem] break-all",
          isPrimary ? "text-ink-900" : "text-bone",
        )}
      >
        {channel.handle}
      </p>

      {/* The note follows the handle in every cell; only the copy button is
          pushed to the foot, so notes stay on a common baseline across the row. */}
      <p className={cn("text-[0.75rem]", isPrimary ? "text-ink-900/70" : "text-bone-52")}>
        {channel.note}
      </p>

      {"copyable" in channel && channel.copyable && (
        <div className="mt-auto pt-3">
          <CopyAddress value={contact.email} />
        </div>
      )}
    </div>
  );
}

/**
 * `mailto:` does nothing for a visitor on webmail with no mail client
 * configured — it looks like a dead link. The address is selectable text and
 * this copies it, so that failure mode has an escape hatch.
 *
 * Sits above the stretched link, hence the z-index.
 */
function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked (insecure context, denied permission). The
          // address is still on screen to select by hand.
        }
      }}
      className="relative z-10 rounded-sm border border-line px-2 py-1.5 text-[0.6875rem] text-bone-52 transition-colors duration-fast ease-fast hover:border-line-strong hover:text-bone"
    >
      {copied ? contactCopy.copiedLabel : contactCopy.copyLabel}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${value} ${contactCopy.copiedLabel}` : ""}
      </span>
    </button>
  );
}
