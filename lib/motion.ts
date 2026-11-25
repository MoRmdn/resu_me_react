import type { CSSProperties } from "react";

/**
 * Stagger index for `.enter` and `[data-reveal]` (see globals.css): each step
 * delays the element by one beat. Returned as a style object so server
 * components can use it without shipping JavaScript.
 */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
