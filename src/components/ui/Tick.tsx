"use client";
import { m } from "motion/react";
import { spring } from "@/lib/motion";

/** Round checkbox. On completion the tick draws itself (stroke) and the circle scales slightly. */
export function Tick({ done, size = 24, color = "var(--accent)" }: { done: boolean; size?: number; color?: string }) {
  return (
    <m.span
      aria-hidden
      className="relative inline-grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size }}
      animate={{ scale: done ? [1, 1.14, 1] : 1 }}
      transition={{ duration: 0.4, times: [0, 0.4, 1], ease: "easeOut" }}
    >
      <span className="absolute inset-0 rounded-full border-2" style={{ borderColor: done ? color : "color-mix(in srgb, var(--accent) 45%, transparent)" }} />
      <m.span className="absolute inset-0 rounded-full" style={{ background: color }} initial={false} animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.6 }} transition={spring.ui} />
      <svg viewBox="0 0 24 24" className="relative" width={size * 0.58} height={size * 0.58} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <m.path d="M5 12.5l4.5 4.5L19 7.5" initial={false} animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={{ duration: 0.28, ease: "easeOut", delay: done ? 0.08 : 0 }} />
      </svg>
    </m.span>
  );
}
