"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { Faq } from "@/content/services";
import { trackAttrs } from "@/lib/analytics/attrs";
import { cn } from "@/lib/cn";

/**
 * The Services FAQ, every answer collapsed until asked for.
 *
 * Closed answers stay in the DOM, as the Experience panels do: that is what
 * keeps them in the served HTML for crawlers and for the FAQPage structured
 * data, which must describe text that is on the page. They carry `inert` when
 * closed, so they leave the tab order and the accessibility tree. With
 * scripting off, `.disclosure` stands open and nothing is hidden.
 *
 * Answers open independently. Someone comparing two answers should not lose
 * the first by opening the second.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <ul className="border-t border-line">
      {faqs.map((faq, i) => {
        const isOpen = open.has(faq.slug);
        const panelId = `faq-panel-${faq.slug}`;

        return (
          <Reveal as="li" key={faq.slug} delay={Math.min(i * 0.04, 0.2)} className="border-b border-line">
            <h4>
              <button
                type="button"
                onClick={() => toggle(faq.slug)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-fast ease-fast hover:bg-bone/[0.02] md:px-2"
                {...trackAttrs("faq_toggle", {
                  faq_ref: faq.slug,
                  toggle_action: isOpen ? "close" : "open",
                  toggle_method: "list_row",
                })}
              >
                <span className="text-h3 text-bone">{faq.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 text-lg leading-none transition-[transform,color] duration-base ease-base",
                    isOpen ? "rotate-45 text-bone" : "text-bone-28 group-hover:text-bone-52",
                  )}
                >
                  +
                </span>
              </button>
            </h4>

            <div id={panelId} className="disclosure" data-open={isOpen} inert={!isOpen}>
              <div>
                <p className="max-w-[62ch] pb-7 text-body text-bone-70 md:px-2">{faq.answer}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
