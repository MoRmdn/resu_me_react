/**
 * Light (Ledger) and dark (Obsidian). The inline script in DocumentShell reads
 * the same key before first paint; keep the two in step.
 */
export type Theme = "light" | "dark";
export const THEME_KEY = "theme";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or storage disabled: the choice lasts for this page only.
  }
}
