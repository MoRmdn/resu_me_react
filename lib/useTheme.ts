"use client";

import { useSyncExternalStore } from "react";
import { currentThemeMode, type ThemeMode } from "./theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-mode"] });
  return () => observer.disconnect();
}

/** The visitor's theme choice (auto, light or dark); null in server HTML. */
export function useThemeMode(): ThemeMode | null {
  return useSyncExternalStore(subscribe, currentThemeMode, () => null);
}
