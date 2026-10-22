"use client";
import { useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { RING_PATH } from "@/components/brand/OrbitMark";

/**
 * The closing mark. When it scrolls into view the dot lifts off, takes one lap around the ring on a loose spring
 * (it speeds up, overshoots a little and settles back in the gap). Hover or tap it to send the dot round again.
 */
export function OrbitPlay() {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [laps, setLaps] = useState(0);
  const busy = useRef(false);

  const go = () => {
    if (busy.current) return;
    busy.current = true;
    setLaps((l) => l + 1);
  };
  useEffect(() => {
    if (inView) go();
  }, [inView]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={go}
      onPointerEnter={go}
      aria-label="Orbit logo. Activate to send the dot around the ring."
      className="mx-auto block size-[clamp(180px,32vw,320px)] cursor-pointer rounded-full"
    >
      <svg viewBox="0 0 128 128" fill="none" aria-hidden className="size-full overflow-visible">
        <path d={RING_PATH} stroke="var(--accent)" strokeWidth={12} strokeLinecap="round" />
        <m.g
          initial={false}
          animate={{ rotate: laps * 360 }}
          transition={{ type: "spring", stiffness: 20, damping: 6, mass: 1 }}
          onAnimationComplete={() => (busy.current = false)}
        >
          {/* Invisible circle on the ring's path keeps the group's centre on the ring's centre. */}
          <circle cx="64" cy="64" r="32.5" stroke="none" />
          <circle cx="87" cy="41" r="8" fill="var(--accent)" />
        </m.g>
      </svg>
    </button>
  );
}
