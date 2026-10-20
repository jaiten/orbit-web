"use client";
import { useRef, useState } from "react";
import { m } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Bento grid in the Kokonut style: a grid of rounded tiles that lift on hover.
 * Rows are one quarter of the container width, so a tile's size decides its shape.
 */
export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="@container">
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-4 sm:grid-flow-dense sm:auto-rows-[calc((100cqw-3rem)/4)]", className)}>{children}</div>
    </div>
  );
}

/**
 * One tile. Hover, keyboard focus and touch all lift it on a spring and switch `active`,
 * which children use to play their micro-interaction.
 */
export function BentoCard({ label, className, children }: { label: string; className?: string; children: (active: boolean) => React.ReactNode }) {
  const [active, setActive] = useState(false);
  const timer = useRef<number>(0);
  return (
    <m.div
      role="group"
      tabIndex={0}
      aria-label={label}
      className={cn("relative rounded-card outline-offset-4", className)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileFocus={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      transition={spring.lift}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onTap={() => {
        setActive(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setActive(false), 1800);
      }}
    >
      <m.span aria-hidden className="pointer-events-none absolute inset-0 rounded-card shadow-lift" initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.25 }} />
      <div className="relative h-full w-full overflow-hidden rounded-card bg-surface ring-1 ring-line">{children(active)}</div>
    </m.div>
  );
}
