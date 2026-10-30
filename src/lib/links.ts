/** External destinations. Override per deployment with NEXT_PUBLIC_* variables. */
export const links = {
  testflight: process.env.NEXT_PUBLIC_TESTFLIGHT_URL ?? "https://testflight.apple.com/join/REPLACE_ME",
  windows: process.env.NEXT_PUBLIC_WINDOWS_URL || "https://github.com/jaiten/Orbit/releases/download/v0.3.10/Orbit-Setup-0.3.10.exe",
  windowsReleases: "https://github.com/jaiten/Orbit/releases/latest",
  github: "https://github.com/jaiten/Orbit",
  support: "/support/",
  privacy: "/privacy/",
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbit-web.vercel.app";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefix for files in /public (plain <img>, <video> and <source> don't get the basePath automatically). */
export const asset = (path: string) => `${basePath}${path}`;
