"use client";
import { useEffect, useRef } from "react";
import { RING_PATH } from "@/components/brand/OrbitMark";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";

// The dot's resting place sits just outside the ring's gap. Its orbit is a circle of r 32.5 starting there.
const ORBIT = "M87 41A32.5 32.5 0 0 1 41 87A32.5 32.5 0 0 1 87 41";

/**
 * Hero intro (anime.js): the ring draws itself, then the dot glides once around it and settles in the gap.
 * Calls onDone when finished so the devices can rise. anime.js loads on demand, after first paint.
 */
export function HeroMark({ onDone }: { onDone: () => void }) {
  const ring = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const orbit = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone();
      return;
    }
    let cancelled = false;
    let timeline: { pause(): unknown } | null = null;
    // If anything stalls, never leave the devices hidden.
    const safety = window.setTimeout(onDone, 3500);

    import("animejs").then(({ createTimeline, svg }) => {
      const path = orbit.current;
      const dotEl = dot.current;
      const ringEl = ring.current;
      if (cancelled || !path || !dotEl || !ringEl) return;

      const length = path.getTotalLength();
      const [drawable] = svg.createDrawable(ringEl);
      const lap = { t: 0 };
      dotEl.style.opacity = "0";

      timeline = createTimeline({ defaults: { ease: "outQuart" }, onComplete: onDone })
        .add(drawable, { draw: ["0 0.001", "0 1"], duration: 900 }, 0)
        .add(dotEl, { opacity: [0, 1], duration: 300, ease: "linear" }, 600)
        .add(
          lap,
          {
            t: 1,
            duration: 1200,
            ease: "inOutSine",
            onUpdate: () => {
              const p = path.getPointAtLength(lap.t * length);
              dotEl.setAttribute("cx", String(p.x));
              dotEl.setAttribute("cy", String(p.y));
            },
          },
          700,
        );
    });

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      timeline?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg viewBox="0 0 128 128" fill="none" aria-hidden className="mx-auto size-24 overflow-visible sm:size-28">
      <path ref={ring} d={RING_PATH} stroke="var(--accent)" strokeWidth={12} strokeLinecap="round" />
      <path ref={orbit} d={ORBIT} stroke="none" fill="none" />
      <circle ref={dot} cx="87" cy="41" r="8" fill="var(--accent)" />
    </svg>
  );
}
