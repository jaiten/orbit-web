# Prompt: bring the Orbit apps up to the website's level

Paste everything below the line into Claude Code, opened in the `Orbit` repo. Run it as two or three sessions (tokens and shared components first, then Windows, then iOS) so each is reviewable.

---

You are redesigning the visuals and motion of Orbit, a local-first planner for iPhone (SwiftUI, `ios/`) and Windows (Electron, HTML/CSS/JS in `windows/ui/`). The marketing site at https://github.com/jaiten/orbit-web (`src/components/devices/*`, `src/components/widgets/*`, `src/components/bklit/*`, `src/lib/motion.ts`, `src/styles/tokens.css`) shows the target look. Read those files first and match them closely: the site's live "Today" screens are the reference for both apps.

**Do not change behaviour, data, sync, models or copy meaning. This is a visual and motion pass only.** Keep `shared/design-tokens.json` as the single source of truth and regenerate with `npm run generate`/`npm run tokens`; keep the Windows token drift test passing. Keep existing accessibility: Dynamic Type, VoiceOver labels, keyboard focus, reduced motion.

## The look: quiet, spacious, precise
- Canvas `#F5F5F7` / `#141416`, cards on `#FFFFFF` / `#1F1F21`. Cards 18px radius, rows 12px, chips pill. **No heavy shadows**: separation comes from a 1px line (`#E4E4E8` / `#323236`) and a faint `0 1px 2px` shadow only on floating things.
- Generous whitespace on the 8px scale. Screen padding 20px. Sections separated by 24–32px, never by dividers and boxes together.
- Type: SF Pro (iOS) / Segoe UI Variable (Windows). Large title 34–36 bold with tight tracking (-0.03em), small uppercase eyebrow labels (11–12px, +0.1em tracking, muted) above titles and cards, body 15–17, secondary text muted. Use tabular numerals for counts and times.
- Coral `#E87359` for ticks, progress, selection and the single primary action. Coral text uses `#B74F38` in light mode. Habit colours (sage, lavender, honey, clay) appear only as small dots, grid boxes and bars, never as large fills.
- Copy stays calm: "Your plan", "2 of 5 done", "Saved locally". No exclamation marks, no scores, no guilt.

## Components to build (same on both apps)
1. **Plan card**: eyebrow "YOUR PLAN", "2 of 5 done" at 22px medium, 6px rounded progress bar in coral on a 8% ink track. The bar fills with a spring.
2. **Task row**: 46–56px tall, 12px radius, surface background with 1px line. Round 24px checkbox with a 2px coral-at-45% ring. On completion: the ring fills coral, a white tick **draws itself** (stroke, ~280ms), the circle does a slight 1.0→1.14→1.0 scale, the title turns muted with strikethrough, and the row settles below the open ones with a spring.
3. **Overdue row**: the same row with three pill buttons under the title, "Today", "Later", "Someday", tinted coral at 12%, text-coloured `#B74F38`. Choosing one springs the row away or into place.
4. **Habit row**: 10px colour dot, title, muted "4 of 6". **Habit history**: "5 of the last 7 days" as 7 rounded segments with M T W T F S S labels beneath, plus a GitHub-style grid (12 weeks × 7 rows, 3px gaps, 3px-radius boxes, level shown by opacity 0.3–1.0 of the habit colour on a 7% ink track). A habits History page lists every habit with its week bar and its grid.
5. **Quick add**: one rounded field, "+" glyph, placeholder "gym tomorrow 6pm", and below it a pill chip (coral 12% fill) that shows "Task · Tomorrow · 6:00 PM". Chip segments animate in and out as you type and the chip resizes with a spring.
6. **Widgets (iOS)**: Progress (ring for small, bar for medium/large), Checklist (tick items off from the Home Screen), Grid (GitHub-style, cell size driven by available height so boxes stay square). Same typography and eyebrow labels as the app. Lock Screen: inline, circular gauge, rectangular.
7. **Windows shell**: 216px sidebar slightly darker than canvas, active item as a white pill with a 1px line and a coral icon, `Ctrl+1…5` shown right-aligned in a small monospace, search field at the top with `Ctrl+F`, "Saved locally" at the bottom. Two-column Today (tasks left, plan card + habits + 12-week grid right). Quick add opens as a centred 480px card over a dimmed, lightly blurred window.
8. **iOS shell**: 5-tab bar (Today, Calendar, Lists, Habits, Settings) with 24px line icons, active tab coral, translucent bar with blur.

## Motion
Springs, never linear. UI: stiffness ~300, damping ~30 (SwiftUI: `.spring(response: 0.35, dampingFraction: 0.86)`; Windows: use the Web Animations API or CSS `linear()` approximations of the same spring). Large elements softer (response ~0.55). Durations 200–600ms. Animate only opacity and transform. List rows enter staggered 50ms apart, sliding 16–24px from the left while fading in. Hover/press: rows and cards lift or scale 0.97–0.985 on press. Respect Reduce Motion (iOS) and `prefers-reduced-motion` (Windows): replace movement with simple fades and skip staggers. Nothing loops or runs without a user action.

## Process
1. Read `shared/design-tokens.json`, `windows/ui/styles.css`, `ios/Shared/Design.swift`, `ios/App/TodayView.swift`, `ios/App/TodayRows.swift`, `ios/App/HabitsView.swift`, `ios/Widgets/`, and the website components listed above.
2. Update tokens first (add anything missing, e.g. line colour usage, eyebrow style, spring presets) and regenerate.
3. Build the shared components once per platform (a `Design/` folder of SwiftUI views; a small component layer in `windows/ui/`), then apply them screen by screen: Today, Habits and History, Quick add, Calendar, Lists and Someday, Settings, Onboarding, widgets.
4. Keep every screen functional at each step; run the existing test suites after each screen (`windows/tests`, `ios/Tests`, UI tests) and fix regressions. Update `docs/mockups` screenshots when done.
5. Check both themes, Dynamic Type at the largest sizes, window widths from 720px up, and Reduce Motion.

Deliver small commits per screen with before/after screenshots in the PR description.
