"use client";
import { m } from "motion/react";
import { Tick } from "@/components/ui/Tick";
import { habits } from "@/lib/sample-data";
import { spring } from "@/lib/motion";

export type Size = "s" | "m" | "l";
const Label = ({ children }: { children: React.ReactNode }) => <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{children}</div>;
const track = { background: "color-mix(in srgb, var(--ink) 8%, transparent)" };

/** Progress: a count and a bar (or ring). Hovering moves one more item to done. */
export function ProgressWidget({ size, active }: { size: Size; active: boolean }) {
  const done = active ? 3 : 2;
  const total = 5;
  const bar = (
    <div className="h-[7px] overflow-hidden rounded-full" style={track}>
      <m.div className="h-full origin-left rounded-full bg-accent" initial={false} animate={{ scaleX: done / total }} transition={spring.soft} />
    </div>
  );
  if (size === "s")
    return (
      <div className="flex h-full flex-col justify-between p-4">
        <Label>Today</Label>
        <div className="relative mx-auto size-[78px]">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" style={{ stroke: "color-mix(in srgb, var(--ink) 8%, transparent)" }} />
            <m.circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" initial={false} animate={{ pathLength: done / total }} transition={spring.soft} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[22px] font-semibold tracking-tight">{done}<span className="text-[13px] font-normal text-muted">/{total}</span></div>
        </div>
        <div className="text-center text-[12px] text-muted">{done} of {total} done</div>
      </div>
    );
  return (
    <div className="flex h-full flex-col p-5">
      <Label>Your plan</Label>
      <div className="mt-1 text-[clamp(22px,3.2cqw,30px)] font-semibold tracking-[-0.03em]">{done} of {total} done</div>
      <div className="mt-3">{bar}</div>
      {size === "m" ? (
        <div className="mt-auto text-[14px] text-muted">Next · <span className="text-ink">Focus on one thing</span> · 10:00 AM</div>
      ) : (
        <ul className="mt-5 space-y-2.5 text-[15px]">
          {["Morning walk", "Focus on one thing", "Call someone you miss", "Send the invoice"].map((t, i) => (
            <li key={t} className="flex items-center gap-3"><Tick done={i < done - 1} size={22} />{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Checklist: tick items off from the Home Screen. Hovering ticks the next open one. */
export function ChecklistWidget({ size, active }: { size: Size; active: boolean }) {
  const items = ["Morning walk", "Focus on one thing", "Call someone you miss", "Send the invoice", "Plan tomorrow"].slice(0, size === "l" ? 5 : 3);
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-3 flex items-baseline justify-between"><Label>Checklist</Label><span className="text-[12px] text-muted">{active ? 2 : 1} of {items.length}</span></div>
      <ul className="flex flex-1 flex-col justify-around gap-1 text-[15px]">
        {items.map((t, i) => {
          const done = i === 0 || (i === 1 && active);
          return (
            <li key={t} className="flex items-center gap-3">
              <Tick done={done} size={24} />
              <span className={done ? "text-muted line-through" : ""}>{t}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** One habit as a GitHub-style grid. Cell size follows the available height, so boxes stay square at every tile size. */
function BoxGrid({ habit, weeks, active }: { habit: (typeof habits)[number]; weeks: number; active: boolean }) {
  const days = habit.days.slice(-7 * weeks);
  return (
    <div className="grid min-h-0 gap-[2px]" style={{ height: "100%", aspectRatio: `${weeks} / 7`, maxWidth: "100%", gridTemplateColumns: `repeat(${weeks}, 1fr)`, gridTemplateRows: "repeat(7, 1fr)", gridAutoFlow: "column" }}>
      {days.map((a, i) => {
        const level = Math.min(1, a / habit.target);
        const style = { "--fill": `var(--${habit.color})`, "--o": level ? 0.3 + 0.7 * level : 0 } as React.CSSProperties;
        if (i < days.length - 1) return <span key={i} className="hg-cell" style={style} />;
        // Today's box is the one that fills on hover.
        return (
          <span key={i} className="hg-cell" style={{ ...style, "--o": 0 } as React.CSSProperties}>
            <m.span className="absolute inset-0 rounded-[2px]" style={{ background: `var(--${habit.color})` }} initial={false} animate={{ opacity: active ? 1 : 0, scale: active ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.35 }} />
          </span>
        );
      })}
    </div>
  );
}

/** Grid: GitHub-style boxes for habits. Hovering fills today's box. */
export function GridWidget({ size, active }: { size: Size; active: boolean }) {
  const list = habits.slice(0, size === "l" ? 2 : 1);
  const weeks = size === "s" ? 8 : size === "m" ? 18 : 16;
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-baseline justify-between"><Label>Habits</Label>{size !== "s" && <span className="text-[12px] text-muted">Last {weeks} weeks</span>}</div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {list.map((h) => (
          <div key={h.id} className="flex min-h-0 flex-1 flex-col gap-1.5">
            {size !== "s" && <div className="text-[13px]">{h.title}</div>}
            <div className="min-h-0 flex-1">
              <BoxGrid habit={h} weeks={weeks} active={active} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Lock Screen: inline, circular and rectangular widgets over a dark wallpaper. Colours here are fixed, like a real lock screen. */
export function LockScreen({ active }: { active: boolean }) {
  const done = active ? 3 : 2;
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
          <div className="text-[13px] font-medium leading-tight">Focus on one thing</div>
          <div className="text-[12px] text-white/70">10:00 AM</div>
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
