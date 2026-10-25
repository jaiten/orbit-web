"use client";
import { AnimatePresence, m } from "motion/react";
import { CalendarDays, ListChecks, Plus, Repeat, Search, Settings, Sun, X } from "lucide-react";
import { HabitRow, PlanCard, SectionLabel, TaskRow, habitVar } from "./screen-parts";
import { STATIC_HABITS, STATIC_TASKS, SMART_ADD_NOW, type DesktopApi } from "./use-desktop-app";
import { HabitGrid } from "@/components/bklit/HabitGrid";
import { WeekBar } from "@/components/bklit/WeekBar";
import { chipParts, parse } from "@/lib/quick-add";
import { habits as sampleHabits, habitTips, isDone, lastSeven } from "@/lib/sample-data";
import { spring } from "@/lib/motion";

export const PAGES = [
  { id: "today", label: "Today", Icon: Sun },
  { id: "calendar", label: "Calendar", Icon: CalendarDays },
  { id: "lists", label: "Lists", Icon: ListChecks },
  { id: "habits", label: "Habits", Icon: Repeat },
  { id: "settings", label: "Settings", Icon: Settings },
] as const;
export type PageId = (typeof PAGES)[number]["id"];

/** The app's own shortcut list, as Ctrl+/ shows it. */
const SHORTCUT_HELP: [string, string][] = [
  ["Ctrl+N", "Smart add"],
  ["Ctrl+1 … Ctrl+5", "Today, Calendar, Lists, Habits, Settings"],
  ["Ctrl+F", "Search tasks"],
  ["Space or Enter", "Complete or check the focused item"],
  ["E", "Edit the focused item"],
  ["Delete", "Delete the focused item (Undo appears)"],
  ["Esc", "Close a dialog"],
  ["Ctrl+/", "Show these shortcuts"],
];

interface Props {
  /** Static mode (hero, sync): what to show. */
  page?: PageId;
  quickAdd?: string | null;
  search?: string | null;
  doneIds?: string[];
  /** Pass the app state to make everything clickable and typeable. */
  api?: DesktopApi;
}

const noop = () => {};
const countText = (h: { count: number; target: number; weekly?: boolean }) => `${h.count} of ${h.target}${h.weekly ? " wk" : ""}`;

