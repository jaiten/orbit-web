"use client";
import { m } from "motion/react";
import { RING_PATH } from "@/components/brand/OrbitMark";

// Timeline of the drop, in seconds. The dot lands at IMPACT; the ring is kicked at the same moment.
const DURATION = 1.9;
const IMPACT = 0.36 * DURATION;

// Dot path in the mark's 128 x 128 space: fall onto the ring's open end, squash, rebound in an arc,
// drop into the gap, hop once and settle at its resting place (87, 41).
const dot = {
  x: [64, 64, 64, 79, 87, 87, 87, 87],
  y: [-48, 21, 23, -6, 41, 43, 35, 41],
  scaleX: [1, 1, 1.25, 1, 1, 1.2, 1, 1],
  scaleY: [1, 1, 0.75, 1, 1, 0.8, 1, 1],
};
const times = [0, 0.36, 0.4, 0.58, 0.8, 0.85, 0.92, 1];
const gravity = [0.5, 0, 1, 0.6] as [number, number, number, number]; // slow start, fast finish
const ease: ([number, number, number, number] | "easeOut")[] = [gravity, "easeOut", "easeOut", gravity, "easeOut", "easeOut", gravity];

/**
 * Hero mark: the dot drops onto the ring, the ring spins from the hit on a loose spring and the
 * dot is bounced back into its place in the gap. Plays once. With reduced motion it just shows the finished mark.
 */
export function HeroMark() {
  return (
    <svg viewBox="0 0 128 128" fill="none" aria-hidden className="mx-auto size-24 overflow-visible sm:size-28">
      <m.g
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ type: "spring", stiffness: 55, damping: 8.5, mass: 1, delay: IMPACT }}
      >
        {/* An invisible full circle keeps the group's centre on the ring's centre, so it spins about the right point. */}
        <circle cx="64" cy="64" r="29" stroke="none" />
        <path d={RING_PATH} stroke="var(--accent)" strokeWidth={12} strokeLinecap="round" />
      </m.g>
      <m.circle
        r="8"
        fill="var(--accent)"
        initial={{ x: dot.x[0], y: dot.y[0] }}
        animate={dot}
        transition={{ duration: DURATION, times, ease }}
      />
    </svg>
  );
}
