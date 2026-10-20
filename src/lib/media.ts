/**
 * Everything you supply lives here. Flip `ready` to true once the file is in /public/media.
 * Until then each slot renders a clearly marked placeholder (videos) or the live HTML/CSS screen (screenshots).
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

export interface VideoSlot {
  /** Path without extension. Needs .webm, .mp4 and a poster .webp. */
  base: string;
  poster: string;
  width: number;
  height: number;
  /** What the video shows. Used as its description for screen readers. */
  description: string;
  ready: boolean;
}

export const screenshots = {
  iosToday: { base: "/media/screens/ios-today", width: 1206, height: 2622, ready: false, alt: "Orbit on iPhone showing the Today screen: two tasks, one habit and a progress bar." },
  windowsToday: { base: "/media/screens/windows-today", width: 2200, height: 1360, ready: false, alt: "Orbit on Windows showing the Today screen with a sidebar, tasks and habits." },
} satisfies Record<string, ScreenshotSlot>;

export const videos = {
  quickAdd: { base: "/media/video/quick-add", poster: "/media/posters/quick-add.webp", width: 720, height: 1280, ready: false, description: "Typing “gym tomorrow 6pm” into quick add while the chip updates to Task, Tomorrow, 6:00 PM." },
  tickItems: { base: "/media/video/tick-items", poster: "/media/posters/tick-items.webp", width: 720, height: 1280, ready: false, description: "Ticking items off on the Today screen while the progress bar fills." },
  dragToHabits: { base: "/media/video/drag-to-habits", poster: "/media/posters/drag-to-habits.webp", width: 720, height: 1280, ready: false, description: "Dragging a task into Habits so it becomes a daily habit." },
  widgetUpdate: { base: "/media/video/widget-update", poster: "/media/posters/widget-update.webp", width: 720, height: 1280, ready: false, description: "A Today widget on the iPhone Home Screen updating as an item is completed." },
  siri: { base: "/media/video/siri-add", poster: "/media/posters/siri-add.webp", width: 720, height: 1280, ready: false, description: "Using Siri to run Add to Orbit and capture a task by voice." },
} satisfies Record<string, VideoSlot>;
