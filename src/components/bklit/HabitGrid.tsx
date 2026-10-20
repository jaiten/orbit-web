"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

interface Props {
  /** Fraction of the day's target reached, 0 to 1, oldest first. 7 rows per column (a column is a week). */
  levels: number[];
  /** CSS colour, e.g. "var(--sage)". */
  color: string;
  weeks?: number;
  /** Fill cell by cell with an anime.js stagger when scrolled into view. */
  animateIn?: boolean;
  label: string;
  className?: string;
}

const opacityFor = (level: number) => (level <= 0 ? 0 : 0.3 + 0.7 * Math.min(1, level));

/** GitHub-style grid of small boxes. Bklit-style API: data in, colour in. */
export function HabitGrid({ levels, color, weeks = 12, animateIn = false, label, className }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !animateIn || prefersReducedMotion()) return;
    const cells = Array.from(el.querySelectorAll<HTMLElement>("[data-filled]"));
    cells.forEach((c) => c.style.setProperty("--f", "0"));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // anime.js loads on demand. It fills the boxes one by one, row by row, with a stagger.
        void import("animejs").then(({ animate, createSpring, stagger }) =>
          animate(cells, {
            "--f": [0, 1],
            duration: 600,
            ease: createSpring({ stiffness: 300, damping: 30 }),
            delay: stagger(12, { grid: [weeks, 7], from: "first", axis: "y" }),
          }),
        );
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animateIn, weeks, levels]);

  const done = levels.filter((l) => l >= 1).length;
  return (
    <div
      ref={root}
      role="img"
      aria-label={`${label}: ${done} of ${levels.length} days done over the last ${weeks} weeks`}
      className={cn("grid gap-[3px]", className)}
      style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gridTemplateRows: "repeat(7, auto)", gridAutoFlow: "column" }}
    >
      {levels.map((level, i) => (
        <span key={i} className="hg-cell aspect-square" data-filled={level > 0 ? "" : undefined} style={{ "--fill": color, "--o": opacityFor(level) } as React.CSSProperties} />
      ))}
    </div>
  );
}
