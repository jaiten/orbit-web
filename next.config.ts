import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH=/orbit-web when deploying to GitHub Pages project sites.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
