"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { WindowFrame } from "@/components/devices/WindowFrame";
import { TodayPhone } from "@/components/devices/TodayPhone";
import { DesktopApp } from "@/components/devices/DesktopApp";
import { SyncLine } from "./SyncLine";
import { Reveal } from "@/components/ui/Reveal";
import { SyncStage } from "./SyncStage";
import { links } from "@/lib/links";

export function SyncSection() {
  return (
    <section id="sync" aria-labelledby="sync-title" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Sync</p>
        <h2 id="sync-title" className="section-title mt-3">Two devices, one plan</h2>
        <p className="lead mt-5">Sign in with one account on iPhone and Windows and your plan follows you</p>
      </Reveal>

      <Reveal className="mx-auto mt-14 flex max-w-3xl flex-col items-center justify-center gap-0 md:flex-row md:items-end md:gap-2">
        <div className="w-[168px] shrink-0">
          <PhoneFrame label="Orbit on iPhone, showing the same plan as the Windows app.">
            <TodayPhone tasks={[{ id: "walk", title: "Morning walk", time: "8:00 AM", done: true }, { id: "focus", title: "Focus on one thing", time: "10:00 AM" }, { id: "call", title: "Call someone you miss" }]} habits={[{ id: "water", title: "Drink water", color: "sage", count: "4 of 6" }]} />
          </PhoneFrame>
        </div>
        <div className="relative h-[120px] w-[60px] md:mb-14 md:h-[80px] md:w-[160px]">
          <SyncLine className="absolute left-1/2 top-1/2 h-[80px] w-[160px] -translate-x-1/2 -translate-y-1/2 rotate-90 md:rotate-0" />
        </div>
        <div className="w-full max-w-[460px] md:w-[460px]">
          <WindowFrame label="Orbit on Windows, showing the same plan as the iPhone app.">
            <DesktopApp doneIds={["walk"]} />
          </WindowFrame>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <SyncStage />
      </Reveal>

      <Reveal className="mt-10 flex flex-col items-center gap-3 text-center">
        <Link href={links.privacy} className="inline-flex items-center gap-1.5 rounded-full text-[15px] font-medium text-accent-text hover:underline">
          Read the privacy page <ArrowRight size={16} />
        </Link>
      </Reveal>
    </section>
  );
}
