"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, Cloud, CloudOff, Download, GitCompareArrows, HardDrive, WifiOff } from "lucide-react";
import { Tick } from "@/components/ui/Tick";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/* 1. Works offline: flip the switch, keep ticking, flip it back. */
function Offline() {
  const [offline, setOffline] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set([0]));
  const [waiting, setWaiting] = useState(0);
  const items = ["Morning walk", "Focus on one thing", "Call someone you miss", "Plan tomorrow"];

  const tick = (i: number) => {
    setDone((d) => {
      const n = new Set(d);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
    if (offline) setWaiting((w) => w + 1);
  };
  const flip = () => {
    setOffline((o) => !o);
    if (offline) setWaiting(0);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" role="switch" aria-checked={offline} onClick={flip} className="flex items-center gap-3 rounded-full py-1 pr-2 text-[15px] font-medium">
          <span className={cn("relative h-7 w-12 rounded-full transition-colors duration-200", offline ? "bg-btn" : "bg-ink/15")}>
            <m.span className="absolute left-1 top-1 size-5 rounded-full bg-white shadow" animate={{ x: offline ? 20 : 0 }} transition={spring.lift} />
          </span>
          Go offline
        </button>
        <m.span layout className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium", offline ? "bg-honey/20 text-ink" : "bg-sage/20 text-ink")} aria-live="polite">
          {offline ? <CloudOff size={14} /> : <Cloud size={14} />}
          {offline ? (waiting ? `Offline · ${waiting} ${waiting === 1 ? "change" : "changes"} waiting` : "Offline · saved on this device") : "Synced"}
        </m.span>
      </div>
      <ul className="mt-5 space-y-2">
        {items.map((t, i) => (
          <li key={t}>
            <button type="button" role="checkbox" aria-checked={done.has(i)} onClick={() => tick(i)} className="flex h-12 w-full items-center gap-3 rounded-[12px] bg-canvas px-4 text-left text-[16px] ring-1 ring-line transition-transform active:scale-[0.99]">
              <Tick done={done.has(i)} size={24} />
              <span className={done.has(i) ? "text-muted line-through" : ""}>{t}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[14px] text-muted">{offline ? "Keep going. Everything still works, and it catches up when you are back online" : "Switch to offline and tick a few items"}</p>
    </div>
  );
}

/* 2. Saves on the device first: three steps, in order. */
function SavedFirst() {
  const [step, setStep] = useState(0);
  const run = useRef(0);
  const play = async () => {
    const id = ++run.current;
    setStep(0);
    for (let s = 1; s <= 4; s++) {
      await wait(s === 1 ? 350 : s === 2 ? 450 : 1100);
      if (run.current !== id) return;
      setStep(s);
    }
  };
  useEffect(() => {
    void play();
    return () => void run.current++;
  }, []);
  const steps = [
    { Icon: Check, title: "You tick “Morning walk”", note: "Instantly, nothing to wait for" },
    { Icon: HardDrive, title: "Saved on this device", note: "Before anything is sent" },
    { Icon: Cloud, title: "Sent to your account", note: "When there is a connection" },
    { Icon: Check, title: "Up to date on your other device", note: "Same plan, same state" },
  ];
  return (
    <div>
      <ol className="space-y-3">
        {steps.map(({ Icon, title, note }, i) => {
          const on = step > i;
          return (
            <li key={title} className="flex items-center gap-4">
              <m.span animate={{ scale: on ? [1, 1.15, 1] : 1 }} transition={{ duration: 0.35 }} className={cn("grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300", on ? "bg-btn text-on-btn" : "bg-ink/8 text-muted")}>
                <Icon size={18} strokeWidth={2} />
              </m.span>
              <div className={cn("transition-opacity duration-300", on ? "opacity-100" : "opacity-45")}>
                <div className="text-[16px] font-medium">{title}</div>
                <div className="text-[13px] text-muted">{note}</div>
              </div>
            </li>
          );
        })}
      </ol>
      <button type="button" onClick={() => void play()} className="mt-6 rounded-full px-4 py-2 text-[14px] font-medium text-accent-text ring-1 ring-line transition-colors hover:bg-accent/10">Play again</button>
    </div>
  );
}

/* 3. Two versions: pick one. */
const versions = [
  { id: "ios", device: "iPhone", when: "Edited 9:12 AM", text: "Call Sam · 6:00 PM" },
  { id: "win", device: "Windows", when: "Edited 9:14 AM", text: "Call Sam · 7:00 PM" },
];
function TwoVersions() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div>
      <p className="text-[15px] text-muted">The same task was edited on both devices. Orbit keeps both until you choose</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Choose a version">
        {versions.map((v) => (
          <button key={v.id} type="button" role="radio" aria-checked={picked === v.id} onClick={() => setPicked(v.id)} className="relative rounded-[14px] px-5 py-4 text-left ring-1 ring-line transition-colors hover:bg-ink/[0.03]">
            {picked === v.id && <m.span layoutId="picked-version" className="absolute inset-0 rounded-[14px] bg-accent/10 ring-2 ring-accent-text" transition={spring.ui} />}
            <span className="relative block text-[12px] text-muted">{v.device} · {v.when}</span>
            <span className="relative mt-1 block text-[18px] font-medium">{v.text}</span>
          </button>
        ))}
      </div>
      <p className={cn("mt-4 text-[14px] transition-opacity", picked ? "opacity-100" : "opacity-0")} aria-live="polite">{picked ? "Kept. The other version is gone only because you chose" : " "}</p>
    </div>
  );
}

/* 4. Export: the real formats, trimmed. */
const JSON_SAMPLE = `{
  "format": "orbit-backup",
  "version": 2,
  "app": "Orbit",
  "records": [
    {
      "key": "habits/e5555555-…",
      "payload": {
        "title": "Stretch",
        "frequencyRule": "WEEKDAYS",
        "target": 1,
        "color": "sage"
      }
    }
  ]
}`;
const CSV_SAMPLE = `Title,List,Date,Time,Completed
Renew passport,Inbox,2026-10-18,,
Buy birthday card,Inbox,2026-10-20,,2026-10-20
Call the bank,Work,2026-10-20,14:00,
Learn the cello,Someday,,,`;
function Export() {
  const [fmt, setFmt] = useState<"json" | "csv">("json");
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Export format" className="inline-flex rounded-full bg-ink/8 p-1">
          {(["json", "csv"] as const).map((f) => (
            <button key={f} type="button" role="tab" aria-selected={fmt === f} onClick={() => setFmt(f)} className="relative rounded-full px-5 py-1.5 text-[14px] font-medium">
              {fmt === f && <m.span layoutId="fmt" className="absolute inset-0 rounded-full bg-surface shadow-sm" transition={spring.ui} />}
              <span className="relative">{f.toUpperCase()}</span>
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-muted"><Download size={14} /> {fmt === "json" ? "Both apps can read it back" : "Opens in any spreadsheet"}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <m.pre key={fmt} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-4 max-h-[300px] overflow-auto rounded-[14px] bg-canvas p-4 font-mono text-[12.5px] leading-relaxed ring-1 ring-line">
          <code>{fmt === "json" ? JSON_SAMPLE : CSV_SAMPLE}</code>
        </m.pre>
      </AnimatePresence>
    </div>
  );
}

const TABS = [
  { id: "offline", title: "Works offline", Icon: WifiOff, View: Offline },
  { id: "saved", title: "Saves on your device first", Icon: HardDrive, View: SavedFirst },
  { id: "versions", title: "Shows both versions if two devices disagree", Icon: GitCompareArrows, View: TwoVersions },
  { id: "export", title: "Export everything as JSON or CSV", Icon: Download, View: Export },
] as const;

/** Four tabs, each a small working demo of one point. */
export function SyncStage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("offline");
  const active = TABS.find((t) => t.id === tab)!;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div role="tablist" aria-label="How sync works" aria-orientation="vertical" className="flex flex-col gap-2">
        {TABS.map(({ id, title, Icon }) => {
          const on = tab === id;
          return (
            <button key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={on} aria-controls="sync-panel" onClick={() => setTab(id)} className="relative flex items-center gap-4 rounded-[14px] px-4 py-4 text-left transition-colors hover:bg-ink/[0.04]">
              {on && <m.span layoutId="sync-tab" className="absolute inset-0 rounded-[14px] bg-surface shadow-card ring-1 ring-line" transition={spring.ui} />}
              <span className={cn("relative grid size-10 shrink-0 place-items-center rounded-full transition-colors", on ? "bg-accent/15 text-accent-text" : "bg-ink/6 text-muted")}><Icon size={18} strokeWidth={1.75} /></span>
              <span className={cn("relative text-[16px] font-medium leading-snug tracking-[-0.01em]", !on && "text-muted")}>{title}</span>
            </button>
          );
        })}
      </div>
      <div id="sync-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="min-h-[380px] rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <active.View />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
