"use client";
import { useEffect, useRef, useState } from "react";
import { m, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { TodayPhone, type PhoneTask } from "@/components/devices/TodayPhone";
import { Reveal } from "@/components/ui/Reveal";
import { spring } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const STEPS = [
  { title: "Only today", body: "Today shows what is dated today, anything overdue, and the habits due today" },
  { title: "Come back to it whenever", body: "Missed something? You choose when to pick it back up" },
  { title: "Create lists", body: "Plan a task by choosing when to complete it, or set it aside with Later or Someday until you are ready" },
  { title: "Tick it off", body: "Feel good about being finished as items settle below the open ones and your plan fills in" },
];

const stepFor = (p: number) => (p < 0.18 ? 0 : p < 0.42 ? 1 : p < 0.68 ? 2 : 3);

export function TodaySection() {
  const container = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const seen = useInView(phoneRef, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [scrollStep, setStep] = useState(0);
  const step = reduced ? 3 : scrollStep;

  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(stepFor(p)));

  // Beats inside a step: the overdue row is tapped, then slides into the day; items are ticked one after another.
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    setBeat(0);
    if (step < 2) return;
    const ids = [window.setTimeout(() => setBeat(1), reduced ? 0 : 700), window.setTimeout(() => setBeat(2), reduced ? 0 : 1500)];
    return () => ids.forEach(window.clearTimeout);
  }, [step, reduced]);

  const merged = step === 3 || (step === 2 && beat >= 1);
  const tasks: PhoneTask[] = [
    ...(merged ? [{ id: "pay", title: "Send the invoice", done: step === 3 && beat >= 2 }] : []),
    { id: "walk", title: "Morning walk", time: "8:00 AM", done: step === 3 },
    { id: "focus", title: "Focus on one thing", time: "10:00 AM" },
    { id: "call", title: "Call someone you miss" },
  ];
  const overdue = step >= 1 && !merged ? { id: "pay", title: "Send the invoice", pressed: step >= 2 ? ("Today" as const) : null } : null;
  const done = tasks.filter((t) => t.done).length;

  return (
    <section id="today" aria-labelledby="today-title" className="scroll-mt-0">
      <div ref={container} className="relative h-[300svh] motion-reduce:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-x-16 gap-y-3 px-6 pt-[72px] max-md:justify-items-center max-md:text-center md:grid-cols-2 md:grid-rows-[auto_auto] md:content-center md:gap-y-8 md:pt-12">
            <div className="md:col-start-1 md:row-start-1 md:self-end">
              <p className="eyebrow">Today</p>
              <h2 id="today-title" className="section-title mt-2 max-md:text-[30px] md:mt-3">Simplify your day</h2>
            </div>

            <div className="md:col-start-1 md:row-start-2 md:self-start">
              <ol className="hidden space-y-6 md:block motion-reduce:block">
                {STEPS.map((s, i) => {
                  const active = step === i || reduced;
                  return (
                    <li key={s.title} className="relative">
                      <span aria-hidden className="absolute -left-5 inset-y-0 w-px bg-line" />
                      <m.span aria-hidden className="absolute -left-5 inset-y-0 w-px origin-top bg-accent" initial={false} animate={{ scaleY: active ? 1 : 0 }} transition={spring.ui} />
                      <h3 className={cn("text-[19px] font-semibold tracking-[-0.02em] transition-colors duration-300", active ? "text-ink" : "text-muted")}>{s.title}</h3>
                      <p className="mt-1 max-w-md text-[16px] text-muted">{s.body}</p>
                    </li>
                  );
                })}
              </ol>
              {/* Phones show one caption at a time */}
              <div className="min-h-[116px] md:hidden motion-reduce:hidden">
                <h3 className="text-[18px] font-semibold tracking-[-0.02em]">{STEPS[step].title}</h3>
                <p className="mx-auto mt-1 max-w-sm text-[15px] leading-snug text-muted">{STEPS[step].body}</p>
                <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
                  {STEPS.map((_, i) => <span key={i} className={cn("h-1.5 rounded-full bg-line transition-all duration-300", i === step && "bg-accent")} style={{ width: i === step ? 24 : 6 }} />)}
                </div>
              </div>
            </div>

            <div className="flex justify-center max-md:order-none md:col-start-2 md:row-span-2 md:row-start-1 md:justify-end">
              <div ref={phoneRef} className="w-[min(220px,calc((100svh-400px)*0.472))] md:w-[min(320px,calc((100svh-150px)*0.472))]">
                <PhoneFrame label={`Orbit's Today screen. ${STEPS[step].title} ${STEPS[step].body}`}>
                  <TodayPhone tasks={tasks} overdue={overdue} habits={[{ id: "water", title: "Drink water", color: "sage", count: "4 of 6" }]} empty={!seen && !reduced} />
                </PhoneFrame>
                <span className="sr-only">{done} of {tasks.length} tasks done.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 sm:h-32" aria-hidden />
    </section>
  );
}
