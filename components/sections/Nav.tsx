"use client";

import type { LocaleProps } from "@/content/locale";
import { getProfile } from "@/content/profile-i18n";
import { ui } from "@/content/copy-i18n";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { useEffect, useRef, useState } from "react";
import { MoRmdnLockup } from "@/components/brand/MoRmdnLockup";
import { site } from "@/content/site";
import { trackAttrs } from "@/lib/analytics/attrs";
import { track } from "@/lib/analytics/gtag";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { cn } from "@/lib/cn";

export function Nav({ locale = "en" }: LocaleProps) {
  const { navSections } = getProfile(locale);
  const copy = ui[locale];
  const SECTION_IDS = navSections.map((s) => s.id);
  const LINKS = navSections.filter((s) => s.id !== "contact");
  const active = useScrollSpy(SECTION_IDS);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  /**
   * The hero CTA and this button are both solid copper, and DESIGN-SYSTEM v2
   * §1.3 allows exactly one Tier 1 fill per viewport. So while the hero is on
   * screen this renders ghost, and it takes the copper once the hero's own CTA
   * has scrolled away. The two are never lit at the same time.
   */
  useEffect(() => {
    const sentinel = document.getElementById("hero-end");
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      // Top margin shrinks the root by the nav's height, so the swap lands as
      // the hero's bottom edge passes under the pill. The huge bottom margin
      // is what makes it reliable: it means the sentinel counts as
      // intersecting anywhere below the nav, so the only transition is the
      // one at the nav line. Without it, an instant jump (a deep link, scroll
      // restoration) carries the sentinel through the root between samples
      // and no callback fires at all.
      rootMargin: "-88px 0px 100000px 0px",
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // The sheet is modal: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!open) return;
    const opener = menuButton.current;
    const controls = () => [...(sheet.current?.querySelectorAll<HTMLElement>("a, button") ?? [])];
    controls()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const items = controls();
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
        return;
      }
      if (e.key !== "Escape") return;
      track("nav_menu_toggle", { menu_action: "close", toggle_method: "escape" });
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-5 pt-5 md:px-8">
        <nav
          aria-label={copy.primary}
          className="mx-auto flex h-[58px] max-w-content items-center justify-between rounded-pill border border-line bg-ink-700/72 px-3 ps-5 backdrop-blur-xl"
          style={{ boxShadow: "0 18px 50px rgb(0 0 0 / 0.5)" }}
        >
          <a
            href="#top"
            // The accessible name has to contain the visible wordmark (WCAG
            // 2.5.3, label in name), or "click MoRmdn" fails for voice control.
            aria-label={`${site.shortName}, ${copy.home}`}
            className="inline-flex min-h-11 items-center rounded-sm"
            {...trackAttrs("nav_link_click", {
              link_target: "top",
              link_text: "Logo",
              nav_location: "header",
            })}
          >
            <MoRmdnLockup />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-2 text-[0.84375rem] transition-colors duration-fast ease-fast",
                  active === link.id ? "text-bone" : "text-bone-62 hover:text-bone",
                )}
                {...trackAttrs("nav_link_click", {
                  link_target: link.id,
                  link_text: link.label,
                  nav_location: "header",
                })}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-bone-28",
                    "transition-transform duration-base ease-base",
                    active === link.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            ))}
            <a
              href="#contact"
              className={cn(
                "ms-2 inline-flex h-10 items-center rounded-pill px-5 text-[0.84375rem] font-semibold",
                "transition-[background-color,border-color,color,transform] duration-fast ease-fast hover:-translate-y-0.5",
                pastHero && active !== "contact"
                  ? "bg-copper text-ink-900 hover:bg-copper-bright"
                  : "border border-line-strong text-bone hover:border-copper hover:bg-bone-06",
              )}
              {...trackAttrs("cta_click", { cta_id: "nav_hire_me", link_text: "Hire me" })}
            >
              {copy.hire}
            </a>
          </div>

          <LanguageSwitch locale={locale} />
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-11 items-center justify-center rounded-pill text-bone lg:hidden"
            {...trackAttrs("nav_menu_toggle", {
              menu_action: "open",
              toggle_method: "menu_button",
            })}
          >
            <span className="sr-only">{copy.openMenu}</span>
            <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </nav>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-label={copy.primary}
          aria-modal="true"
          id="mobile-nav"
        >
          <button
            type="button"
            aria-label={copy.closeMenu}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink-900/70 backdrop-blur-sm"
            {...trackAttrs("nav_menu_toggle", { menu_action: "close", toggle_method: "backdrop" })}
          />
          <div
            ref={sheet}
            className="absolute inset-x-0 bottom-0 rounded-t-[20px] border-t border-line bg-ink-700 pt-3 pb-8 motion-safe:animate-[rise-in_0.32s_var(--ease-base)_both]"
          >
            <div className="mx-auto mb-6 h-1 w-9 rounded-pill bg-bone-18" aria-hidden />
            <div className="px-5 pb-3">
              <LanguageSwitch locale={locale} />
            </div>
            <ul className="px-5">
              {navSections.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center border-b border-line text-body-l",
                      active === link.id ? "font-semibold text-copper" : "text-bone",
                    )}
                    {...trackAttrs("nav_link_click", {
                      link_target: link.id,
                      link_text: link.label,
                      nav_location: "mobile_menu",
                    })}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
