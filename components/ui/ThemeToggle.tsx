"use client";

import { ui } from "@/content/copy-i18n";
import type { Locale } from "@/content/locale";
import { trackAttrs } from "@/lib/analytics/attrs";
import { nextThemeMode, setThemeMode, type ThemeMode } from "@/lib/theme";
import { useThemeMode } from "@/lib/useTheme";

/** One glyph per theme mode: half-filled for auto, sun for light, moon for dark. */
function ThemeIcon({ mode }: { mode: ThemeMode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      {mode === "auto" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
        </>
      )}
      {mode === "light" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" strokeLinecap="round" />
        </>
      )}
      {mode === "dark" && <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" strokeLinejoin="round" />}
    </svg>
  );
}

/**
 * Cycles auto → light → dark → auto. The name says the current mode and
 * contains the visible label, so voice control can target it. Shared by the
 * homepage nav and the header of every other page.
 */
export function ThemeToggle({
  locale,
  className,
  withLabel = false,
  tabIndex,
}: {
  locale: Locale;
  className: string;
  withLabel?: boolean;
  tabIndex?: number;
}) {
  const copy = ui[locale];
  // Null in server HTML; auto is the default, so that is what it renders.
  const themeMode = useThemeMode() ?? "auto";
  const nextMode = nextThemeMode(themeMode);
  const modeLabel = { auto: copy.themeAuto, light: copy.themeLight, dark: copy.themeDark };
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={() => setThemeMode(nextMode)}
      aria-label={`${copy.theme}: ${modeLabel[themeMode]}`}
      title={withLabel ? undefined : `${copy.theme}: ${modeLabel[themeMode]}`}
      className={className}
      {...trackAttrs("theme_toggle", { theme_choice: nextMode })}
    >
      <ThemeIcon mode={themeMode} />
      {withLabel && modeLabel[themeMode]}
    </button>
  );
}
