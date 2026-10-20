"use client";
import { AnimatePresence, m } from "motion/react";
import { CalendarDays, ListChecks, Repeat, Settings, Sun, Plus } from "lucide-react";
import { HabitRow, OverdueRow, PlanCard, SectionLabel, TaskRow, type OverdueChoice } from "./screen-parts";
import { spring, STAGGER } from "@/lib/motion";
import type { HabitColor } from "@/lib/sample-data";

export interface PhoneTask { id: string; title: string; time?: string; done?: boolean }
export interface PhoneHabit { id: string; title: string; color: HabitColor; count: string; done?: boolean }

interface Props {
  tasks: PhoneTask[];
  habits?: PhoneHabit[];
  /** An overdue item still waiting for a choice, or being chosen. */
  overdue?: { id: string; title: string; pressed?: OverdueChoice | null } | null;
  /** Hide everything in the list area, for the first scroll step. */
  empty?: boolean;
}

const PITCH = { heading: 36, task: 64, overdue: 112 };
const LIST_TOP = 362;

type Entry = { key: string; y: number; node: React.ReactNode };

/**
 * The Today screen at 402 x 874. Rows are placed with springs rather than layout
 * animation, so movement stays correct when the whole device is scaled.
 */
export function TodayPhone({ tasks, habits = [], overdue = null, empty = false }: Props) {
  const entries: Entry[] = [];
  let y = 0;
  const push = (key: string, pitch: number, node: React.ReactNode) => {
    entries.push({ key, y, node });
    y += pitch;
  };

  if (!empty) {
    if (overdue) {
      push("h-overdue", PITCH.heading, <SectionLabel>Overdue</SectionLabel>);
      push(overdue.id, PITCH.overdue, <OverdueRow title={overdue.title} pressed={overdue.pressed} />);
    }
    push("h-today", PITCH.heading, <SectionLabel right="Today">Your day</SectionLabel>);
    const open = tasks.filter((t) => !t.done);
    const finished = tasks.filter((t) => t.done);
    for (const t of [...open, ...finished]) push(t.id, PITCH.task, <TaskRow big title={t.title} time={t.time} done={t.done} />);
    if (habits.length) {
      push("h-habits", PITCH.heading, <SectionLabel right="Repeats">Habits</SectionLabel>);
      for (const h of habits) push(h.id, PITCH.task, <HabitRow big title={h.title} color={h.color} count={h.count} done={h.done} />);
    }
  }

  const total = tasks.length + habits.length + (overdue && overdue.pressed !== "Today" ? 1 : 0);
  const done = tasks.filter((t) => t.done).length + habits.filter((h) => h.done).length;

  return (
    <div className="relative h-full w-full overflow-hidden bg-canvas text-left text-ink">
      {/* Status bar */}
      <div className="absolute inset-x-0 top-0 flex h-[54px] items-end justify-between px-[34px] pb-[6px] text-[16px] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <span className="flex items-end gap-[2px]">{[5, 8, 11, 14].map((h) => <i key={h} className="block w-[3px] rounded-[1px] bg-ink" style={{ height: h }} />)}</span>
          <span className="ml-1 block h-[13px] w-[26px] rounded-[4px] border border-ink/50 p-[1.5px]"><i className="block h-full w-[70%] rounded-[2px] bg-ink" /></span>
        </span>
      </div>

      <div className="absolute inset-x-5 top-[70px]">
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Tuesday, October 20</div>
        <div className="mt-1 text-[36px] font-bold leading-[1.1] tracking-[-0.03em]">Today</div>
        <div className="text-[16px] text-muted">Make room for what matters.</div>
      </div>

      <PlanCard className="absolute inset-x-5 top-[178px]" done={done} total={Math.max(total, 1)} />

      <div className="absolute inset-x-5 top-[298px] flex h-[48px] items-center gap-2.5 rounded-[12px] bg-surface px-[14px] text-[15px] text-muted shadow-[0_0_0_1px_var(--line)]">
        <Plus size={16} /> Add a task · gym tomorrow 6pm
      </div>

      <div className="absolute inset-x-5" style={{ top: LIST_TOP, height: 874 - LIST_TOP - 96, overflow: "hidden" }}>
        <AnimatePresence initial={false}>
          {entries.map((e, i) => (
            <m.div
              key={e.key}
              className="absolute inset-x-0 top-0"
              initial={{ opacity: 0, x: -24, y: e.y }}
              animate={{ opacity: 1, x: 0, y: e.y }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ y: spring.ui, x: { ...spring.ui, delay: i * STAGGER }, opacity: { duration: 0.3, delay: i * STAGGER } }}
            >
              {e.node}
            </m.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tab bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[88px] items-start justify-around border-t border-line bg-canvas/90 pt-3 backdrop-blur">
        {[[Sun, "Today"], [CalendarDays, "Calendar"], [ListChecks, "Lists"], [Repeat, "Habits"], [Settings, "Settings"]].map(([Icon, label], i) => {
          const I = Icon as typeof Sun;
          return (
            <div key={label as string} className={`flex w-[64px] flex-col items-center gap-1 text-[11px] ${i === 0 ? "text-accent-text" : "text-muted"}`}>
              <I size={24} strokeWidth={1.75} />
              {label as string}
            </div>
          );
        })}
      </div>
      <div aria-hidden className="absolute bottom-2 left-1/2 h-[5px] w-[140px] -translate-x-1/2 rounded-full bg-ink/80" />
    </div>
  );
}