/** The Windows app at 1100 x 664. Static by default; interactive when given `api`. */
export function DesktopApp({ page = "today", quickAdd = null, search = null, doneIds = [], api }: Props) {
  const live = !!api;
  const v: DesktopApi = api ?? {
    tasks: STATIC_TASKS.map((t) => ({ ...t, done: doneIds.includes(t.id) })),
    habits: STATIC_HABITS,
    toggle: noop, bump: noop, page, setPage: noop, quickAdd, setQuickAdd: noop, submitQuickAdd: noop,
    search, setSearch: noop, shortcuts: false, setShortcuts: noop, day: 20, setDay: noop,
  };
  const chip = v.quickAdd ? chipParts(parse(v.quickAdd, null, SMART_ADD_NOW), SMART_ADD_NOW) : [];
  const query = (v.search ?? "").trim().toLowerCase();
  const searching = live && query.length > 0;

  const agenda = v.tasks.filter((t) => t.list === "agenda");
  const pace = v.tasks.filter((t) => t.list === "pace");
  const todayTotal = agenda.length + pace.length + v.habits.length;
  const todayDone = agenda.filter((t) => t.done).length + pace.filter((t) => t.done).length + v.habits.filter((h) => h.count >= h.target).length + (live ? 0 : 2);

  return (
    <div className="relative flex h-full w-full bg-canvas text-left text-ink">
      <aside className="flex w-[216px] shrink-0 flex-col gap-1 px-[10px] py-4" style={{ background: "color-mix(in srgb, var(--ink) 4%, var(--canvas))" }}>
        <label className="mb-3 flex h-10 items-center gap-2 rounded-[8px] bg-surface px-3 text-[13px] text-muted shadow-[0_0_0_1px_var(--line)] focus-within:shadow-[0_0_0_2px_var(--accent-text)]">
          <Search size={14} className="shrink-0" />
          {live ? (
            <input
              value={v.search ?? ""}
              onChange={(e) => {
                v.onUserInput?.();
                v.setSearch(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Escape" && (v.setSearch(null), e.currentTarget.blur())}
              placeholder="Search"
              aria-label="Search tasks"
              className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
            />
          ) : (
            <span className={search ? "text-ink" : ""}>{search ?? "Search"}</span>
          )}
          <kbd className="ml-auto shrink-0 text-[11px]">Ctrl+F</kbd>
        </label>
        {PAGES.map(({ id, label, Icon }, i) => {
          const body = (
            <>
              {v.page === id && <m.span layoutId="nav-active" className="absolute inset-0 rounded-[8px] bg-surface shadow-[0_0_0_1px_var(--line)]" transition={spring.ui} />}
              <Icon size={17} strokeWidth={1.75} className={`relative ${v.page === id ? "text-accent-text" : "text-muted"}`} />
              <span className={`relative font-medium ${v.page === id ? "" : "text-muted"}`}>{label}</span>
              <kbd className="relative ml-auto text-[11px] text-muted">Ctrl+{i + 1}</kbd>
            </>
          );
          const cls = "relative flex h-10 w-full items-center gap-3 rounded-[8px] px-3 text-left text-[14px]";
          return live ? (
            <button key={id} type="button" onClick={() => (v.setSearch(null), v.setPage(id))} aria-current={v.page === id ? "page" : undefined} className={`${cls} transition-colors hover:bg-ink/[0.04]`}>{body}</button>
          ) : (
            <div key={id} className={cls}>{body}</div>
          );
        })}
        <div className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Lists</div>
        {[["Personal", "sage", "lists"], ["Work", "lavender", "lists"], ["Someday", "honey", "lists"]].map(([n, c, to]) => {
          const cls = "flex h-9 w-full items-center gap-3 rounded-[8px] px-3 text-left text-[14px] text-muted";
          const body = (
            <>
              <span className="size-2 rounded-full" style={{ background: `var(--${c})` }} />
              {n}
            </>
          );
          return live ? (
            <button key={n} type="button" onClick={() => v.setPage(to as PageId)} className={`${cls} transition-colors hover:bg-ink/[0.04] hover:text-ink`}>{body}</button>
          ) : (
            <div key={n} className={cls}>{body}</div>
          );
        })}
        <div className="mt-auto px-3 text-[12px] text-muted">Saved locally</div>
      </aside>

      <main className="relative min-w-0 flex-1 overflow-hidden px-10 py-8">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={searching ? "search" : v.page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
            {searching ? (
              <SearchPage v={v} query={query} />
            ) : (
              <>
                {v.page === "today" && <TodayPage v={v} live={live} agenda={agenda} pace={pace} done={todayDone} total={todayTotal} />}
                {v.page === "calendar" && <CalendarPage v={v} live={live} agenda={agenda} />}
                {v.page === "lists" && <ListsPage v={v} live={live} />}
                {v.page === "habits" && <HabitsPage v={v} live={live} />}
                {v.page === "settings" && <SettingsPage />}
              </>
            )}
          </m.div>
        </AnimatePresence>

        <AnimatePresence>
          {v.quickAdd !== null && (
            <m.div
              className="absolute inset-0 z-10 grid place-items-start justify-center bg-ink/10 pt-24 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onMouseDown={(e) => live && e.target === e.currentTarget && v.setQuickAdd(null)}
            >
              <m.div className="w-[480px] rounded-[18px] bg-surface p-5 shadow-lift ring-1 ring-line" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={spring.ui}>
                <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Smart add</div>
                {live ? (
                  <input
                    autoFocus
                    value={v.quickAdd}
                    onChange={(e) => {
                      v.onUserInput?.();
                      v.setQuickAdd(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") v.submitQuickAdd();
                      if (e.key === "Escape") v.setQuickAdd(null);
                    }}
                    placeholder="gym tomorrow 6pm"
                    aria-label="Smart add"
                    autoComplete="off"
                    spellCheck={false}
                    className="mt-2 h-12 w-full rounded-[12px] bg-canvas px-4 text-[17px] outline-none ring-1 ring-line placeholder:text-muted focus:ring-2 focus:ring-accent-text"
                  />
                ) : (
                  <div className="mt-2 flex h-12 items-center rounded-[12px] bg-canvas px-4 text-[17px] ring-1 ring-line">
                    {v.quickAdd}
                    <i className="caret ml-0.5 inline-block h-[20px] w-[2px] bg-accent" />
                  </div>
                )}
                <div className="mt-3 flex h-7 items-center justify-between gap-2">
                  {chip.length > 0 ? <span className="rounded-full bg-accent/12 px-3 py-1 text-[13px] font-medium text-accent-text">{chip.join(" · ")}</span> : <span />}
                  {live && <span className="text-[12px] text-muted">Enter to add · Esc to close</span>}
                </div>
              </m.div>
            </m.div>
          )}
          {v.shortcuts && (
            <m.div
              className="absolute inset-0 z-20 grid place-items-start justify-center bg-ink/10 pt-16 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onMouseDown={(e) => live && e.target === e.currentTarget && v.setShortcuts(false)}
            >
              <m.div role="dialog" aria-label="Keyboard shortcuts" className="w-[520px] rounded-[18px] bg-surface p-6 shadow-lift ring-1 ring-line" initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={spring.ui}>
                <div className="flex items-center justify-between">
                  <div className="text-[20px] font-semibold tracking-[-0.02em]">Keyboard shortcuts</div>
                  <button type="button" aria-label="Close" onClick={() => v.setShortcuts(false)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-ink/5"><X size={16} /></button>
                </div>
                <dl className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2.5 text-[14px]">
                  {SHORTCUT_HELP.map(([keys, text]) => (
                    <div key={keys} className="contents">
                      <dt><kbd className="rounded-[6px] bg-canvas px-2 py-1 font-mono text-[12px] ring-1 ring-line">{keys}</kbd></dt>
                      <dd className="text-muted">{text}</dd>
                    </div>
                  ))}
                </dl>
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

type Task = DesktopApi["tasks"][number];
const Rows = ({ tasks, v, live }: { tasks: Task[]; v: DesktopApi; live: boolean }) => (
  <>
    {tasks.map((t) => (
      <TaskRow key={t.id} title={t.title} time={t.when} done={t.done} onToggle={live ? () => v.toggle(t.id) : undefined} />
    ))}
  </>
);

function TodayPage({ v, live, agenda, pace, done, total }: { v: DesktopApi; live: boolean; agenda: Task[]; pace: Task[]; done: number; total: number }) {
  const water = sampleHabits[0];
  return (
    <div className="flex h-full gap-8">
      <div className="min-w-0 flex-1 overflow-hidden">
        <Header eyebrow="Tuesday, October 20" title="Today" sub="Make room for what matters" />
        {live ? (
          <button type="button" onClick={() => v.setQuickAdd("")} className="mb-5 flex h-11 w-full items-center gap-2 rounded-[12px] bg-surface px-4 text-left text-[14px] text-muted shadow-[0_0_0_1px_var(--line)] transition-shadow hover:shadow-[0_0_0_1px_var(--accent-text)]">
            <Plus size={15} /> Add a task · gym tomorrow 6pm
            <kbd className="ml-auto text-[11px]">Ctrl+N</kbd>
          </button>
        ) : (
          <div className="mb-5 flex h-11 items-center gap-2 rounded-[12px] bg-surface px-4 text-[14px] text-muted shadow-[0_0_0_1px_var(--line)]">
            <Plus size={15} /> Add a task · gym tomorrow 6pm
            <kbd className="ml-auto text-[11px]">Ctrl+N</kbd>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <SectionLabel right="Time blocks">On the agenda</SectionLabel>
          <Rows tasks={agenda} v={v} live={live} />
          <div className="mt-2" />
          <SectionLabel right="To-dos">At your own pace</SectionLabel>
          <Rows tasks={pace} v={v} live={live} />
        </div>
      </div>
      <div className="flex w-[300px] shrink-0 flex-col gap-3 pt-[92px]">
        <PlanCard done={done} total={total} />
        <SectionLabel right={`${v.habits.filter((h) => h.count >= h.target).length} of ${v.habits.length}`}>Habits</SectionLabel>
        {v.habits.slice(0, 3).map((h) => (
          <HabitRow key={h.id} title={h.title} color={h.color} count={countText(h)} done={h.count >= h.target} onClick={live ? () => v.bump(h.id) : undefined} />
        ))}
        <div className="rounded-[18px] bg-surface p-4 shadow-[0_0_0_1px_var(--line)]">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Drink water · last 12 weeks</div>
          <HabitGrid label="Drink water" tips={live ? habitTips(water) : undefined} color={habitVar(water.color)} levels={water.days.map((a) => Math.min(1, a / water.target))} />
        </div>
      </div>
    </div>
  );
}

function SearchPage({ v, query }: { v: DesktopApi; query: string }) {
  const found = v.tasks.filter((t) => t.title.toLowerCase().includes(query));
  return (
    <div className="max-w-[560px]">
      <Header title="Search" sub={found.length ? `${found.length} ${found.length === 1 ? "match" : "matches"}` : "Nothing matches that"} />
      <div className="flex flex-col gap-2">
        <Rows tasks={found} v={v} live />
      </div>
    </div>
  );
}

const DAYS = [["Mon", 19], ["Tue", 20], ["Wed", 21], ["Thu", 22], ["Fri", 23], ["Sat", 24], ["Sun", 25]] as const;
function CalendarPage({ v, live, agenda }: { v: DesktopApi; live: boolean; agenda: Task[] }) {
  const dayName = DAYS.find(([, n]) => n === v.day)?.[0] ?? "Tue";
  return (
    <div>
      <Header title="Calendar" sub="October 2026" />
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(([d, n]) => {
          const on = n === v.day;
          const cls = `rounded-[12px] px-3 py-3 text-left text-[14px] transition-[transform,box-shadow] duration-150 ${on ? "bg-btn text-on-btn" : "bg-surface shadow-[0_0_0_1px_var(--line)]"}`;
          const body = (
            <>
              <div className="text-[12px] opacity-70">{d}</div>
              <div className="text-[22px] font-semibold">{n}</div>
            </>
          );
          return live ? (
            <button key={n} type="button" aria-pressed={on} onClick={() => v.setDay(n)} className={`${cls} hover:-translate-y-0.5 active:scale-95`}>{body}</button>
          ) : (
            <div key={n} className={cls}>{body}</div>
          );
        })}
      </div>
      <div className="mt-6 flex max-w-[560px] flex-col gap-2">
        <SectionLabel>{dayName} {v.day}</SectionLabel>
        {v.day === 20 || !live ? <Rows tasks={agenda} v={v} live={live} /> : <div className="rounded-[12px] px-1 py-3 text-[15px] text-muted">Nothing planned for this day</div>}
      </div>
    </div>
  );
}

function ListsPage({ v, live }: { v: DesktopApi; live: boolean }) {
  const personal = v.tasks.filter((t) => t.list === "personal" || t.list === "pace");
  const someday = v.tasks.filter((t) => t.list === "someday");
  return (
    <div className="max-w-[560px]">
      <Header title="Lists" sub="Personal" />
      <div className="flex flex-col gap-2">
        <Rows tasks={personal} v={v} live={live} />
        <div className="mt-3" />
        <SectionLabel right="Not now">Someday</SectionLabel>
        <Rows tasks={someday} v={v} live={live} />
      </div>
    </div>
  );
}

function HabitsPage({ v, live }: { v: DesktopApi; live: boolean }) {
  return (
    <div className="max-w-[640px]">
      <Header title="Habits" sub="The last 7 days, for every habit" />
      <div className="flex flex-col gap-3">
        {v.habits.slice(0, 4).map((h) => {
          const sample = sampleHabits.find((s) => s.id === h.id);
          const week = sample ? lastSeven(sample).map((a) => isDone(sample, a)) : [false, false, false, false, false, false, false];
          const color = habitVar(h.color);
          const inner = (
            <>
              <div className="mb-3 flex items-baseline justify-between text-[15px] font-medium">
                {h.title}
                <span className="text-[13px] font-normal text-muted">Today {countText(h)}</span>
              </div>
              <WeekBar done={week} color={color} />
            </>
          );
          const cls = "block w-full rounded-[18px] bg-surface p-4 text-left shadow-[0_0_0_1px_var(--line)]";
          return live ? (
            <button key={h.id} type="button" onClick={() => v.bump(h.id)} aria-label={`${h.title}, ${countText(h)}. Add a check-in`} className={`${cls} transition-transform duration-150 active:scale-[0.99]`}>{inner}</button>
          ) : (
            <div key={h.id} className={cls}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPage() {
  const rows = [["Account", "Signed in"], ["Sync", "Up to date"], ["Global smart add", "Ctrl+Shift+Space"], ["Back up", "JSON backup"], ["Export", "CSV"]];
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
