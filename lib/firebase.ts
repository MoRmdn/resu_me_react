"use client";

import type { Database } from "firebase/database";

/**
 * Firebase is loaded dynamically, never at module scope.
 *
 * The SDK is ~350KB of the bundle and nothing on the page needs it to render —
 * the view counter and the contact form are both post-hydration concerns. A
 * static `import` pulled it onto the critical path and roughly tripled the
 * first-load payload, which would have thrown away most of the reason for
 * leaving Flutter Web in the first place.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(config.databaseURL && config.projectId);

let dbPromise: Promise<Database | null> | null = null;

/** Resolves to null when unconfigured or server-side, so callers degrade quietly. */
export function getDb(): Promise<Database | null> {
  if (typeof window === "undefined" || !isFirebaseConfigured) return Promise.resolve(null);

  dbPromise ??= (async () => {
    try {
      const [{ initializeApp, getApps, getApp }, { getDatabase }] = await Promise.all([
        import("firebase/app"),
        import("firebase/database"),
      ]);
      const app = getApps().length ? getApp() : initializeApp(config);
      return getDatabase(app);
    } catch {
      return null;
    }
  })();

  return dbPromise;
}

/** The Realtime Database module, loaded on demand alongside the app. */
export function getRtdb() {
  return import("firebase/database");
}

/** Paths are unchanged from the Flutter app, so database.rules.json and the
 *  existing admin inbox keep working against them. */
export const DB_PATHS = {
  views: "views",
  viewsTotal: "views/total",
  viewsUpdated: "views/lastUpdated",
  contactSubmissions: "contact_submissions",
} as const;
