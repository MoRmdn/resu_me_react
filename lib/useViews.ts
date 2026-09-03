"use client";

import { useEffect, useState } from "react";
import { DB_PATHS, getDb, getRtdb } from "./firebase";

/**
 * Live page-view count.
 *
 * The Flutter app opened this stream twice — once in HomePage, once in
 * HeroSection — and incremented from a third place. Here the increment runs
 * exactly once per page load (the module-level flag survives React's
 * development double-effect) and every consumer shares one subscription.
 */
let hasIncremented = false;
let sharedCount: number | null = null;
const listeners = new Set<(n: number | null) => void>();
let unsubscribe: (() => void) | null = null;
let subscribing = false;

function publish(value: number | null) {
  sharedCount = value;
  listeners.forEach((l) => l(value));
}

async function ensureSubscription() {
  if (unsubscribe || subscribing) return;
  subscribing = true;

  const [db, { onValue, ref }] = await Promise.all([getDb(), getRtdb()]);
  if (!db) {
    subscribing = false;
    return;
  }

  // Everyone may have unmounted while the SDK was loading.
  if (listeners.size === 0) {
    subscribing = false;
    return;
  }

  unsubscribe = onValue(
    ref(db, DB_PATHS.viewsTotal),
    (snapshot) => {
      const value = snapshot.val();
      publish(typeof value === "number" ? value : null);
    },
    // Read denied or offline: the counter simply stays hidden.
    () => publish(null),
  );
  subscribing = false;
}

async function incrementOnce() {
  if (hasIncremented) return;
  hasIncremented = true;

  const [db, { ref, runTransaction, serverTimestamp, set }] = await Promise.all([
    getDb(),
    getRtdb(),
  ]);
  if (!db) return;

  try {
    await runTransaction(ref(db, DB_PATHS.viewsTotal), (current) =>
      (typeof current === "number" ? current : 0) + 1,
    );
    await set(ref(db, DB_PATHS.viewsUpdated), serverTimestamp());
  } catch {
    // A failed counter must never surface to the visitor.
  }
}

export function useViews({ increment = false }: { increment?: boolean } = {}) {
  const [views, setViews] = useState<number | null>(sharedCount);

  useEffect(() => {
    listeners.add(setViews);
    void ensureSubscription();
    if (increment) void incrementOnce();

    return () => {
      listeners.delete(setViews);
      if (listeners.size === 0 && unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };
  }, [increment]);

  return views;
}
