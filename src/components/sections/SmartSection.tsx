"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, ChevronRight, Lock, Redo2, ScanFace, Sparkles, Undo2 } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/kokonut/BentoGrid";
import { Reveal, reveal } from "@/components/ui/Reveal";
import { Tick } from "@/components/ui/Tick";
import { revealGroup, spring, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Hover, focus or tap a tile to play it; it settles back when you move on. */
function Tile({ label, className, title, blurb, children }: { label: string; className?: string; title: string; blurb: string; children: (active: boolean) => React.ReactNode }) {
  return (
    <m.div variants={reveal} className={cn("@container min-h-[240px]", className)}>
      <BentoCard label={label} className="h-full">
        {(active) => (
          <div className="flex h-full flex-col p-5">
            <div className="min-h-0 flex-1">{children(active)}</div>
            <div className="mt-4">
              <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-1 text-[14px] leading-snug text-muted">{blurb}</p>
            </div>
          </div>
        )}
      </BentoCard>
    </m.div>
  );
}

/** A start & finish ring, as in the apps: empty, or filled once started. */
function Ring({ on, started = false }: { on: boolean; started?: boolean }) {
  return (
    <span aria-hidden className="relative grid size-[22px] shrink-0 place-items-center">
      <svg viewBox="0 0 24 24" className="absolute inset-0" fill="none" strokeWidth={2.2}>
        <circle cx="12" cy="12" r="10" stroke="color-mix(in srgb, var(--accent) 45%, transparent)" />
        <m.circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeLinecap="round" initial={false} animate={{ pathLength: on ? (started ? 0.62 : 0.0001) : 0, opacity: on ? 1 : 0 }} transition={spring.soft} style={{ rotate: -90, transformOrigin: "center" }} />
      </svg>
      <m.svg viewBox="0 0 24 24" width="10" height="10" initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }} transition={spring.ui}>
        <path d="M8 6l10 6-10 6z" fill="var(--accent-text)" />
      </m.svg>
    </span>
  );
}

