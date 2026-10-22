"use client";
import { m } from "motion/react";
import { spring, STAGGER, viewportOnce } from "@/lib/motion";
import { weekdayLetters } from "@/lib/sample-data";
import { cn } from "@/lib/cn";

/** "5 of the last 7 days" as seven segments. */
export function WeekBar({ done, color, size = "md", showLabels = false, className }: { done: boolean[]; color: string; size?: "sm" | "md" | "lg"; showLabels?: boolean; className?: string }) {
  const h = { sm: "h-1.5", md: "h-2.5", lg: "h-4" }[size];
  return (
    <div role="img" aria-label={`${done.filter(Boolean).length} of the last 7 days`} className={className}>
      <m.div className="flex gap-1.5" initial="hidden" whileInView="show" viewport={viewportOnce} variants={{ show: { transition: { staggerChildren: STAGGER } } }}>
        {done.map((d, i) => (
          <div key={i} className="flex-1">
            <div className={cn("w-full origin-center overflow-hidden rounded-full transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-y-[1.7]", h)} style={{ background: "color-mix(in srgb, var(--ink) 8%, transparent)" }}>
              <m.div
                className="h-full w-full origin-left rounded-full"
                style={{ background: color }}
                variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: d ? 1 : 0, opacity: d ? 1 : 0, transition: spring.ui } }}
              />
            </div>
            {showLabels && <div className="mt-1.5 text-center text-[11px] text-muted">{weekdayLetters[i]}</div>}
          </div>
        ))}
      </m.div>
    </div>
  );
}
