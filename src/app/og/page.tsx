import type { Metadata } from "next";
import { OrbitMark } from "@/components/brand/OrbitMark";
import { PhoneFrame } from "@/components/devices/PhoneFrame";
import { TodayPhone } from "@/components/devices/TodayPhone";

// Source for the Open Graph and Twitter images. Rendered to PNG by `npm run assets`; not indexed.
export const metadata: Metadata = { title: "OG source", robots: { index: false, follow: false } };

export default function OgSource() {
  return (
    <div id="og" className="relative h-[630px] w-[1200px] overflow-hidden bg-canvas">
      <div className="absolute left-[80px] top-[96px] w-[600px]">
        <div className="flex items-center gap-4">
          <OrbitMark className="size-[72px]" />
          <span className="text-[44px] font-semibold tracking-[-0.04em]">Orbit</span>
        </div>
        <h1 className="display mt-10 text-[68px]">A little space for what matters.</h1>
        <p className="mt-6 text-[26px] leading-snug text-muted">A calm planner for iPhone and Windows.</p>
      </div>
      <div className="absolute right-[110px] top-[58px] w-[300px] rotate-[4deg]">
        <PhoneFrame label="Orbit's Today screen on iPhone">
          <TodayPhone
            tasks={[{ id: "walk", title: "Morning walk", time: "8:00 AM", done: true }, { id: "focus", title: "Focus on one thing", time: "10:00 AM" }, { id: "call", title: "Call someone you miss" }]}
            habits={[{ id: "water", title: "Drink water", color: "sage", count: "4 of 6" }]}
          />
        </PhoneFrame>
      </div>
    </div>
  );
}
