"use client";
import { useId, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ChevronDown } from "lucide-react";
import { spring } from "@/lib/motion";

/** FAQ dropdowns. Each answer opens on a spring: the height eases open while the text fades up, and the chevron turns. */
export function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  return (
    <div className="divide-y divide-line rounded-[18px] bg-surface shadow-card ring-1 ring-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h2 className="m-0">
              <button
                type="button"
                id={`${id}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-[18px] px-6 py-5 text-left text-[18px] font-medium tracking-[-0.01em] transition-colors hover:bg-ink/[0.025]"
              >
                {it.q}
                <m.span animate={{ rotate: isOpen ? 180 : 0 }} transition={spring.ui} className="shrink-0 text-muted">
                  <ChevronDown size={20} aria-hidden />
                </m.span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  key="panel"
                  id={`${id}-p${i}`}
                  role="region"
                  aria-labelledby={`${id}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { type: "spring", stiffness: 260, damping: 32 }, opacity: { duration: 0.2 } }}
                  className="overflow-hidden"
                >
                  <m.div initial={{ y: -6 }} animate={{ y: 0 }} exit={{ y: -6 }} transition={spring.ui} className="space-y-3 px-6 pb-6 text-[16px] text-muted [&_a]:text-accent-text [&_a]:underline [&_a]:underline-offset-2 [&_b]:font-medium [&_b]:text-ink">
                    {it.a}
                  </m.div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
