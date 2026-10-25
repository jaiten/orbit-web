"use client";
import { Lock, Smartphone } from "lucide-react";
import { m } from "motion/react";
import { BentoCard } from "@/components/kokonut/BentoGrid";
import { ChecklistWidget, GridWidget, LockScreen, PlanProvider, ProgressWidget } from "@/components/widgets/Widgets";
import { Reveal, reveal } from "@/components/ui/Reveal";
import { revealGroup, viewportOnce } from "@/lib/motion";

/** Real widget proportions: small is a square, medium is two squares wide, large is two by two. */
const SIZE = {
  s: "h-[152px] w-[152px]",
  m: "h-[152px] w-[320px]",
  l: "h-[320px] w-[320px]",
} as const;

function Tile({ size, label, children }: { size: keyof typeof SIZE; label: string; children: (active: boolean) => React.ReactNode }) {
  return (
    <m.div variants={reveal} className={`${SIZE[size]} max-w-full @container`}>
      <BentoCard label={label} className="h-full">{children}</BentoCard>
    </m.div>
  );
}

function Where({ place }: { place: "Home Screen" | "Lock Screen" }) {
  const Icon = place === "Home Screen" ? Smartphone : Lock;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1 text-[12px] font-semibold text-accent-text">
      <Icon size={13} strokeWidth={2.25} aria-hidden /> {place}
    </span>
  );
}

function Row({ place, name, blurb, sizes, children }: { place: "Home Screen" | "Lock Screen"; name: string; blurb: string; sizes?: string; children: React.ReactNode }) {
  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,220px)_1fr] md:gap-12">
      <Reveal>
        <Where place={place} />
        <h3 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.03em]">{name}</h3>
        <p className="mt-2 text-[16px] text-muted">{blurb}</p>
        {sizes && <p className="mt-4 text-[13px] text-muted">{sizes}</p>}
      </Reveal>
      <m.div variants={revealGroup} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid justify-center gap-4 md:grid-cols-[320px_320px] md:justify-start">
        {children}
      </m.div>
    </div>
  );
}

/** Large tile on the left; medium over small on the right, so the three sizes line up as one block. */
function Trio({ l, m: medium, s }: { l: React.ReactNode; m: React.ReactNode; s: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto md:mx-0">{l}</div>
      <div className="mx-auto flex flex-col gap-4 md:mx-0">
        {medium}
        {s}
      </div>
    </>
  );
}

export function WidgetsSection() {
  return (
    <section id="widgets" aria-labelledby="widgets-title" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Widgets</p>
        <h2 id="widgets-title" className="section-title mt-3">Your plan on the Home Screen and Lock Screen</h2>
        <p className="lead mt-5">Pick from three widget styles, Progress, Checklist and Grid. Each comes in small, medium and large</p>
      </Reveal>

      <PlanProvider>
        <div className="mt-16 space-y-20">
          <Row place="Home Screen" name="Progress" blurb="A ring or a bar that counts your day. In the large size, tick items off right on the widget">
            <Trio
              l={<Tile size="l" label="Progress widget, large. Tick items off.">{(a) => <ProgressWidget size="l" active={a} />}</Tile>}
              m={<Tile size="m" label="Progress widget, medium">{(a) => <ProgressWidget size="m" active={a} />}</Tile>}
              s={<Tile size="s" label="Progress widget, small">{(a) => <ProgressWidget size="s" active={a} />}</Tile>}
            />
          </Row>

          <Row place="Home Screen" name="Checklist" blurb="Your tasks as a list you can tick off from the Home Screen, without opening the app">
            <Trio
              l={<Tile size="l" label="Checklist widget, large">{() => <ChecklistWidget size="l" />}</Tile>}
              m={<Tile size="m" label="Checklist widget, medium">{() => <ChecklistWidget size="m" />}</Tile>}
              s={<span />}
            />
          </Row>

          <Row place="Home Screen" name="Grid" blurb="A calendar of boxes for a habit. Each box is a date, and it fills in when you did it. Tap today's box to complete it">
            <Trio
              l={<Tile size="l" label="Grid widget, large. A month of boxes.">{(a) => <GridWidget size="l" active={a} />}</Tile>}
              m={<Tile size="m" label="Grid widget, medium. A month of boxes.">{(a) => <GridWidget size="m" active={a} />}</Tile>}
              s={<Tile size="s" label="Grid widget, small. The last seven days.">{(a) => <GridWidget size="s" active={a} />}</Tile>}
            />
          </Row>

          <Row place="Lock Screen" name="Lock Screen" blurb="Your count, your next item and a habit gauge, in sight before you unlock">
            <div className="mx-auto h-[360px] w-[320px] max-w-full md:mx-0">
              <BentoCard label="Lock Screen widgets: a progress count, the next item and a habit gauge." className="h-full">{(a) => <LockScreen active={a} />}</BentoCard>
            </div>
          </Row>
        </div>
      </PlanProvider>
    </section>
  );
}
