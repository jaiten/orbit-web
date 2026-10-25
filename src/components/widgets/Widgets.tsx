"use client";
import { createContext, useContext, useState } from "react";
import { m } from "motion/react";
import { Tick } from "@/components/ui/Tick";
import { habits } from "@/lib/sample-data";
import { spring } from "@/lib/motion";

export type Size = "s" | "m" | "l";
const Label = ({ children }: { children: React.ReactNode }) => <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{children}</div>;
const track = { background: "color-mix(in srgb, var(--ink) 8%, transparent)" };

const PLAN = ["Morning walk", "Focus on one thing", "Call someone you miss", "Send the invoice", "Plan tomorrow"];
type Plan = { done: Set<number>; toggle: (i: number) => void; waterToday: boolean; toggleWater: () => void };
const PlanContext = createContext<Plan | null>(null);

/** One shared plan for every Progress widget and the Lock Screen: tick an item in the large tile and they all follow. */
export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState<Set<number>>(new Set([0, 3]));
  const [waterToday, setWaterToday] = useState(false);
  const toggle = (i: number) =>
    setDone((d) => {
      const n = new Set(d);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return <PlanContext.Provider value={{ done, toggle, waterToday, toggleWater: () => setWaterToday((w) => !w) }}>{children}</PlanContext.Provider>;
}
const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("PlanProvider missing");
  return ctx;
};
const nextUp = (done: Set<number>) => PLAN.find((_, i) => !done.has(i));

