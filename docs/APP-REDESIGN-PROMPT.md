# Prompt: make the Orbit apps look and feel like the website

Works in Claude Code (open in the `Orbit` repo), ChatGPT/Codex with repo access, or any chat model. If the model can't browse, attach 4–6 screenshots of the website (hero, Today, Habits, Widgets, Windows) and the files listed under "Read these first". Replace `SITE_URL` with your Vercel URL.

---

I have a planner called Orbit: an iPhone app (SwiftUI, `ios/`) and a Windows app (Electron, HTML/CSS/JS in `windows/ui/`) in this repo. My marketing website shows the UI I actually want the apps to have. The apps currently look less clean than the website's version of them. Your job: **make the real apps look and feel like the website's app screens.** Visual and motion pass only; do not change behaviour, data, sync, models or the meaning of any copy.

## Step 1: study the reference (do this before writing code)
1. Open `SITE_URL` in a browser and scroll the whole page. Pay attention to the live app screens: the iPhone and Windows Today screens in the hero, the pinned "A day you can actually finish" section (tasks slide in, overdue choices, tick animation), the Quick add chip, the Habits history grids, the widget tiles, and the Windows window with its sidebar. If you can't browse, use the attached screenshots.
2. Read the source of those screens in https://github.com/jaiten/orbit-web (or the attached files): `src/components/devices/TodayPhone.tsx`, `DesktopApp.tsx`, `screen-parts.tsx`, `src/components/widgets/Widgets.tsx`, `src/components/bklit/*`, `src/components/ui/Tick.tsx`, `src/lib/motion.ts`, `src/styles/tokens.css`.
3. Then read the apps: `shared/design-tokens.json`, `windows/ui/styles.css` + `windows/ui/pages/*.js`, `ios/Shared/Design.swift`, `ios/App/TodayView.swift`, `TodayRows.swift`, `HabitsView.swift`, `QuickCapture.swift`, `ios/Widgets/`.
4. Write a short gap list first: for each screen, what differs from the website (spacing, type, row styling, colour use, motion). Show it to me, then implement.

## Step 2: the design rules the website follows (match them)
- **Surfaces:** canvas `#F5F5F7` / `#141416`; cards and rows on `#FFFFFF` / `#1F1F21`; 1px lines `#E4E4E8` / `#323236`. Separation comes from the 1px line, not heavy shadows. Cards 18px radius, rows 12px, chips pill. 8px spacing scale; 20px screen padding; 24–32px between sections; no divider lines plus boxes together.
- **Type:** SF Pro (iOS) and Segoe UI Variable (Windows). Large title 34–36 bold, tight tracking (-0.03em). Tiny uppercase eyebrow labels (11–12px, +0.1em tracking, muted) above cards and sections ("YOUR PLAN", "TIME BLOCKS"). Body 15–17. Secondary text muted. Tabular numerals for counts and times.
- **Colour:** coral `#E87359` only for ticks, progress, selection and the one primary action. Coral text in light mode is `#B74F38`. Habit colours (sage `#6E8C78`, lavender `#8C85BF`, honey `#D19E4D`, clay `#D97A66`) appear only as 10px dots, grid boxes and bars, never large fills. Dark mode follows the system.
- **Copy:** calm and short: "Your plan", "2 of 5 done", "Saved locally", "Miss a day? Nothing breaks." No exclamation marks, no scores, no streaks, no guilt.

## Step 3: the components (build once per platform, then reuse everywhere)
1. **Plan card:** eyebrow "YOUR PLAN", "2 of 5 done" at 22px medium, 6px progress bar (coral on an 8%-ink track) that fills with a spring.
2. **Task row:** 46–56px tall, 12px radius, surface + 1px line. 24px round checkbox with a 2px coral-at-45% ring. On complete: ring fills coral, a white tick **draws itself** (stroke, ~280ms), the circle scales 1 → 1.14 → 1, the title goes muted with a strikethrough, and the row settles below the open ones with a spring.
3. **Overdue row:** same row with three pill buttons under the title: Today, Later, Someday (coral 12% fill, `#B74F38` text). Choosing one springs the row into place or away.
4. **Habit row:** 10px colour dot, title, muted "4 of 6". **History:** "5 of the last 7 days" as 7 rounded segments with M T W T F S S labels, plus a GitHub-style grid (12 weeks × 7 rows, 3px gaps, 3px-radius boxes, opacity 0.3–1 of the habit colour on a 7% ink track). One History page shows every habit this way.
5. **Quick add:** one rounded field with "+" and placeholder "gym tomorrow 6pm"; below it a pill chip (coral 12%) such as "Task · Tomorrow · 6:00 PM" whose segments animate in and out as you type and whose width springs.
6. **Windows shell:** 216px sidebar slightly darker than canvas; active item is a white pill with a 1px line and a coral icon (it slides between items); `Ctrl+1…5` shown right-aligned in small monospace; search field on top with `Ctrl+F`; "Saved locally" at the bottom. Two-column Today: tasks left; plan card, habits and a 12-week grid right. Quick add opens as a centred 480px card over a dimmed, slightly blurred window.
7. **iPhone shell:** five tabs (Today, Calendar, Lists, Habits, Settings), 24px line icons, active tab coral, translucent bar with blur. **Widgets:** Progress (ring small, bar medium/large), Checklist (tick from the Home Screen), Grid (boxes square, sized by available height); same type and eyebrow labels as the app.

## Step 4: motion
Springs, never linear: stiffness ~300, damping ~30 for UI; softer (response ~0.55) for large elements. SwiftUI: `.spring(response: 0.35, dampingFraction: 0.86)`. Windows: Web Animations API or CSS `linear()` spring approximations. Durations 200–600ms; animate only opacity and transform. Rows enter staggered 50ms apart, sliding 16–24px from the left while fading. Press feedback: scale 0.97–0.985. Respect Reduce Motion (iOS) and `prefers-reduced-motion` (Windows): swap movement for fades. Nothing loops by itself.

## Step 5: how to work
- `shared/design-tokens.json` stays the single source of truth; add anything missing there and regenerate (`npm run tokens` / `npm run generate` in `windows/`). Keep the token-drift test passing.
- Order: tokens → shared components → Today → Habits + History → Quick add → Calendar, Lists, Someday → Settings and Onboarding → widgets.
- One commit per screen, run the existing tests after each (`windows/tests`, `ios/Tests`, UI tests), and keep every screen working at each step.
- Check light and dark, Dynamic Type at the largest sizes, Windows window widths from 720px up, VoiceOver labels, keyboard focus and Reduce Motion.
- Finish by updating `docs/mockups` screenshots and giving me side-by-side before/after images of each screen next to the website's version.
