/**
 * Motion presets. Every animation on the site draws from here so the whole
 * page moves with the same physics: springs, never linear easing.
 */
import type { Transition, Variants } from "motion/react";

export const spring = {
  /** Default UI: rows, chips, buttons. */
  ui: { type: "spring", stiffness: 300, damping: 30 } satisfies Transition,
  /** Slightly livelier, for hover lifts. */
  lift: { type: "spring", stiffness: 400, damping: 28 } satisfies Transition,
  /** Large elements: devices, windows. */
  soft: { type: "spring", stiffness: 120, damping: 24, mass: 1.1 } satisfies Transition,
  /** Scroll-linked values follow the scroll with a little give. */
  follow: { stiffness: 140, damping: 24, mass: 0.4 },
  /** Cursor tilt. */
  tilt: { stiffness: 120, damping: 20, mass: 0.6 },
} as const;

/** Reveals play once, when about 20% of the element is visible. */
export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Gap between staggered siblings, in seconds (40 to 60 ms). */
export const STAGGER = 0.05;

export const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: spring.ui },
};

export const revealGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

/** Row sliding in from the side, used inside the Today screen. */
export const rowIn: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: spring.ui },
};
