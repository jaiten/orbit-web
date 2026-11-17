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
  // Entrance: the window and phone rise out of the page and settle, then the first item gets ticked.
  const [ticked, setTicked] = useState(false);
  useEffect(() => {
    if (reduced) return setTicked(true);
    const id = window.setTimeout(() => setTicked(true), 1500);
    return () => window.clearTimeout(id);
  }, [reduced]);
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
      <HeroMark />
      <h1 id="hero-title" className="display mx-auto mt-6 max-w-4xl text-[clamp(44px,8.4vw,80px)]">
        A little space for what matters
      </h1>
      <p className="lead mx-auto mt-5 max-w-xl">Plan your day, see your progress, synced between iPhone and Windows</p>
      <m.div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.ui, delay: 0.15 }}>
        <Button href={links.testflight} size="lg" className="w-full sm:w-auto">
          <Smartphone size={18} /> Join the iPhone beta
        </Button>
        <Button href={links.windows} size="lg" variant="secondary" className="w-full sm:w-auto">
          <Monitor size={18} /> Download for Windows
        </Button>
      </m.div>
      <p className="mt-4 text-[14px] text-muted">Free. iPhone through TestFlight, Windows with an installer and automatic updates.</p>

      <m.div
        className="mx-auto mt-12 max-w-[1080px]"
        style={{ perspective: 1400 }}
      >
        <m.div className="flex flex-col items-center md:flex-row md:items-end md:justify-center" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformStyle: "preserve-3d" }}>
          <m.div
            className="w-full md:w-[70%]"
            style={{ transformOrigin: "50% 100%" }}
            initial={{ opacity: 0, y: 96, rotateX: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ ...spring.soft, delay: 0.1 }}
          >
            <WindowFrame label="Orbit on Windows: the Today screen with tasks, habits and a progress card." slot={screenshots.windowsToday}>
                <DesktopApp doneIds={ticked ? ["walk"] : []} />
              </WindowFrame>
          </m.div>
          <m.div className="relative z-10 -mt-14 w-[56%] max-w-[260px] md:-ml-[7%] md:mt-0 md:w-[26%] md:max-w-none" style={{ x: reduced ? 0 : phoneX, y: reduced ? 0 : phoneY }}>
            <m.div
              initial={{ opacity: 0, y: 140, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0.3 }}
            >
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
