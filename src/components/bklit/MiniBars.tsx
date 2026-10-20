"use client";
import { m } from "motion/react";
import { spring, STAGGER, viewportOnce } from "@/lib/motion";

/** Small bar chart: days done in each of the last 12 weeks. Bars grow from the baseline (transform only). */
export function MiniBars({ values, max = 7, color, label }: { values: number[]; max?: number; color: string; label: string }) {
  return (
    <figure className="m-0">
      <m.div
        role="img"
        aria-label={label}
        className="flex h-24 items-end gap-1.5"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={{ show: { transition: { staggerChildren: STAGGER / 2 } } }}
      >
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 items-end rounded-[4px]" style={{ background: "color-mix(in srgb, var(--ink) 5%, transparent)" }}>
            <m.div
              className="w-full origin-bottom rounded-[4px]"
              style={{ height: `${Math.max(6, (v / max) * 100)}%`, background: color, opacity: i === values.length - 1 ? 1 : 0.75 }}
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: spring.ui } }}
            />
          </div>
        ))}
      </m.div>
      <figcaption className="mt-2 flex justify-between text-[12px] text-muted">
        <span>12 weeks ago</span>
        <span>This week</span>
      </figcaption>
    </figure>
  );
}
