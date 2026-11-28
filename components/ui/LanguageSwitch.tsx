"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/locale";
import { ui } from "@/content/copy-i18n";
import { trackAttrs } from "@/lib/analytics/attrs";

/**
 * A full navigation gives each language its own server-rendered document.
 * `path` is the page under the locale root (`privacy/`, `projects/ayco/`), so
 * the switch lands on the same page in the other language.
 */
export function LanguageSwitch({
  locale,
  path = "",
  className = "rounded-md border border-line px-3",
}: {
  locale: Locale;
  path?: string;
  className?: string;
}) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const target = locale === "en" ? "ar" : "en";
  const href = `${target === "ar" ? "/ar/" : "/"}${path}${hash}`;
  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={`${ui[locale].language}: ${target === "ar" ? ui[locale].arabic : ui[locale].english}`}
      className={`inline-flex min-h-11 shrink-0 items-center text-caption text-bone ${className}`}
      {...trackAttrs("language_switch", { target_locale: target })}
    >
      {target === "ar" ? ui[locale].arabic : ui[locale].english}
    </a>
  );
}