/** Progress: a count and a bar (or ring). The large tile is a checklist you can tick. */
export function ProgressWidget({ size }: { size: Size; active?: boolean }) {
  const { done: set, toggle } = usePlan();
  const done = set.size;
  const total = PLAN.length;
  const bar = (
    <div className="h-[7px] overflow-hidden rounded-full" style={track}>
      <m.div className="h-full origin-left rounded-full bg-accent" initial={false} animate={{ scaleX: done / total }} transition={spring.soft} />
    </div>
  );
  if (size === "s")
    return (
      <div className="flex h-full flex-col justify-between p-4">
        <Label>Your plan</Label>
        <div className="relative mx-auto size-[78px]">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" style={{ stroke: "color-mix(in srgb, var(--ink) 8%, transparent)" }} />
            <m.circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" initial={false} animate={{ pathLength: done / total }} transition={spring.soft} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[24px] font-semibold leading-none tracking-tight tabular-nums">{done}<span className="ml-px text-[13px] font-normal text-muted">/{total}</span></div>
        </div>
        <div className="text-center text-[12px] text-muted">{done} of {total} done</div>
      </div>
    );
  return (
    <div className="flex h-full flex-col p-5">
      <Label>Your plan</Label>
      <div className="mt-1 text-[clamp(22px,3.2cqw,30px)] font-semibold tracking-[-0.03em]" aria-live="polite">{done} of {total} done</div>
      <div className="mt-3">{bar}</div>
      {size === "m" ? (
        <div className="mt-auto text-[14px] text-muted">{nextUp(set) ? <>Next · <span className="text-ink">{nextUp(set)}</span></> : "All done for today"}</div>
      ) : (
        <ul className="mt-3 flex flex-1 flex-col justify-around text-[15px]">
          {PLAN.map((t, i) => (
            <li key={t}>
              <button type="button" role="checkbox" aria-checked={set.has(i)} onClick={() => toggle(i)} className="flex w-full items-center gap-3 rounded-[10px] py-1 text-left transition-colors hover:bg-ink/[0.04] active:scale-[0.99]">
                <Tick done={set.has(i)} size={22} />
                <span className={set.has(i) ? "text-muted line-through" : ""}>{t}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Checklist: tick items off right here, like on the Home Screen. */
export function ChecklistWidget({ size }: { size: Size; active?: boolean }) {
  const items = ["Morning walk", "Focus on one thing", "Call someone you miss", "Send the invoice", "Plan tomorrow"].slice(0, size === "l" ? 5 : 3);
  const [done, setDone] = useState<Set<number>>(new Set([0]));
  const toggle = (i: number) =>
    setDone((d) => {
      const n = new Set(d);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <Label>Checklist</Label>
        <span className="text-[12px] text-muted" aria-live="polite">{done.size} of {items.length}</span>
      </div>
      <ul className="flex flex-1 flex-col justify-around text-[15px]">
        {items.map((t, i) => (
          <li key={t}>
            <button type="button" role="checkbox" aria-checked={done.has(i)} onClick={() => toggle(i)} className={`flex w-full items-center gap-3 rounded-[10px] text-left transition-colors hover:bg-ink/[0.04] active:scale-[0.99] ${size === "m" ? "py-0.5" : "py-1.5"}`}>
              <Tick done={done.has(i)} size={size === "m" ? 22 : 24} />
              <span className={done.has(i) ? "text-muted line-through" : ""}>{t}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The Grid widget is a calendar: one box per date, filled in the habit's colour when it was done.
// October 2026 starts on a Thursday (3 blank boxes when weeks start on Monday) and "today" is the 20th.
const MONTH = { label: "October", blanks: 3, length: 31, today: 20 };
const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const water = habits[1]; // "Read a few pages": one box per day, done or not

/** How done a date is, 0 to 1. Dates after today are empty; today is whatever the visitor ticked. */
function levelOn(date: number, todayDone: boolean) {
  if (date > MONTH.today) return 0;
  if (date === MONTH.today) return todayDone ? 1 : 0;
  const amount = water.days[water.days.length - 1 - (MONTH.today - date)];
  return Math.min(1, amount / water.target);
}

function DateBox({ date, todayDone, onToggle, numberSize }: { date: number; todayDone: boolean; onToggle: () => void; numberSize: string }) {
  const level = levelOn(date, todayDone);
  const isToday = date === MONTH.today;
  const future = date > MONTH.today;
  const style = { "--fill": "var(--lavender)", "--o": level ? 0.3 + 0.7 * level : 0 } as React.CSSProperties;
  const number = (
    <span aria-hidden className={`relative z-10 font-medium tabular-nums leading-none ${numberSize} ${future ? "text-muted/50" : level > 0.6 ? "text-white" : "text-ink/70"}`}>{date}</span>
  );
  const ring = isToday ? "ring-[1.5px] ring-accent" : "";
  if (isToday)
    return (
      <button type="button" role="checkbox" aria-checked={todayDone} aria-label={`${MONTH.label} ${date}, today`} onClick={onToggle} className={`hg-cell flex aspect-square items-center justify-center transition-transform duration-150 active:scale-90 ${ring}`} style={style}>
        <m.span aria-hidden className="absolute inset-0 rounded-[3px]" style={{ background: "var(--lavender)" }} initial={false} animate={{ opacity: todayDone ? 1 : 0, scale: todayDone ? [1, 1.35, 1] : 0.6 }} transition={{ duration: 0.35 }} />
        {number}
      </button>
    );
  return (
    <span className="hg-cell flex aspect-square items-center justify-center" style={style}>
      {number}
    </span>
  );
}

const doneThisMonth = (todayDone: boolean) => Array.from({ length: MONTH.today }, (_, i) => levelOn(i + 1, todayDone)).filter((l) => l >= 1).length;

/** Grid: a month (or a week) of habit boxes, with the date in each. Tap today's box to complete it. */
export function GridWidget({ size }: { size: Size; active?: boolean }) {
  const { waterToday, toggleWater } = usePlan();
  const count = doneThisMonth(waterToday);
  const month = (numberSize: string, gap: string, letters = true) => (
    <div>
      {letters && (
        <div className={`mb-1 grid grid-cols-7 text-center text-[9px] font-medium text-muted ${gap}`}>
          {WEEKDAY_LETTERS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
      )}
      <div className={`grid grid-cols-7 ${gap}`}>
        {Array.from({ length: MONTH.blanks }, (_, i) => <span key={"b" + i} />)}
        {Array.from({ length: MONTH.length }, (_, i) => (
          <DateBox key={i} date={i + 1} todayDone={waterToday} onToggle={toggleWater} numberSize={numberSize} />
        ))}
      </div>
    </div>
  );

  if (size === "s") {
    // The last seven days, ending today.
    const dates = Array.from({ length: 7 }, (_, i) => MONTH.today - 6 + i);
    const letters = dates.map((d) => WEEKDAY_LETTERS[(MONTH.blanks + d - 1) % 7]);
    return (
      <div className="flex h-full flex-col justify-between p-4">
        <Label>Habits</Label>
        <div>
          <div className="mb-1 grid grid-cols-7 gap-[3px] text-center text-[9px] font-medium text-muted">{letters.map((l, i) => <span key={i}>{l}</span>)}</div>
          <div className="grid grid-cols-7 gap-[3px]">
            {dates.map((d) => <DateBox key={d} date={d} todayDone={waterToday} onToggle={toggleWater} numberSize="text-[9px]" />)}
          </div>
        </div>
        <div className="text-[12px] text-muted">{water.title}</div>
      </div>
    );
  }
  if (size === "m")
    return (
      <div className="flex h-full items-center gap-5 p-5">
        <div className="min-w-0 flex-1">
          <Label>{MONTH.label}</Label>
          <div className="mt-1 text-[15px] font-medium">{water.title}</div>
          <div className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums" aria-live="polite">{count}<span className="ml-1 text-[13px] font-normal text-muted">days</span></div>
          <div className="mt-1.5 text-[12px] text-muted">Tap today to complete it</div>
        </div>
        <div className="w-[124px] shrink-0">{month("text-[7px]", "gap-[2px]", false)}</div>
      </div>
    );
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-baseline justify-between">
        <Label>{MONTH.label}</Label>
        <span className="text-[12px] text-muted" aria-live="polite">{count} of {MONTH.today} days</span>
      </div>
      <div className="text-[15px] font-medium">{water.title}</div>
      <div className="min-h-0 flex-1">{month("text-[11px]", "gap-1")}</div>
    </div>
  );
}

/** Lock Screen: inline, circular and rectangular widgets over a dark wallpaper. Colours here are fixed, like a real lock screen. */
export function LockScreen({ active }: { active: boolean }) {
  const { done: set } = usePlan();
  const done = set.size;
  const next = nextUp(set);
  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden p-6 text-white" style={{ background: "radial-gradient(120% 80% at 20% 0%, #5a3a4a 0%, #2b2a3d 45%, #151521 100%)" }}>
      <div className="text-[13px] font-medium text-white/80">Tuesday 20 October</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/90">
        <svg viewBox="0 0 128 128" className="size-4" fill="none" aria-hidden><path d="M93 64a29 29 0 1 1-29-29" stroke="#fff" strokeWidth="14" strokeLinecap="round" /><circle cx="87" cy="41" r="9" fill="#fff" /></svg>
        {done} of 5 done
      </div>
      <div className="mt-1 text-[72px] font-light leading-none tracking-[-0.04em]">9:41</div>
      <div className="mt-auto grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
        <div className="relative size-[50px] rounded-full bg-white/15">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(255 255 255 / .22)" strokeWidth="9" />
            <m.circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" initial={false} animate={{ pathLength: done / 5 }} transition={spring.soft} />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[16px] font-semibold">{done}</span>
        </div>
        <div className="min-w-0 rounded-[16px] bg-white/15 px-2.5 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-white/70">Next</div>
          <div className="text-[13px] font-medium leading-tight">{next ?? "All done"}</div>
        </div>
        <div className="relative size-[50px] rounded-full bg-white/15">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(255 255 255 / .22)" strokeWidth="9" />
            <m.circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" initial={false} animate={{ pathLength: active ? 5 / 6 : 4 / 6 }} transition={spring.soft} />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[12px] font-semibold">{active ? 5 : 4}/6</span>
        </div>
      </div>
    </div>
  );
}
