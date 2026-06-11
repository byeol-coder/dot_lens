import path from "node:path";

const __dirname = path.resolve();
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
};
export default nextConfig;
