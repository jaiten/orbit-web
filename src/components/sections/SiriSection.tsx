"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { Check, Mic, Plus, RotateCcw } from "lucide-react";
import { Reveal, RevealGroup, reveal } from "@/components/ui/Reveal";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
/** A calm, unhurried ease for the bubbles; layout moves use the same curve so earlier lines glide up. */
const EASE = { duration: 0.55, ease: [0.22, 1, 0.36, 1] } as const;

const ACTIONS = [
  {
    id: "add",
    name: "Add to Orbit",
    Icon: Plus,
    blurb: "Capture a task or habit by voice, using the same plain words as smart add",
    lines: [
      { who: "you", text: "Hey Siri, Add to Orbit" },
      { who: "siri", text: "What do you want to add?" },
      { who: "you", text: "Call mum tomorrow at 6pm" },
    ],
    result: { title: "Added to Orbit", detail: "Call mum · Tomorrow · 6:00 PM" },
  },
  {
    id: "complete",
    name: "Complete Item",
    Icon: Check,
    blurb: "Tick something off without picking up the phone or opening the app",
    lines: [
      { who: "you", text: "Hey Siri, Complete Item" },
      { who: "siri", text: "Which item?" },
      { who: "you", text: "Morning walk" },
    ],
    result: { title: "Completed", detail: "Morning walk" },
  },
] as const;

const SETUP = [
  { n: 1, title: "Open Shortcuts", body: "It comes with every iPhone. Tap the + to make a new shortcut" },
  { n: 2, title: "Add an Orbit action", body: "Search for Orbit and pick Add to Orbit or Complete Item" },
  { n: 3, title: "Name it and use it", body: "Say the name to Siri, or put the shortcut on your Home Screen and tap it" },
];

function Conversation({ id }: { id: (typeof ACTIONS)[number]["id"] }) {
  const action = ACTIONS.find((a) => a.id === id)!;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState<"you" | "siri" | null>(null);
  const run = useRef(0);

  // Paced like a real exchange: time to read the last line, a short "typing" beat, then the next.
  const play = async () => {
    const my = ++run.current;
    setTyping(null);
    setShown(0);
    await wait(700);
    for (let i = 1; i <= 4; i++) {
      if (run.current !== my) return;
      const next = i <= 3 ? action.lines[i - 1].who : "siri";
      if (!reduced) {
        setTyping(next);
        await wait(next === "siri" ? 1100 : 800);
        if (run.current !== my) return;
      }
      setTyping(null);
      setShown(i);
      const read = i <= 3 ? action.lines[i - 1].text.length * 35 : 0;
      await wait(i < 4 ? 900 + read : 0);
    }
  };
  useEffect(() => {
    if (!inView) return;
    void play();
    return () => void run.current++;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, id]);

  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/60">
          <span className="relative grid size-6 place-items-center rounded-full bg-white/15">
            <Mic size={12} />
            {shown > 0 && shown < 4 && <m.span aria-hidden className="absolute inset-0 rounded-full ring-2 ring-white/40" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />}
          </span>
          Example
        </span>
        <button type="button" onClick={() => void play()} aria-label="Replay the example" className="grid size-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"><RotateCcw size={15} /></button>
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-end gap-3" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {action.lines.slice(0, Math.min(shown, 3)).map((l, i) => (
            <m.div
              key={action.id + i}
              layout={!reduced}
              initial={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={EASE}
              className={cn("max-w-[85%] rounded-[20px] px-4 py-2.5 text-[16px] leading-snug", l.who === "you" ? "self-end rounded-br-md bg-white text-[#1d1d1f]" : "self-start rounded-bl-md bg-white/15 text-white")}
            >
              {l.text}
            </m.div>
          ))}
          {typing && (
            <m.div
              key="typing"
              layout={!reduced}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3 }}
              aria-hidden
              className={cn("flex gap-1 rounded-[20px] px-4 py-3.5", typing === "you" ? "self-end rounded-br-md bg-white/80" : "self-start rounded-bl-md bg-white/15")}
            >
              {[0, 1, 2].map((d) => (
                <m.span key={d} className={cn("size-1.5 rounded-full", typing === "you" ? "bg-[#1d1d1f]/50" : "bg-white/70")} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }} />
              ))}
            </m.div>
          )}
          {shown >= 4 && (
            <m.div key="result" layout={!reduced} initial={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={EASE} className="mt-1 flex items-center gap-3 rounded-[18px] bg-white/95 p-3.5 text-[#1d1d1f]">
              <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-[#e87359] text-white"><Check size={20} strokeWidth={2.5} /></span>
              <span>
                <span className="block text-[14px] font-semibold">{action.result.title}</span>
                <span className="block text-[14px] text-[#6d6d73]">{action.result.detail}</span>
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SiriSection() {
  const [active, setActive] = useState<(typeof ACTIONS)[number]["id"]>("add");
  return (
    <section id="siri" aria-labelledby="siri-title" className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Siri and Shortcuts</p>
        <h2 id="siri-title" className="section-title mt-3">Use Orbit without opening it</h2>
        <p className="lead mt-5">Two actions, Add to Orbit and Complete Item, work with Siri and the Shortcuts app. Say what you want and it lands in your plan</p>
      </Reveal>

      <Reveal className="mt-14 grid items-stretch gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-14">
        <div className="flex flex-col justify-center">
          <div role="tablist" aria-label="Orbit actions" className="space-y-3">
            {ACTIONS.map(({ id, name, blurb, Icon }) => {
              const on = active === id;
              return (
                <button key={id} type="button" role="tab" aria-selected={on} onClick={() => setActive(id)} className="relative flex w-full items-start gap-4 rounded-[18px] p-5 text-left transition-colors hover:bg-ink/[0.03]">
                  {on && <m.span layoutId="siri-tab" className="absolute inset-0 rounded-[18px] bg-surface shadow-card ring-1 ring-line" transition={spring.ui} />}
                  <span className={cn("relative grid size-11 shrink-0 place-items-center rounded-[12px] transition-colors", on ? "bg-btn text-on-btn" : "bg-ink/8 text-muted")}><Icon size={20} strokeWidth={2.25} /></span>
                  <span className="relative">
                    <span className="block text-[19px] font-semibold tracking-[-0.02em]">{name}</span>
                    <span className="mt-0.5 block text-[15px] text-muted">{blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[400px] rounded-[28px] p-6 text-white shadow-lift" style={{ background: "radial-gradient(120% 90% at 20% 0%, #4a3a5a 0%, #26263a 50%, #14141f 100%)" }}>
          <Conversation id={active} />
        </div>
      </Reveal>

      <div className="mt-16">
        <Reveal>
          <h3 className="text-center text-[22px] font-semibold tracking-[-0.02em]">Set it up in three steps</h3>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-4 md:grid-cols-3">
          {SETUP.map((s) => (
            <m.div key={s.n} variants={reveal} className="rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
              <span className="grid size-9 place-items-center rounded-full bg-accent/15 text-[15px] font-semibold text-accent-text">{s.n}</span>
              <div className="mt-4 text-[18px] font-semibold tracking-[-0.01em]">{s.title}</div>
              <p className="mt-1 text-[15px] text-muted">{s.body}</p>
            </m.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
