"use client";

import { useEffect } from "react";

/** Bring an opened panel into view after its layout is committed. */
export function useKeepInView(id: string | null) {
  useEffect(() => {
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "nearest" });
  }, [id]);
}
