"use client";
import { useEffect, useState } from "react";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Monitor, Smartphone } from "lucide-react";
import { HeroMark } from "./HeroMark";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { WindowFrame } from "@/components/devices/WindowFrame";
import { TodayPhone } from "@/components/devices/TodayPhone";
import { DesktopApp } from "@/components/devices/DesktopApp";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/links";
import { screenshots } from "@/lib/media";
import { spring } from "@/lib/motion";

export function Hero() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [ticked, setTicked] = useState(false);

  // After the devices land, one item is ticked off on both screens.
  useEffect(() => {
    if (!ready || reduced) return;
    const id = window.setTimeout(() => setTicked(true), 1100);
    return () => window.clearTimeout(id);
  }, [ready, reduced]);

  // Cursor tilt: the single parallax in this section.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring.tilt);
  const sy = useSpring(my, spring.tilt);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const phoneX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const phoneY = useTransform(sy, [-0.5, 0.5], [8, -8]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const phoneTasks = [
    { id: "walk", title: "Morning walk", time: "8:00 AM", done: ticked },
    { id: "focus", title: "Focus on one thing", time: "10:00 AM" },
    { id: "call", title: "Call someone you miss" },
  ];
  const phoneHabits = [
    { id: "read", title: "Read a few pages", color: "lavender" as const, count: "1 of 1", done: true },
    { id: "water", title: "Drink water", color: "sage" as const, count: "4 of 6" },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden px-6 pb-20 pt-24 text-center sm:pt-28" onPointerMove={onMove} onPointerLeave={onLeave}>
      <HeroMark onDone={() => setReady(true)} />
      <h1 id="hero-title" className="display mx-auto mt-6 max-w-4xl text-[clamp(44px,8.4vw,80px)]">
        A little space for what matters.
      </h1>
      <p className="lead mx-auto mt-5 max-w-xl">Capture anything, plan today, see your progress. On iPhone and Windows.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href={links.testflight} size="lg" className="w-full sm:w-auto">
          <Smartphone size={18} /> Join the iPhone beta
        </Button>
        <Button href={links.windows} size="lg" variant="secondary" className="w-full sm:w-auto">
          <Monitor size={18} /> Download for Windows
        </Button>
      </div>
      <p className="mt-4 text-[14px] text-muted">Free. iPhone through TestFlight, Windows as a portable app.</p>

      <m.div
        className="mx-auto mt-12 max-w-[1080px]"
        style={{ perspective: 1400 }}
        initial={{ opacity: 0, y: 72 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={spring.soft}
      >
        <m.div className="flex flex-col items-center md:flex-row md:items-end md:justify-center" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformStyle: "preserve-3d" }}>
          <m.div className="w-full md:w-[70%]" animate={reduced ? undefined : { y: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
            <WindowFrame label="Orbit on Windows: the Today screen with tasks, habits and a progress card." slot={screenshots.windowsToday}>
              <DesktopApp doneIds={ticked ? ["walk"] : []} />
            </WindowFrame>
          </m.div>
          <m.div className="relative z-10 -mt-14 w-[56%] max-w-[260px] md:-ml-[7%] md:mt-0 md:w-[26%] md:max-w-none" style={{ x: reduced ? 0 : phoneX, y: reduced ? 0 : phoneY }}>
            <m.div animate={reduced ? undefined : { y: [0, 8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
              <PhoneFrame label="Orbit on iPhone: the Today screen with tasks, habits and a progress card." slot={screenshots.iosToday}>
                <TodayPhone tasks={phoneTasks} habits={phoneHabits} />
              </PhoneFrame>
            </m.div>
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}
