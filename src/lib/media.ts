/**
 * Everything you supply lives here. Flip `ready` to true once the file is in /public/media.
 * Until then the site draws each screen as live HTML/CSS.
 * Full list with sizes: MEDIA.md.
 */
export interface ScreenshotSlot {
  /** Path without extension, e.g. "/media/screens/ios-today". Needs .avif and .webp files. */
  base: string;
  width: number;
  height: number;
  alt: string;
  ready: boolean;
}

export const screenshots = {
  iosToday: { base: "/media/screens/ios-today", width: 1206, height: 2622, ready: false, alt: "Orbit on iPhone showing the Today screen: two tasks, one habit and a progress bar." },
  windowsToday: { base: "/media/screens/windows-today", width: 2200, height: 1360, ready: false, alt: "Orbit on Windows showing the Today screen with a sidebar, tasks and habits." },
} satisfies Record<string, ScreenshotSlot>;
