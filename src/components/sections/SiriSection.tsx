"use client";
import { m } from "motion/react";
import { Check, Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { spring } from "@/lib/motion";

const actions = [
  { Icon: Plus, name: "Add to Orbit", body: "Capture a task or a habit with your voice, or from a Shortcut.", tone: "bg-btn text-on-btn" },
  { Icon: Check, name: "Complete Item", body: "Tick something off without opening the app.", tone: "bg-sage text-white" },
];

export function SiriSection() {
  return (
    <section aria-labelledby="siri-title" className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
      <Reveal className="grid items-center gap-10 rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line sm:p-10">
        <div>
          <p className="eyebrow">Siri and Shortcuts</p>
          <h2 id="siri-title" className="section-title mt-3 !text-[clamp(30px,4vw,44px)]">Say it. It is in your plan.</h2>
          <p className="lead mt-4 max-w-lg">Two actions work with Siri and the Shortcuts app, so capturing and completing never needs the screen.</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {actions.map(({ Icon, name, body, tone }) => (
              <m.li key={name} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} transition={spring.lift} className="rounded-[12px] p-4 ring-1 ring-line">
                <span className={`grid size-9 place-items-center rounded-[9px] ${tone}`}><Icon size={18} strokeWidth={2.25} /></span>
                <div className="mt-3 text-[17px] font-semibold tracking-[-0.01em]">{name}</div>
                <p className="mt-0.5 text-[14px] text-muted">{body}</p>
              </m.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
