"use client";

import { useEffect, useState } from "react";

/**
 * On a phone there is no room to stack an Arabic review over its translation:
 * one long card makes a row 860px tall. Below `md` the wall shows one language
 * at a time, translation first, and this switches between them.
 *
 * It only flips a data attribute. Both languages stay in the DOM and the served
 * HTML. Hidden from `md` up, where both are always shown, and without
 * scripting, when the CSS falls back to showing both.
 */
export function ReviewLanguageToggle({
  target,
  showOriginalLabel,
  showTranslationLabel,
}: {
  target: string;
  showOriginalLabel: string;
  showTranslationLabel: string;
}) {
  const [original, setOriginal] = useState(false);

  useEffect(() => {
    document
      .getElementById(target)
      ?.setAttribute("data-review-lang", original ? "original" : "translation");
  }, [original, target]);

  return (
    <button
      type="button"
      aria-pressed={original}
      onClick={() => setOriginal((o) => !o)}
      className="review-lang-toggle inline-flex min-h-11 items-center rounded-md border border-line px-3.5 text-caption text-bone-70 transition-colors duration-fast ease-fast hover:border-line-strong hover:text-bone"
    >
      {original ? showTranslationLabel : showOriginalLabel}
    </button>
  );
}
