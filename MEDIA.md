# Media to supply (optional)

The site draws the iPhone and Windows screens as live HTML/CSS. To show real screenshots instead,
drop files in `public/media/screens/` and set `ready: true` for that slot in `src/lib/media.ts`.

| Files (AVIF + WebP of each, same basename) | Size | Content |
|---|---|---|
| `ios-today.avif` / `.webp` | 1206 × 2622 | iPhone 16 Pro Today screen, light theme |
| `windows-today.avif` / `.webp` | 2200 × 1360 | Orbit window content area only (the site draws the Windows 11 title bar) |

Social images, favicon and apple icon are generated: `npm run build && npm run assets`.
