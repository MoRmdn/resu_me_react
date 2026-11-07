"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/locale";
import { ui } from "@/content/copy-i18n";
import { trackAttrs } from "@/lib/analytics/attrs";

/** A full navigation gives each language its own server-rendered document. */
export function LanguageSwitch({ locale, privacy = false }: { locale: Locale; privacy?: boolean }) {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const target = locale === "en" ? "ar" : "en";
  const href = `${target === "ar" ? "/ar/" : "/"}${privacy ? "privacy/" : ""}${hash}`;
  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={`${ui[locale].language}: ${target === "ar" ? ui[locale].arabic : ui[locale].english}`}
      className="inline-flex min-h-11 shrink-0 items-center rounded-md border border-line px-3 text-caption text-bone"
      {...trackAttrs("language_switch", { target_locale: target })}
    >
      {target === "ar" ? ui[locale].arabic : ui[locale].english}
    </a>
  );
}
