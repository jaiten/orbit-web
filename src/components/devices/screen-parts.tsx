"use client";
import { m } from "motion/react";
import { Tick } from "@/components/ui/Tick";
import { spring } from "@/lib/motion";
import type { HabitColor } from "@/lib/sample-data";

export const habitVar = (c: HabitColor) => `var(--${c})`;

/** The "Your plan" progress card. The fill scales on the x axis only. */
export function PlanCard({ done, total, className = "" }: { done: number; total: number; className?: string }) {
  return (
    <div className={`rounded-[18px] bg-surface p-[18px] shadow-[0_0_0_1px_var(--line)] ${className}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Your plan</div>
      <div className="mt-1 text-[22px] font-medium tracking-[-0.02em]">
        {done} of {total} done
      </div>
      <div className="mt-3 h-[6px] overflow-hidden rounded-full" style={{ background: "color-mix(in srgb, var(--ink) 8%, transparent)" }}>
        <m.div className="h-full origin-left rounded-full bg-accent" initial={false} animate={{ scaleX: total ? done / total : 0 }} transition={spring.soft} style={{ width: "100%" }} />
      </div>
    </div>
  );
}

const rowBase = "flex w-full items-center gap-3 rounded-[12px] bg-surface px-[14px] text-left shadow-[0_0_0_1px_var(--line)]";
const press = "transition-[transform,box-shadow] duration-150 hover:shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgb(0_0_0/0.25)] active:scale-[0.985]";

/** A task. Pass onToggle to make the whole row a checkbox. */
export function TaskRow({ title, time, done, big, onToggle }: { title: string; time?: string; done?: boolean; big?: boolean; onToggle?: () => void }) {
  const cls = `${rowBase} ${big ? "h-14 text-[17px]" : "h-[46px] text-[15px]"} ${onToggle ? `${press} cursor-pointer` : ""}`;
  const inner = (
    <>
      <Tick done={!!done} size={big ? 26 : 24} />
      <span className={`flex-1 truncate transition-colors duration-300 ${done ? "text-muted line-through decoration-1" : ""}`}>{title}</span>
      {time && <span className="text-[13px] text-muted">{time}</span>}
    </>
  );
  return onToggle ? (
    <button type="button" role="checkbox" aria-checked={!!done} onClick={onToggle} className={cls}>{inner}</button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** A habit. Pass onClick to make the row a button that adds one check-in. */
export function HabitRow({ title, color, count, done, big, onClick }: { title: string; color: HabitColor; count: string; done?: boolean; big?: boolean; onClick?: () => void }) {
  const cls = `${rowBase} ${big ? "h-14 text-[17px]" : "h-[46px] text-[15px]"} ${onClick ? `${press} cursor-pointer` : ""}`;
  const inner = (
    <>
      <span aria-hidden className="size-[10px] rounded-full" style={{ background: habitVar(color) }} />
      <span className="flex-1 truncate">{title}</span>
      <span className={`text-[13px] ${done ? "text-accent-text" : "text-muted"}`}>{count}</span>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} aria-label={`${title}, ${count}. Add a check-in`} className={cls}>{inner}</button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function SectionLabel({ children, right }: { children: React.ReactNode; right?: string }) {
  return (
    <div className="flex items-baseline justify-between px-1 pt-1 text-[15px] font-semibold">
      <span>{children}</span>
      {right && <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{right}</span>}
    </div>
  );
}

export const OVERDUE_CHOICES = ["Today", "Later", "Someday"] as const;
export type OverdueChoice = (typeof OVERDUE_CHOICES)[number];

/** Overdue item with its three gentle choices. `pressed` shows one as chosen. */
export function OverdueRow({ title, pressed }: { title: string; pressed?: OverdueChoice | null }) {
  return (
    <div className="rounded-[12px] bg-surface p-[14px] shadow-[0_0_0_1px_var(--line)]">
      <div className="flex items-center gap-3 text-[17px]">
        <Tick done={false} size={26} color="var(--clay)" />
        <span className="flex-1 truncate">{title}</span>
        <span className="text-[13px] text-muted">2 days ago</span>
      </div>
      <div className="mt-3 flex gap-2 pl-[38px]">
        {OVERDUE_CHOICES.map((c) => (
          <m.span
            key={c}
            animate={{ scale: pressed === c ? 0.94 : 1 }}
            transition={spring.lift}
            className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium ${pressed === c ? "bg-btn text-on-btn" : "bg-accent/12 text-accent-text"}`}
          >
            {c}
          </m.span>
        ))}
      </div>
    </div>
  );
}