/** Learned start & finish: tracked once, suggested the next time, on from then. */
function Learns({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) return setStep(0);
    const timers = [1, 2, 3].map((n) => window.setTimeout(() => setStep(n), n * 650));
    return () => timers.forEach(window.clearTimeout);
  }, [active]);
  const rows = [
    { title: "Laundry", note: "You tracked it", ring: true, started: true },
    { title: "Laundry, darks", note: step >= 3 ? "You said yes" : step >= 2 ? "Track start & finish?" : "", suggest: true, ring: step >= 3 },
    { title: "Laundry, whites", note: step >= 3 ? "Starts tracked" : "", ring: step >= 3 },
  ];
  return (
    <div className="flex h-full flex-col gap-5" aria-hidden>
    <ul className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <m.li key={row.title} initial={false} animate={{ opacity: i === 0 || step > i - 1 ? 1 : 0.35, y: 0 }} transition={spring.ui} className="flex h-[46px] items-center gap-3 rounded-[12px] bg-canvas px-3.5 ring-1 ring-line">
          {row.ring ? <Ring on started={row.started} /> : <Tick done={false} size={22} />}
          <span className="min-w-0 flex-1 truncate text-[15px]">{row.title}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            {row.note && (
              <m.span key={row.note} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={spring.ui} className={cn("inline-flex shrink-0 items-center gap-1 text-[12px]", row.suggest && step < 3 ? "font-medium text-accent-text" : "text-muted")}>
                {row.suggest && step < 3 && <Sparkles size={12} aria-hidden />}
                {row.note}
              </m.span>
            )}
          </AnimatePresence>
        </m.li>
      ))}
    </ul>
      <div className="mt-auto hidden rounded-[14px] bg-canvas p-4 ring-1 ring-line sm:block">
        <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Your rules</div>
        <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
          {["@mums = Thu, Fri", "@dads = Sat–Mon", "Always track: bake, print"].map((rule, i) => (
            <m.span key={rule} initial={false} animate={{ y: active ? [0, -3, 0] : 0 }} transition={{ delay: 0.15 * i + 0.3, duration: 0.4 }} className="rounded-full bg-accent/12 px-3 py-1 font-medium text-accent-text">
              {rule}
            </m.span>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted">Rules sync between iPhone and Windows.</p>
      </div>
    </div>
  );
}

/**
 * Do on…: tomorrow and the next few days by name, worked out in the visitor's own week.
 * The day menu floats over the tile (absolute) so opening it never changes the tile's height.
 */
function DoOn({ active }: { active: boolean }) {
  const [days, setDays] = useState<string[]>(["Tomorrow", "Thursday", "Friday", "Saturday"]);
  useEffect(() => {
    const today = new Date();
    setDays([1, 2, 3, 4].map((n) => (n === 1 ? "Tomorrow" : new Date(today.getFullYear(), today.getMonth(), today.getDate() + n).toLocaleDateString("en-US", { weekday: "long" }))));
  }, []);
  return (
    <div className="relative flex h-full items-start gap-2" aria-hidden>
      <div className="w-[46%] rounded-[12px] bg-canvas p-1 text-[13px] ring-1 ring-line">
        {["Edit…", "Start a timer", "Do on…", "Make it a Note"].map((item) => (
          <div key={item} className={cn("flex items-center justify-between rounded-[8px] px-2.5 py-1.5", item === "Do on…" && active && "bg-[#0a84ff] text-white")}>
            {item}
            {(item === "Do on…" || item === "Start a timer") && <ChevronRight size={13} className="opacity-60" />}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {active && (
          <m.div initial={{ opacity: 0, x: -8, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -6 }} transition={spring.ui} className="absolute left-[calc(46%+0.5rem)] top-0 w-[46%] rounded-[12px] bg-canvas p-1 text-[13px] shadow-card ring-1 ring-line">
            {days.map((day, i) => (
              <m.div key={day + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 * i }} className="rounded-[8px] px-2.5 py-1.5">
                {day}
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Undo and Redo, always at the top of the window on Windows. */
function UndoRedo({ active }: { active: boolean }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!active) return setGone(false);
    const a = window.setTimeout(() => setGone(true), 300);
    const b = window.setTimeout(() => setGone(false), 1300);
    return () => [a, b].forEach(window.clearTimeout);
  }, [active]);
  return (
    <div className="flex h-full flex-col items-center gap-3" aria-hidden>
      <div className="flex gap-0.5 rounded-full bg-canvas p-0.5 ring-1 ring-line">
        <m.span animate={{ scale: active && gone ? [1, 0.9, 1] : 1 }} transition={{ delay: 0.9, duration: 0.3 }} className="grid h-7 w-9 place-items-center rounded-full text-ink"><Undo2 size={15} /></m.span>
        <span className={cn("grid h-7 w-9 place-items-center rounded-full", active ? "text-ink" : "text-muted/50")}><Redo2 size={15} /></span>
      </div>
      <div className="h-[40px] w-full">
        <AnimatePresence>
          {!gone && (
            <m.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 24 }} transition={spring.ui} className="flex h-[40px] items-center gap-2.5 rounded-[12px] bg-canvas px-3 ring-1 ring-line">
              <Tick done={false} size={18} />
              <span className="truncate text-[14px]">Renew passport</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Ctrl-click, Shift-click a run, Ctrl+C: copied as a list. */
function SelectCopy({ active }: { active: boolean }) {
  const items = ["Book the venue", "Order the cake", "Send invites"];
  const [picked, setPicked] = useState(0);
  useEffect(() => {
    if (!active) return setPicked(0);
    const timers = [1, 3, 4].map((n, i) => window.setTimeout(() => setPicked(n), 350 + i * 450));
    return () => timers.forEach(window.clearTimeout);
  }, [active]);
  return (
    <div className="grid h-full grid-cols-[1.2fr_1fr] gap-3" aria-hidden>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={item} className={cn("flex h-9 items-center gap-2.5 rounded-[10px] px-3 text-[13px] ring-1 transition-colors", picked > i || picked === 3 ? "bg-accent/10 ring-accent-text" : "bg-canvas ring-line")}>
            <Tick done={false} size={16} />
            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {picked === 4 && (
          <m.pre initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring.ui} className="self-center rounded-[10px] bg-canvas p-3 font-sans text-[12px] leading-relaxed ring-1 ring-line">
            {items.map((item) => `- ${item}`).join("\n")}
          </m.pre>
        )}
      </AnimatePresence>
    </div>
  );
}

const ACCENTS: [string, string][] = [
  ["Coral", "#E87359"], ["Sage", "#6E8C78"], ["Blue", "#729ED2"], ["Lavender", "#8C85BF"], ["Teal", "#53AAA4"],
  ["Honey", "#D19E4D"], ["Rose", "#D9738F"], ["Plum", "#9B6FA8"], ["Midnight", "#5966B5"],
];
/** Nine accents: three to start with, six that milestones unlock. */
function Accents({ active }: { active: boolean }) {
  const [open, setOpen] = useState(3);
  useEffect(() => {
    if (!active) return setOpen(3);
    const timer = window.setInterval(() => setOpen((n) => Math.min(9, n + 1)), 260);
    return () => window.clearInterval(timer);
  }, [active]);
  return (
    <div className="grid h-full grid-cols-9 content-center gap-2" aria-hidden>
      {ACCENTS.map(([name, hex], i) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <m.span initial={false} animate={{ opacity: i < open ? 1 : 0.32, scale: i === open - 1 && i >= 3 ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }} className="grid aspect-square w-full max-w-[34px] place-items-center rounded-full" style={{ background: hex }}>
            {i >= open && <Lock size={11} color="#fff" strokeWidth={2.5} />}
            {i === 0 && <Check size={13} color="#fff" strokeWidth={3} />}
          </m.span>
          <span className="hidden text-[10px] text-muted @[480px]:block">{name}</span>
        </div>
      ))}
    </div>
  );
}

/** Locked notes and sections: Face ID on iPhone, one password on Windows. */
function Locked({ active }: { active: boolean }) {
  return (
    <div className="grid h-full place-items-center" aria-hidden>
      <m.div animate={{ scale: active ? [1, 0.94, 1.04, 1] : 1 }} transition={{ duration: 0.6 }} className="grid size-16 place-items-center rounded-[18px] bg-canvas ring-1 ring-line">
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <m.span key="face" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring.ui}><ScanFace size={28} className="text-accent-text" /></m.span>
          ) : (
            <m.span key="lock" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={spring.ui}><Lock size={26} className="text-muted" /></m.span>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}

export function SmartSection() {
  return (
    <section id="smart" aria-labelledby="smart-title" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Small things, done well</p>
        <h2 id="smart-title" className="section-title mt-3">Orbit learns how you plan</h2>
        <p className="lead mt-5">It picks up your habits of planning, moves things along the week in one step, and lets you take anything back</p>
      </Reveal>
      <m.div variants={revealGroup} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-14">
        <BentoGrid className="sm:auto-rows-[minmax(240px,auto)]">
          <Tile className="sm:col-span-2 sm:row-span-2" label="Start and finish, learned: a task you tracked, a similar one suggested, the next one on" title="Learns start & finish" blurb="Track start & finish on a task once and similar tasks suggest it. From the second time, they start tracked. List words that always do.">
            {(a) => <Learns active={a} />}
          </Tile>
          <Tile className="sm:col-span-2" label="Do on: tomorrow and the next few days" title="Do on…" blurb="Hold a task on iPhone or right-click on Windows to move it to tomorrow or any day this week.">
            {(a) => <DoOn active={a} />}
          </Tile>
          <Tile label="Undo and redo buttons" title="Undo & Redo" blurb="Always at the top on Windows. Ctrl+Z, Ctrl+Y.">
            {(a) => <UndoRedo active={a} />}
          </Tile>
          <Tile label="Locked notes" title="Locked notes" blurb="Face ID on iPhone, one password on Windows.">
            {(a) => <Locked active={a} />}
          </Tile>
          <Tile className="sm:col-span-2" label="Select a run of tasks and copy them as a list" title="Copy as a list" blurb="Ctrl-click, Shift-click a run, then Ctrl+C. Tasks, notes and habits paste as a tidy list.">
            {(a) => <SelectCopy active={a} />}
          </Tile>
          <Tile className="sm:col-span-2" label="Nine accent colours, six unlocked by milestones" title="Colours you earn" blurb="Start with three accents. Seventeen milestones along the way unlock six more.">
            {(a) => <Accents active={a} />}
          </Tile>
        </BentoGrid>
      </m.div>
    </section>
  );
}
