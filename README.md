# Orbit website

Marketing site for [Orbit](https://github.com/jaiten/Orbit), a calm planner for iPhone and Windows.
Next.js (App Router) + TypeScript + Tailwind v4, statically exported. Motion for React handles layout, scroll and springs; anime.js handles the ring, the dot and the staggered grid fills.

## Run, build, test
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm test           # runs Orbit's shared quick-add cases against the TS parser
npm run assets     # after a build: regenerates OG/Twitter images and the apple icon
node scripts/serve-out.mjs 4000   # serve out/ with gzip, like a host would
```

## Structure
- `src/styles/tokens.css`: the one place for colours, radii and themes (light, dark, system + toggle).
- `src/lib/motion.ts`: every spring, stagger and reveal preset. `src/lib/media.ts`: optional real screenshots. `src/lib/links.ts`: TestFlight / download URLs.
- `src/lib/quick-add.ts`: TS port of Orbit's shared parser; `scripts/test-quick-add.ts` checks it against the repo's 34 cases.
- `src/components/sections/*`: one component per section. `devices/` holds the iPhone and Windows frames and live Today screens. `widgets/` the widget styles.
- `kokonut/` and `bklit/`: see the note below.

## Kokonut UI and Bklit UI
The build sandbox could not reach their registries, so `components/kokonut` (bento grid, footer, button style) and `components/bklit` (habit grid, week bar, mini bars) are local components that follow their patterns, restyled to Orbit's tokens. To use the originals, add them with the shadcn CLI (`npx shadcn@latest add <registry url>`) and map the props; the call sites are small.

## Configuration
Set before building: `NEXT_PUBLIC_TESTFLIGHT_URL` (the beta link; defaults to a placeholder), `NEXT_PUBLIC_WINDOWS_URL` (defaults to the verified 0.3.9 Windows installer; update the fallback when publishing a new release), `NEXT_PUBLIC_SITE_URL` (for canonical, sitemap and social images), `NEXT_PUBLIC_BASE_PATH` (GitHub Pages project sites only).

## Deploy
**Vercel:** import the repo. Framework: Next.js. It detects the static export; add the env vars above. Done.

**GitHub Pages (optional, the workflow is manual-only):** Settings → Pages → Source: GitHub Actions, then run the "Deploy to GitHub Pages" workflow from the Actions tab. Optionally add a repository variable `TESTFLIGHT_URL`. Push to `main`; `.github/workflows/pages.yml` builds with the right base path and publishes. For a custom domain or a `<user>.github.io` repo, drop the base path line in the workflow.

## Notes
- Motion respects `prefers-reduced-motion`: movement becomes fades, the Today section is not pinned.
- Below-the-fold sections are server-rendered HTML that hydrate as they near the viewport (`LazyIsland`) to keep first load fast.
