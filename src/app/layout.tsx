import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/theme/Providers";
import { siteUrl } from "@/lib/links";

// Inter (variable, Latin), self-hosted and preloaded by Next so text paints with the right font straight away.
const inter = localFont({ src: "./fonts/Inter-latin.woff2", weight: "100 900", display: "swap", variable: "--font-inter", adjustFontFallback: "Arial" });

const description = "Orbit is a calm planner for iPhone and Windows. Capture anything, plan today, see your progress. Local-first, free, and yours to export.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Orbit — A little space for what matters", template: "%s · Orbit" },
  description,
  applicationName: "Orbit",
  openGraph: { type: "website", siteName: "Orbit", title: "Orbit — A little space for what matters", description, url: "/" },
  twitter: { card: "summary_large_image", title: "Orbit — A little space for what matters", description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
  colorScheme: "light dark",
};

// Applies a saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("orbit-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-btn px-4 py-2 text-on-btn">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
