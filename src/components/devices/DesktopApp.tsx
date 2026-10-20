"use client";
import { AnimatePresence, m } from "motion/react";
import { CalendarDays, ListChecks, Repeat, Search, Settings, Sun, Plus } from "lucide-react";
import { HabitRow, PlanCard, SectionLabel, TaskRow, habitVar } from "./screen-parts";
import { HabitGrid } from "@/components/bklit/HabitGrid";
import { WeekBar } from "@/components/bklit/WeekBar";
import { chipParts, parse } from "@/lib/quick-add";
import { habits, isDone, lastSeven } from "@/lib/sample-data";
import { spring } from "@/lib/motion";

export const PAGES = [
  { id: "today", label: "Today", Icon: Sun },
  { id: "calendar", label: "Calendar", Icon: CalendarDays },
  { id: "lists", label: "Lists", Icon: ListChecks },
  { id: "habits", label: "Habits", Icon: Repeat },
  { id: "settings", label: "Settings", Icon: Settings },
] as const;
export type PageId = (typeof PAGES)[number]["id"];

interface Props {
  page?: PageId;
  /** Text typed into the quick add dialog; null hides the dialog. */
  quickAdd?: string | null;
  /** Search text; null leaves the search field resting. */
  search?: string | null;
  /** Task ids to show as done. */
  doneIds?: string[];
}

const TASKS = [
  { id: "walk", title: "Morning walk", time: "8:00 AM · 30 min" },
  { id: "focus", title: "Focus on one thing", time: "10:00 AM · 90 min" },
  { id: "dinner", title: "Make something nourishing", time: "6:00 PM" },
];

