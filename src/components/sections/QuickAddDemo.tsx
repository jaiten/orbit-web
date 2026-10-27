"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useInView } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Tick } from "@/components/ui/Tick";
import { chipParts, parse } from "@/lib/quick-add";
import { spring } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const PHRASES = ["gym tomorrow 6pm", "read every day", "call mum someday"];
const SUGGESTIONS = [...PHRASES, "dentist friday 3:30pm"];

interface Added { id: number; title: string; chip: string[]; kind: "task" | "habit" }

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

export function QuickAddDemo() {
  const section = useRef<HTMLDivElement>(null);
  const inView = useInView(section, { amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [now, setNow] = useState<Date | null>(null);
  const [value, setValue] = useState("");
  const [interacted, setInteracted] = useState(false);
  const [added, setAdded] = useState<Added[]>([]);
  const [pressing, setPressing] = useState(false);
  const nextId = useRef(1);
  const ran = useRef(false);

  useEffect(() => setNow(new Date()), []);

  const result = useMemo(() => parse(value, null, now ?? new Date(2026, 9, 20, 9, 0)), [value, now]);
  const parts = now || value ? chipParts(result, now ?? undefined) : [];

  const add = (text: string) => {
    const r = parse(text, null, now ?? new Date());
    if (!r.title) return;
    setAdded((list) => [{ id: nextId.current++, title: r.title, chip: chipParts(r, now ?? undefined), kind: r.kind }, ...list].slice(0, 4));
    setValue("");
  };

  // Auto-typing runs while the demo is on screen, until the visitor takes over.
  useEffect(() => {
    if (!inView || interacted || !now || ran.current) return;
    if (reduced) {
      setValue(PHRASES[0]);
      return;
    }
    ran.current = true; // Each phrase is typed and added once, then the demo is the visitor's.
    let cancelled = false;
    (async () => {
      for (const phrase of PHRASES) {
        if (cancelled) return;
        for (let c = 1; c <= phrase.length && !cancelled; c++) {
          setValue(phrase.slice(0, c));
          await wait(60 + Math.random() * 40);
        }
        await wait(1500);
        if (cancelled) return;
        setPressing(true);
        await wait(160);
        setPressing(false);
        add(phrase);
        await wait(700);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, interacted, reduced, now]);

  return (
    <section id="features" aria-labelledby="qa-title" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Smart add</p>
          <h2 id="qa-title" className="section-title mt-3">Type it like you’d say it</h2>
          <p className="lead mt-5 max-w-md">Intelligently plan your day with smart add. Use plain words to describe all the details of your task</p>
        </Reveal>

        <Reveal>
          <div ref={section} className="rounded-[18px] bg-surface p-5 shadow-card ring-1 ring-line sm:p-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setInteracted(true);
                add(value);
              }}
            >
              <label htmlFor="qa-input" className="sr-only">Try smart add</label>
              <div className="flex items-center gap-2 rounded-[12px] bg-canvas p-1.5 pl-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-accent-text">
                <Plus size={18} className="shrink-0 text-muted" aria-hidden />
                <input
                  id="qa-input"
                  value={value}
                  onChange={(e) => {
                    setInteracted(true);
                    setValue(e.target.value);
                  }}
                  onFocus={() => setInteracted(true)}
                  placeholder="gym tomorrow 6pm"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="h-11 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-muted"
                />
                <m.button type="submit" animate={{ scale: pressing ? 0.93 : 1 }} transition={spring.lift} className="h-11 rounded-[9px] bg-btn px-5 text-[15px] font-medium text-on-btn">
                  Add
                </m.button>
              </div>
            </form>

            <LayoutGroup>
              <div className="mt-4 flex min-h-9 items-center" aria-live={interacted ? "polite" : "off"}>
                {parts.length > 0 ? (
                  <m.div layout transition={spring.ui} className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-4 py-1.5 text-[14px] font-medium text-accent-text" style={{ borderRadius: 999 }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {parts.map((p, i) => (
                        <m.span key={p + i} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={spring.ui} className="inline-flex items-center gap-2">
                          {i > 0 && <span aria-hidden className="opacity-50">·</span>}
                          {p}
                        </m.span>
                      ))}
                    </AnimatePresence>
                  </m.div>
                ) : (
                  <span className="text-[14px] text-muted">Start typing to see what Orbit will create.</span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Try an example">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => { setInteracted(true); setValue(s); }} className="rounded-full px-3.5 py-1.5 text-[14px] text-muted ring-1 ring-line transition-colors hover:bg-ink/5 hover:text-ink active:scale-95">
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Your plan</div>
                <ul className="flex min-h-[200px] flex-col gap-2">
                  <AnimatePresence initial={false} mode="popLayout">
                    {added.map((a) => (
                      <m.li key={a.id} layout initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={spring.ui} className="flex h-[46px] items-center gap-3 rounded-[12px] bg-canvas px-3.5 ring-1 ring-line">
                        {a.kind === "task" ? <Tick done={false} size={22} /> : <span aria-hidden className="grid size-[22px] place-items-center"><span className="size-2.5 rounded-full bg-sage" /></span>}
                        <span className="min-w-0 flex-1 truncate text-[16px]">{a.title}</span>
                        <span className="shrink-0 text-[13px] text-muted">{a.chip.slice(1).join(" · ") || a.chip[0]}</span>
                      </m.li>
                    ))}
                  </AnimatePresence>
                  {added.length === 0 && <li className="text-[14px] text-muted">Added items appear here.</li>}
                </ul>
              </div>
            </LayoutGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
