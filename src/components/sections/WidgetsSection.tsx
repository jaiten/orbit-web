"use client";
import { BentoCard, BentoGrid } from "@/components/kokonut/BentoGrid";
import { ChecklistWidget, GridWidget, LockScreen, PlanProvider, ProgressWidget } from "@/components/widgets/Widgets";
import { Reveal, RevealGroup, reveal } from "@/components/ui/Reveal";
import { m } from "motion/react";

type Tile = { label: string; className: string; render: (a: boolean) => React.ReactNode };

const small = "h-44 sm:h-auto";
const medium = "h-44 sm:col-span-2 sm:h-auto";
const large = "h-[22rem] sm:col-span-2 sm:row-span-2 sm:h-auto";

const tiles: Tile[] = [
  { label: "Progress widget, large", className: large, render: (a) => <ProgressWidget size="l" active={a} /> },
  { label: "Checklist widget, large. Tick items off from the Home Screen.", className: large, render: (a) => <ChecklistWidget size="l" active={a} /> },
  { label: "Grid widget, large", className: large, render: (a) => <GridWidget size="l" active={a} /> },
  { label: "Progress widget, medium", className: medium, render: (a) => <ProgressWidget size="m" active={a} /> },
  { label: "Checklist widget, medium", className: medium, render: (a) => <ChecklistWidget size="m" active={a} /> },
  { label: "Grid widget, medium", className: medium, render: (a) => <GridWidget size="m" active={a} /> },
  { label: "Progress widget, small", className: small, render: (a) => <ProgressWidget size="s" active={a} /> },
  { label: "Grid widget, small", className: small, render: (a) => <GridWidget size="s" active={a} /> },
];

export function WidgetsSection() {
  return (
    <section id="widgets" aria-labelledby="widgets-title" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Widgets</p>
        <h2 id="widgets-title" className="section-title mt-3">Your day, on the Home Screen.</h2>
        <p className="lead mt-5">The Today widget comes in three styles: Progress, Checklist and Grid. Tick items off without opening the app, or check the boxes at a glance. Lock Screen widgets too.</p>
      </Reveal>

      <PlanProvider>
      <div className="mt-14 grid items-start gap-10 xl:grid-cols-[minmax(0,760px)_1fr] xl:gap-14">
        <m.div variants={{ hidden: {}, show: {} }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <BentoGrid>
            {tiles.map((t) => (
              <m.div key={t.label} variants={reveal} className={t.className}>
                <BentoCard label={t.label} className="h-full">{t.render}</BentoCard>
              </m.div>
            ))}
          </BentoGrid>
          <p className="mt-4 text-center text-[13px] text-muted xl:text-left">Hover, tap or focus a widget to see it respond.</p>
        </m.div>

        <RevealGroup className="grid gap-6">
          <m.div variants={reveal}>
            <BentoCard label="Lock Screen widgets: a progress count, the next item and a habit gauge." className="h-[22rem]">{(a) => <LockScreen active={a} />}</BentoCard>
            <p className="mt-3 text-[14px] text-muted">Lock Screen widgets keep the count and your next item in sight.</p>
          </m.div>
        </RevealGroup>
      </div>
      </PlanProvider>
    </section>
  );
}
