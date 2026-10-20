"use client";
import { m } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** A physical-looking key. It presses down while `pressed` is true. */
export function Keycap({ children, pressed, wide, onPress, label }: { children: React.ReactNode; pressed: boolean; wide?: boolean; onPress?: () => void; label?: string }) {
  return (
    <m.button
      type="button"
      onClick={onPress}
      aria-label={label}
      aria-pressed={pressed}
      animate={{ y: pressed ? 3 : 0 }}
      transition={spring.lift}
      className={cn(
        "relative inline-flex h-11 min-w-11 items-center justify-center rounded-[9px] px-3 font-mono text-[14px] font-medium transition-[background-color,box-shadow,color] duration-150",
        wide && "min-w-[72px]",
        pressed ? "bg-accent/20 text-accent-text shadow-[0_0_0_1px_var(--accent),0_0_0_0_transparent]" : "bg-surface text-ink shadow-[0_0_0_1px_var(--line),0_3px_0_0_var(--line)]",
      )}
    >
      {children}
    </m.button>
  );
}