/** The Windows app at 1100 x 664. */
export function DesktopApp({ page = "today", quickAdd = null, search = null, doneIds = [] }: Props) {
  const chip = quickAdd ? chipParts(parse(quickAdd, null, new Date(2026, 9, 20, 9, 0))) : [];
  return (
    <div className="relative flex h-full w-full bg-canvas text-left text-ink">
      <aside className="flex w-[216px] shrink-0 flex-col gap-1 px-[10px] py-4" style={{ background: "color-mix(in srgb, var(--ink) 4%, var(--canvas))" }}>
        <div className="mb-3 flex h-10 items-center gap-2 rounded-[8px] bg-surface px-3 text-[13px] text-muted shadow-[0_0_0_1px_var(--line)]">
          <Search size={14} />
          <span className={search ? "text-ink" : ""}>{search ?? "Search"}</span>
          {search !== null && <i className="caret ml-[-4px] inline-block h-[14px] w-px bg-ink" />}
          <kbd className="ml-auto text-[11px]">Ctrl+F</kbd>
        </div>
        {PAGES.map(({ id, label, Icon }, i) => (
          <div key={id} className="relative flex h-10 items-center gap-3 rounded-[8px] px-3 text-[14px]">
            {page === id && <m.span layoutId="nav-active" className="absolute inset-0 rounded-[8px] bg-surface shadow-[0_0_0_1px_var(--line)]" transition={spring.ui} />}
            <Icon size={17} strokeWidth={1.75} className={`relative ${page === id ? "text-accent-text" : "text-muted"}`} />
            <span className={`relative font-medium ${page === id ? "" : "text-muted"}`}>{label}</span>
            <kbd className="relative ml-auto text-[11px] text-muted">Ctrl+{i + 1}</kbd>
          </div>
        ))}
        <div className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Lists</div>
        {[["Personal", "sage"], ["Work", "lavender"], ["Someday", "honey"]].map(([n, c]) => (
          <div key={n} className="flex h-9 items-center gap-3 px-3 text-[14px] text-muted">
            <span className="size-2 rounded-full" style={{ background: `var(--${c})` }} />
            {n}
          </div>
        ))}
        <div className="mt-auto px-3 text-[12px] text-muted">Saved locally</div>
      </aside>

      <main className="relative min-w-0 flex-1 overflow-hidden px-10 py-8">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
            {page === "today" && <TodayPage doneIds={doneIds} />}
            {page === "calendar" && <CalendarPage />}
            {page === "lists" && <ListsPage />}
            {page === "habits" && <HabitsPage />}
            {page === "settings" && <SettingsPage />}
          </m.div>
        </AnimatePresence>

        <AnimatePresence>
          {quickAdd !== null && (
            <m.div className="absolute inset-0 z-10 grid place-items-start justify-center bg-ink/10 pt-24 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <m.div className="w-[480px] rounded-[18px] bg-surface p-5 shadow-lift ring-1 ring-line" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={spring.ui}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Quick add</div>
                <div className="mt-2 flex h-12 items-center rounded-[12px] bg-canvas px-4 text-[17px] ring-1 ring-line">
                  {quickAdd}
                  <i className="caret ml-0.5 inline-block h-[20px] w-[2px] bg-accent" />
                </div>
                <div className="mt-3 flex h-7 items-center gap-1.5">
                  {chip.length > 0 && (
                    <span className="rounded-full bg-accent/12 px-3 py-1 text-[13px] font-medium text-accent-text">{chip.join(" · ")}</span>
                  )}
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const Header = ({ title, sub, eyebrow }: { title: string; sub?: string; eyebrow?: string }) => (
  <div className="mb-5">
    {eyebrow && <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{eyebrow}</div>}
    <div className="text-[36px] font-bold leading-[1.15] tracking-[-0.03em]">{title}</div>
    {sub && <div className="text-[15px] text-muted">{sub}</div>}
  </div>
);

function TodayPage({ doneIds }: { doneIds: string[] }) {
  const water = habits[0];
  const done = doneIds.length;
  return (
    <div className="flex h-full gap-8">
      <div className="min-w-0 flex-1">
        <Header eyebrow="Tuesday, October 20" title="Today" sub="Make room for what matters." />
        <div className="mb-5 flex h-11 items-center gap-2 rounded-[12px] bg-surface px-4 text-[14px] text-muted shadow-[0_0_0_1px_var(--line)]">
          <Plus size={15} /> Add a task · gym tomorrow 6pm
          <kbd className="ml-auto text-[11px]">Ctrl+N</kbd>
        </div>
        <div className="flex flex-col gap-2">
          <SectionLabel right="Time blocks">On the agenda</SectionLabel>
          {TASKS.map((t) => (
            <TaskRow key={t.id} title={t.title} time={t.time} done={doneIds.includes(t.id)} />
          ))}
          <div className="mt-2" />
          <SectionLabel right="To-dos">At your own pace</SectionLabel>
          <TaskRow title="Call someone you miss" />
        </div>
      </div>
      <div className="flex w-[300px] shrink-0 flex-col gap-3 pt-[92px]">
        <PlanCard done={done + 2} total={7} />
        <SectionLabel right="2 of 3">Habits</SectionLabel>
        <HabitRow title="Drink water" color="sage" count="4 of 6" />
        <HabitRow title="Read a few pages" color="lavender" count="0 of 1" />
        <HabitRow title="Move your body" color="clay" count="2 of 3 wk" />
        <div className="rounded-[18px] bg-surface p-4 shadow-[0_0_0_1px_var(--line)]">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Drink water · last 12 weeks</div>
          <HabitGrid label="Drink water" color={habitVar(water.color)} levels={water.days.map((a) => Math.min(1, a / water.target))} />
        </div>
      </div>
    </div>
  );
}

function CalendarPage() {
  const days = ["Mon 19", "Tue 20", "Wed 21", "Thu 22", "Fri 23", "Sat 24", "Sun 25"];
  return (
    <div>
      <Header title="Calendar" sub="October 2026" />
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div key={d} className={`rounded-[12px] px-3 py-3 text-[14px] ${i === 1 ? "bg-btn text-on-btn" : "bg-surface shadow-[0_0_0_1px_var(--line)]"}`}>
            <div className="text-[12px] opacity-70">{d.split(" ")[0]}</div>
            <div className="text-[22px] font-semibold">{d.split(" ")[1]}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex max-w-[560px] flex-col gap-2">
        <SectionLabel>Tuesday</SectionLabel>
        {TASKS.map((t) => <TaskRow key={t.id} title={t.title} time={t.time} />)}
      </div>
    </div>
  );
}

function ListsPage() {
  return (
    <div className="max-w-[560px]">
      <Header title="Lists" sub="Personal" />
      <div className="flex flex-col gap-2">
        <TaskRow title="Call someone you miss" />
        <TaskRow title="Book the dentist" />
        <TaskRow title="Order new running shoes" />
        <div className="mt-3" />
        <SectionLabel right="Not now">Someday</SectionLabel>
        <TaskRow title="Plan a weekend away" />
      </div>
    </div>
  );
}

function HabitsPage() {
  return (
    <div className="max-w-[640px]">
      <Header title="Habits" sub="The last 7 days, for every habit." />
      <div className="flex flex-col gap-3">
        {habits.slice(0, 3).map((h) => {
          const week = lastSeven(h).map((a) => isDone(h, a));
          return (
            <div key={h.id} className="rounded-[18px] bg-surface p-4 shadow-[0_0_0_1px_var(--line)]">
              <div className="mb-3 flex items-baseline justify-between text-[15px] font-medium">
                {h.title}
                <span className="text-[13px] font-normal text-muted">{week.filter(Boolean).length} of the last 7 days</span>
              </div>
              <WeekBar done={week} color={habitVar(h.color)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPage() {
  const rows = [["Account", "Signed in"], ["Sync", "Up to date"], ["Global quick add", "Ctrl+Shift+Space"], ["Back up", "JSON backup"], ["Export", "CSV"]];
  return (
    <div className="max-w-[560px]">
      <Header title="Settings" />
      <div className="overflow-hidden rounded-[18px] bg-surface shadow-[0_0_0_1px_var(--line)]">
        {rows.map(([a, b], i) => (
          <div key={a} className={`flex h-[52px] items-center justify-between px-5 text-[15px] ${i ? "border-t border-line" : ""}`}>
            {a}
            <span className="text-muted">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
