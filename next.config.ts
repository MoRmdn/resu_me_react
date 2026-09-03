import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Static export: the whole site is prerendered to plain HTML in ./out and
  // served by Firebase Hosting. This is the point of the port — the markup has
  // to exist without JavaScript so crawlers and screen readers can read it.
  output: "export",

  // Static export has no image-optimisation server. Responsive WebP/AVIF
  // variants are generated ahead of time by scripts/optimize-images.mjs.
  images: { unoptimized: true },

  // Firebase Hosting serves /about as /about/index.html.
  trailingSlash: true,

  // A stray package-lock.json in $HOME makes Turbopack guess the home directory
  // as the workspace root. Pin it to this project.
  turbopack: { root: path.resolve(process.cwd()) },
};

export default nextConfig;
