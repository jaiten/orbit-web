"use client";
import { m } from "motion/react";
import { reveal, revealGroup, viewportOnce } from "@/lib/motion";

/** Fades and lifts its children in once, at about 20% visibility. */
export function Reveal({ children, className, as = "div", delay = 0 }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "li" | "p"; delay?: number }) {
  const Tag = m[as] as typeof m.div;
  return (
    <Tag className={className} variants={reveal} initial="hidden" whileInView="show" viewport={viewportOnce} transition={delay ? { delay } : undefined}>
      {children}
    </Tag>
  );
}

/** Staggers its direct <Reveal>-like children 50ms apart. Children must use the `reveal` variants. */
export function RevealGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={className} variants={revealGroup} initial="hidden" whileInView="show" viewport={viewportOnce}>
      {children}
    </m.div>
  );
}

export const Item = m.div;
export { reveal };
