/** @type {import('next').NextConfig} */

// When building for GitHub Pages the site is served from /<repo>/, so we need
// a basePath. Local dev and other hosts serve from root, so basePath is empty.
// The deploy workflow sets GITHUB_PAGES=true.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "dot_lens";

const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — required for GitHub Pages (no Node server).
  output: "export",
  // GitHub Pages has no Next image optimizer.
  images: { unoptimized: true },
  // Emit folder/index.html so /teacher/ resolves cleanly on static hosting.
  trailingSlash: true,
  ...(isGithubPages
    ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` }
    : {}),
};

export default nextConfig;
