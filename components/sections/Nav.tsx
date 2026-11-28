"use client";

import type { LocaleProps } from "@/content/locale";
import { getProfile } from "@/content/profile-i18n";
import { getCopy, ui } from "@/content/copy-i18n";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useEffect, useMemo, useRef, useState } from "react";
import { MoRmdnMark } from "@/components/brand/MoRmdnMark";
import { channels, site } from "@/content/site";
import { trackAttrs } from "@/lib/analytics/attrs";
import { track } from "@/lib/analytics/gtag";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { useHydrated } from "@/lib/useHydrated";
import { cn } from "@/lib/cn";
import { whatsappWith } from "@/lib/paths";

/** Ledger numbering, the page's signature: 01 Services … 07 Contact. */
const index = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The nav island and, on wide screens, the section rail. Both share one
 * scroll-spy. The progress ring is written straight to a CSS variable inside
 * a rAF callback, so scrolling never re-renders React.
 */
export function Nav({ locale = "en" }: LocaleProps) {
  // Memoised by locale: getProfile("ar") builds fresh arrays per call, and an
  // unstable id list makes useScrollSpy rebuild its observer on every render.
  const { navSections } = useMemo(() => getProfile(locale), [locale]);
  const copy = ui[locale];
  const { contactCopy } = getCopy(locale);
  const whatsapp = channels.find((c) => c.id === "whatsapp")!;
  const ids = useMemo(() => navSections.map((s) => s.id), [navSections]);
  const active = useScrollSpy(ids);
  const activeIndex = navSections.findIndex((s) => s.id === active);
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const ring = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(1, scrollY / max) : 0;
      ring.current?.style.setProperty("--progress", `${Math.max(2, Math.round(progress * 100))}%`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      track("nav_menu_toggle", { menu_action: "close", toggle_method: "escape" });
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Closed links leave the tab order only once JavaScript can open them again.
  const linkTab = hydrated && !open ? -1 : undefined;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex flex-col items-center gap-2 px-3">
        <nav
          aria-label={copy.primary}
          className="pointer-events-auto flex h-14 max-w-full items-center gap-1 rounded-pill border border-line bg-ink-800 ps-3 pe-1.5 shadow-[0_18px_40px_-18px_var(--color-shadow)]"
        >
          <a
            href="#top"
            aria-label={`${site.shortName}, ${copy.home}`}
            className="grid h-11 w-9 shrink-0 place-items-center rounded-pill"
            {...trackAttrs("nav_link_click", { link_target: "top", link_text: "Logo", nav_location: "header" })}
          >
            <MoRmdnMark size={24} />
          </a>

          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={open ? "nav-links nav-sheet" : "nav-links"}
            className="inline-flex h-11 min-w-0 items-center gap-2 rounded-pill px-2 text-[0.90625rem] sm:gap-2.5 sm:px-2.5 font-semibold text-bone transition-colors duration-fast ease-fast hover:bg-bone-06"
            {...trackAttrs("nav_menu_toggle", {
              menu_action: open ? "close" : "open",
              toggle_method: "menu_button",
            })}
          >
            <span
              ref={ring}
              aria-hidden
              className="relative size-[18px] shrink-0 rounded-pill bg-[conic-gradient(var(--color-copper)_var(--progress,2%),var(--color-line-strong)_0)]"
            >
              <span className="absolute inset-[3px] rounded-pill bg-ink-800" />
            </span>
            {/* The label gives way first on a narrow phone, so the language
                switch and the WhatsApp button always fit. */}
            <span className="truncate">
              <span className="sr-only">{open ? copy.closeMenu : copy.openMenu}: </span>
              {activeIndex >= 0 ? navSections[activeIndex].label : copy.intro}
            </span>
            <span aria-hidden className="hidden font-mono text-[0.75rem] font-normal text-bone-52 tabular sm:inline">
              {activeIndex >= 0 ? activeIndex + 1 : 0}/{navSections.length}
            </span>
            <span
              aria-hidden
              className={cn(
                "text-[0.9375rem] text-bone-52 transition-transform duration-base ease-base max-[359px]:hidden rtl:-scale-x-100",
                open && "rotate-90",
              )}
            >
              ›
            </span>
          </button>

          <div
            id="nav-links"
            data-open={open}
            className="island-links hidden items-center gap-0.5 overflow-hidden lg:flex"
          >
            <span aria-hidden className="mx-1.5 h-[22px] w-px shrink-0 bg-line-strong" />
            {navSections.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                tabIndex={linkTab}
                onClick={() => setOpen(false)}
                aria-current={active === link.id ? "location" : undefined}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-pill px-3 text-[0.875rem] transition-colors duration-fast ease-fast",
                  active === link.id ? "bg-bone-06 text-bone" : "text-bone-70 hover:text-bone",
                )}
                {...trackAttrs("nav_link_click", {
                  link_target: link.id,
                  link_text: link.label,
                  nav_location: "header",
                })}
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle
              locale={locale}
              className="ms-0.5 grid size-10 shrink-0 place-items-center rounded-pill text-bone transition-colors duration-fast ease-fast hover:bg-bone-06"
              tabIndex={linkTab}
            />
          </div>

          {/* At every width: someone who reads Arabic first and lands on the
              English page must not have to open a menu to find it. */}
          <LanguageSwitch locale={locale} className="rounded-pill px-2 hover:bg-bone-06 sm:px-3" />

          <a
            href={whatsappWith(whatsapp.url, contactCopy.whatsappMessage)}
            target="_blank"
            rel="noreferrer noopener"
            className="ms-1 inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-pill bg-bone px-3 text-[0.875rem] font-semibold text-ink-900 sm:px-4 transition-colors duration-fast ease-fast hover:bg-bone-70"
            {...trackAttrs("contact_channel_click", {
              channel_id: whatsapp.id,
              channel_label: copy.whatsapp,
              channel_placement: "nav",
            })}
          >
            {copy.whatsapp}
            <span className="sr-only">{copy.external}</span>
          </a>
        </nav>

        {open && (
          <div
            id="nav-sheet"
            className="pointer-events-auto w-[min(380px,100%)] rounded-[22px] border border-line bg-ink-700 p-2 shadow-[0_30px_60px_-24px_var(--color-shadow)] motion-safe:animate-[rise-in_0.32s_var(--ease-base)_both] lg:hidden"
          >
            <ul>
              {navSections.map((link, i) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.id ? "location" : undefined}
                    className={cn(
                      "flex min-h-12 items-center gap-3.5 rounded-[14px] px-3.5 text-body text-bone",
                      active === link.id && "bg-bone-06",
                    )}
                    {...trackAttrs("nav_link_click", {
                      link_target: link.id,
                      link_text: link.label,
                      nav_location: "mobile_menu",
                    })}
                  >
                    <span className={cn("font-mono text-[0.75rem] tabular", active === link.id ? "text-copper" : "text-bone-52")}>
                      {index(i)}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-1.5 flex items-center justify-end gap-2 border-t border-line px-1.5 pt-2.5 pb-1">
              <ThemeToggle
                locale={locale}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3.5 text-caption font-medium text-bone"
                withLabel
              />
            </div>
          </div>
        )}
      </header>

      <nav
        aria-label={copy.sections}
        className="fixed start-7 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-0.5 min-[1600px]:flex"
      >
        {navSections.map((link, i) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={active === link.id ? "location" : undefined}
            className={cn(
              "grid min-h-8 grid-cols-[22px_auto] items-center gap-2.5 text-caption transition-colors duration-fast ease-fast hover:text-bone",
              active === link.id ? "text-bone" : "text-bone-52",
            )}
            {...trackAttrs("nav_link_click", {
              link_target: link.id,
              link_text: link.label,
              nav_location: "section_rail",
            })}
          >
            <span className="font-mono text-[0.75rem] tabular">{index(i)}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
