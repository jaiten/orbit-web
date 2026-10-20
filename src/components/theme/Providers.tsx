"use client";
import { LazyMotion, MotionConfig } from "motion/react";

/**
 * Motion's animation engine loads after first paint (LazyMotion), so it never delays the page.
 * With reducedMotion="user", movement becomes plain fades when the system asks for less motion.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={() => import("@/lib/motion-features").then((m) => m.default)} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
