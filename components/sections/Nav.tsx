"use client";

import { useEffect, useState } from "react";
import { MoRmdnLockup } from "@/components/brand/MoRmdnLockup";
import { navSections } from "@/content/site";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { cn } from "@/lib/cn";

const SECTION_IDS = navSections.map((s) => s.id);
const LINKS = navSections.filter((s) => s.id !== "contact");

export function Nav() {
  const active = useScrollSpy(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  /**
   * The hero CTA and this button are both solid copper, and DESIGN-SYSTEM v2
   * §1.3 allows exactly one Tier 1 fill per viewport. So while the hero is on
   * screen this renders ghost, and it takes the copper once the hero's own CTA
   * has scrolled away. The two are never lit at the same time.
   */
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      // Fires once the hero is more than half gone.
      { threshold: 0.5 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // The sheet is modal: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-5 pt-5 md:px-8">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[58px] max-w-content items-center justify-between rounded-pill border border-line bg-ink-700/72 px-3 pl-5 backdrop-blur-xl"
          style={{ boxShadow: "0 18px 50px rgb(0 0 0 / 0.5)" }}
        >
          <a
            href="#top"
            aria-label="Back to top"
            className="inline-flex min-h-11 items-center rounded-sm"
          >
            <MoRmdnLockup />
          </a>

          <div className="hidden items-center gap-1 sm:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-2 text-[0.84375rem] transition-colors duration-fast ease-fast",
                  active === link.id ? "text-bone" : "text-bone-62 hover:text-bone",
                )}
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
                "ml-2 inline-flex h-10 items-center rounded-pill px-5 text-[0.84375rem] font-semibold",
                "transition-[background-color,border-color,color,transform] duration-fast ease-fast hover:-translate-y-0.5",
                pastHero
                  ? "bg-copper text-ink-900 hover:bg-copper-bright"
                  : "border border-line-strong text-bone hover:border-copper hover:bg-bone-06",
              )}
            >
              Hire me
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-11 items-center justify-center rounded-pill text-bone sm:hidden"
          >
            <span className="sr-only">Open menu</span>
            <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true" id="mobile-nav">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink-900/70 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[20px] border-t border-line bg-ink-700 pt-3 pb-8 motion-safe:animate-[rise-in_0.32s_var(--ease-base)_both]">
            <div className="mx-auto mb-6 h-1 w-9 rounded-pill bg-bone-18" aria-hidden />
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
