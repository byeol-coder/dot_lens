import path from "node:path";

const __dirname = path.resolve();

// Static export for GitHub Pages project site (byeol-coder.github.io/dot_lens).
// basePath/assetPrefix are applied only in production builds so local `next dev`
// stays at "/". Override the base by setting PAGES_BASE_PATH if the repo is renamed.
const isProd = process.env.NODE_ENV === "production";
const basePath = process.env.PAGES_BASE_PATH ?? (isProd ? "/dot_lens" : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  // Expose basePath to the client (for any manual asset URLs).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
