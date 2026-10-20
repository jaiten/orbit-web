# Media to supply

Drop files in `public/media/…`, then set `ready: true` for that slot in `src/lib/media.ts`.
Until then, screenshots are drawn as live HTML/CSS and videos show a marked placeholder.

## Screenshots (AVIF + WebP of each, same basename)
| Files | Size | Content |
|---|---|---|
| `public/media/screens/ios-today.avif` / `.webp` | 1206 × 2622 | iPhone 16 Pro Today screen, light theme, no status-bar clutter |
| `public/media/screens/windows-today.avif` / `.webp` | 2200 × 1360 | Orbit window content area only (the site draws the Windows 11 title bar) |

## Videos (muted loops, under 2 MB each, WebM + MP4 + poster)
| Files | Size | Shows |
|---|---|---|
| `public/media/video/quick-add.webm` / `.mp4`, `public/media/posters/quick-add.webp` | 720 × 1280 | Typing “gym tomorrow 6pm”, chip updating |
| `tick-items` (same three files) | 720 × 1280 | Ticking items off Today |
| `drag-to-habits` | 720 × 1280 | Dragging a task into Habits |
| `widget-update` | 720 × 1280 | A Home Screen widget updating |
| `siri-add` | 720 × 1280 | Siri running Add to Orbit (an extra slot, used in the Siri card) |

Posters are WebP at the same size. Social images, favicon and apple icon are generated: `npm run build && npm run assets`.
