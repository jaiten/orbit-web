"use client";
import { HabitGrid } from "@/components/bklit/HabitGrid";
import { MiniBars } from "@/components/bklit/MiniBars";
import { WeekBar } from "@/components/bklit/WeekBar";
import { Reveal } from "@/components/ui/Reveal";
import { VideoSlot } from "@/components/ui/VideoSlot";
import { videos } from "@/lib/media";
import { doneInLastSeven, habits, isDone, lastSeven, weeklyTotals } from "@/lib/sample-data";

const featured = habits[1]; // Read a few pages: 5 of the last 7 days
const ruleLabel: Record<string, string> = { water: "Daily · 6 glasses", read: "Daily", move: "Weekdays", plan: "Daily" };

export function HabitsSection() {
  const week = lastSeven(featured).map((a) => isDone(featured, a));
  return (
    <section id="habits" aria-labelledby="habits-title" className="bg-surface/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Habits</p>
            <h2 id="habits-title" className="section-title mt-3">Habits without guilt.</h2>
            <p className="lead mt-5 max-w-md">Habits are the only thing in Orbit that repeats. Daily, weekdays, weekends or weekly, with targets like “6 glasses a day”. They reset at midnight.</p>
          </Reveal>

          <Reveal className="mt-10 rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
            <div className="text-[13px] font-medium text-muted">{featured.title}</div>
            <div className="display mt-1 text-[clamp(34px,4.6vw,48px)]">
              {doneInLastSeven(featured)} of the last 7 days
            </div>
            <WeekBar done={week} color="var(--lavender)" size="lg" showLabels className="mt-5" />
            <p className="mt-5 text-[17px] font-medium">Miss a day? Nothing breaks.</p>
            <p className="mt-1 text-[15px] text-muted">No streaks to lose, no scores to chase. Orbit shows what you did and leaves it there.</p>
          </Reveal>

          <Reveal className="mt-4 rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
            <div className="mb-3 text-[13px] font-medium text-muted">Days done each week · {featured.title}</div>
            <MiniBars values={weeklyTotals(featured)} color="var(--lavender)" label={`Days done in each of the last 12 weeks for ${featured.title}`} />
          </Reveal>

          <div className="mt-8 hidden lg:block">
            <VideoSlot slot={videos.dragToHabits} maxWidth={200} />
          </div>
        </div>

        <Reveal>
          <div className="rounded-[18px] bg-surface p-5 shadow-card ring-1 ring-line sm:p-7">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">History</h3>
              <span className="text-[13px] text-muted">Last 7 days · last 12 weeks</span>
            </div>
            <ul className="mt-6 divide-y divide-line">
              {habits.map((h) => {
                const w = lastSeven(h).map((a) => isDone(h, a));
                const color = `var(--${h.color})`;
                return (
                  <li key={h.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="flex items-center gap-2.5 text-[16px] font-medium">
                        <span aria-hidden className="size-2.5 rounded-full" style={{ background: color }} />
                        {h.title}
                      </span>
                      <span className="text-[13px] text-muted">{ruleLabel[h.id]} · {doneInLastSeven(h)} of the last 7 days</span>
                    </div>
                    <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto]">
                      <WeekBar done={w} color={color} size="md" showLabels />
                      <HabitGrid className="w-[208px] max-w-full" label={h.title} color={color} levels={h.days.map((a) => Math.min(1, a / h.target))} animateIn />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
        <div className="lg:hidden">
          <VideoSlot slot={videos.dragToHabits} maxWidth={220} />
        </div>
      </div>
    </section>
  );
}
