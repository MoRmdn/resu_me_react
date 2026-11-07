"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False in server HTML and the hydration render, true immediately afterwards.
 * Lets interactive widgets add browser-only accessibility state without a
 * hydration mismatch or removing their content from the served document.
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
