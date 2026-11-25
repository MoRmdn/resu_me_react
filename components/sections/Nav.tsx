"use client";

import type { LocaleProps } from "@/content/locale";
import { getProfile } from "@/content/profile-i18n";
import { ui } from "@/content/copy-i18n";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { useEffect, useMemo, useRef, useState } from "react";
import { MoRmdnLockup } from "@/components/brand/MoRmdnLockup";
import { site } from "@/content/site";
import { trackAttrs } from "@/lib/analytics/attrs";
import { track } from "@/lib/analytics/gtag";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { cn } from "@/lib/cn";

export function Nav({ locale = "en" }: LocaleProps) {
  // Memoised by locale: getProfile("ar") builds fresh arrays per call, and an
  // unstable SECTION_IDS makes useScrollSpy tear down and rebuild its
  // IntersectionObserver on every scroll-spy state change.
  const { navSections } = useMemo(() => getProfile(locale), [locale]);
  const copy = ui[locale];
  const SECTION_IDS = useMemo(() => navSections.map((s) => s.id), [navSections]);
  const LINKS = navSections.filter((s) => s.id !== "contact");
  const active = useScrollSpy(SECTION_IDS);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink-900">
        <nav
          aria-label={copy.primary}
          className="mx-auto flex h-16 max-w-content items-center justify-between gap-3 px-5 md:px-8"
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
                    "absolute inset-x-3 bottom-1 h-px bg-bone-52 transition-opacity duration-fast ease-fast",
                    active === link.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </a>
            ))}
            <a
              href="#contact"
              className="ms-2 inline-flex min-h-11 items-center rounded-md border border-line px-4 text-caption font-medium text-bone transition-colors duration-fast ease-fast hover:bg-bone-06"
              {...trackAttrs("cta_click", { cta_id: "nav_hire_me", link_text: copy.hire })}
            >
              {copy.hire}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitch locale={locale} />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex size-11 items-center justify-center rounded-md text-bone lg:hidden"
              {...trackAttrs("nav_menu_toggle", {
                menu_action: "open",
                toggle_method: "menu_button",
              })}
            >
              <span className="sr-only">{copy.openMenu}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path d="M0 4h18M0 9h18M0 14h18" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
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
            className="absolute inset-0 h-full w-full bg-ink-900/80"
            {...trackAttrs("nav_menu_toggle", { menu_action: "close", toggle_method: "backdrop" })}
          />
          <div
            ref={sheet}
            className="absolute inset-x-0 bottom-0 rounded-t-[20px] border-t border-line bg-ink-700 pt-3 pb-8 motion-safe:animate-[rise-in_0.32s_var(--ease-base)_both]"
          >
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
