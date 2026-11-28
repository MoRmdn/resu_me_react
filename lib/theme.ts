/**
 * Light (Ledger) and dark (Obsidian), plus auto, the default, which follows
 * the system setting live. Auto is the absence of a stored choice.
 *
 * `themeScript` runs inline before first paint (DocumentShell) and stays on
 * the page: it re-applies on an OS theme change and on a choice made in
 * another tab. It sets two attributes on <html>:
 *   data-theme       the resolved theme, "light" | "dark" (what the CSS reads)
 *   data-theme-mode  the visitor's choice, "auto" | "light" | "dark"
 */
export type Theme = "light" | "dark";
export type ThemeMode = "auto" | Theme;
export const THEME_KEY = "theme";
export const THEME_MODES: readonly ThemeMode[] = ["auto", "light", "dark"];

export const themeScript = `(function(){var d=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");function a(){var s=null;try{s=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}if(s!=="light"&&s!=="dark")s=null;d.dataset.themeMode=s||"auto";d.dataset.theme=s||(m.matches?"dark":"light")}a();window.__applyTheme=a;try{m.addEventListener("change",a)}catch(e){m.addListener(a)}addEventListener("storage",function(e){if(e.key===${JSON.stringify(THEME_KEY)})a()})})()`;

declare global {
  interface Window {
    __applyTheme?: () => void;
  }
}

export function currentThemeMode(): ThemeMode {
  const mode = document.documentElement.dataset.themeMode;
  return mode === "light" || mode === "dark" ? mode : "auto";
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length];
}

export function setThemeMode(mode: ThemeMode) {
  try {
    if (mode === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, mode);
  } catch {
    // Private mode or storage disabled: the choice lasts for this page only.
  }
  const root = document.documentElement;
  root.dataset.themeMode = mode;
  root.dataset.theme =
    mode === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
}
