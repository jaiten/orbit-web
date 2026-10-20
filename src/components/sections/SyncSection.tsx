"use client";
import { useState } from "react";
import Link from "next/link";
import { m } from "motion/react";
import { ArrowRight, Download, GitCompareArrows, HardDrive, WifiOff } from "lucide-react";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { WindowFrame } from "@/components/devices/WindowFrame";
import { TodayPhone } from "@/components/devices/TodayPhone";
import { DesktopApp } from "@/components/devices/DesktopApp";
import { SyncLine } from "./SyncLine";
import { Reveal, RevealGroup, reveal } from "@/components/ui/Reveal";
import { links } from "@/lib/links";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

const points = [
  { Icon: WifiOff, title: "Works offline", body: "Everything works without a connection. Sync catches up when you are back." },
  { Icon: HardDrive, title: "Saves on your device first", body: "Each change is saved locally before anything is sent anywhere." },
  { Icon: GitCompareArrows, title: "Shows both versions if two devices disagree", body: "Orbit never overwrites quietly. You see both and choose." },
  { Icon: Download, title: "Export everything as JSON or CSV", body: "One JSON backup both apps can read, and a CSV for spreadsheets." },
];

const versions = [
  { id: "ios", device: "iPhone", when: "Edited 9:12 AM", text: "Call Sam · 6:00 PM" },
  { id: "win", device: "Windows", when: "Edited 9:14 AM", text: "Call Sam · 7:00 PM" },
];

function Conflict() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex h-full flex-col rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
      <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-accent-text">Two versions</div>
      <p className="mt-2 text-[15px] text-muted">The same task changed on both devices. Choose the one you want.</p>
      <div className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Choose a version">
        {versions.map((v) => (
          <button key={v.id} type="button" role="radio" aria-checked={picked === v.id} onClick={() => setPicked(v.id)} className="relative rounded-[12px] px-4 py-3 text-left ring-1 ring-line transition-colors hover:bg-ink/[0.03]">
            {picked === v.id && <m.span layoutId="picked" className="absolute inset-0 rounded-[12px] bg-accent/10 ring-2 ring-accent-text" transition={spring.ui} />}
            <span className="relative block text-[12px] text-muted">{v.device} · {v.when}</span>
            <span className="relative mt-0.5 block text-[16px] font-medium">{v.text}</span>
          </button>
        ))}
      </div>
      <p className={cn("mt-auto pt-4 text-[13px] transition-opacity", picked ? "opacity-100" : "opacity-0")} aria-live="polite">{picked ? "Kept. The other version is gone only because you chose." : " "}</p>
    </div>
  );
}

export function SyncSection() {
  return (
    <section id="privacy" aria-labelledby="sync-title" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Sync and privacy</p>
        <h2 id="sync-title" className="section-title mt-3">Two devices. One plan. Yours.</h2>
        <p className="lead mt-5">Sign in with one account on iPhone and Windows and your plan follows you. Sync is optional, and without it nothing leaves your device.</p>
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

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {points.map(({ Icon, title, body }) => (
            <m.div key={title} variants={reveal} className="rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
              <span className="grid size-10 place-items-center rounded-full bg-accent/12 text-accent-text"><Icon size={19} strokeWidth={1.75} /></span>
              <h3 className="mt-5 text-[18px] font-semibold leading-snug tracking-[-0.02em]">{title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{body}</p>
            </m.div>
          ))}
        </RevealGroup>
        <Reveal>
          <Conflict />
        </Reveal>
      </div>

      <Reveal className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="max-w-xl text-[15px] text-muted">All-day tasks stay on their day in any time zone, so a trip never moves your plan. No ads, no tracking.</p>
        <Link href={links.privacy} className="inline-flex items-center gap-1.5 rounded-full text-[15px] font-medium text-accent-text hover:underline">
          Read the privacy page <ArrowRight size={16} />
        </Link>
      </Reveal>
    </section>
  );
}
