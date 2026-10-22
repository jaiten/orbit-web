/** Realistic sample data for the Today screens and the progress visuals. Fixed so server and client render the same. */

export type HabitColor = "sage" | "lavender" | "clay" | "honey";

export interface SampleHabit {
  id: string;
  title: string;
  color: HabitColor;
  /** Done per day to count the day, e.g. 6 glasses. */
  target: number;
  unit?: string;
  /** Amount done on each of the last 84 days (12 weeks), oldest first. Ends today. */
  days: number[];
}

/** Small seeded generator so the grids look organic but never change between renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function build(seed: number, target: number, rate: number, last7: number[]): number[] {
  const r = seeded(seed);
  const days: number[] = [];
  for (let i = 0; i < 77; i++) {
    const weekday = i % 7;
    const chance = rate + (weekday >= 5 ? -0.12 : 0.04) + (i / 77) * 0.12;
    if (r() > chance) days.push(0);
    else days.push(target === 1 ? 1 : Math.max(1, Math.min(target, Math.round(target * (0.5 + r() * 0.6)))));
  }
  return [...days, ...last7.map((v) => (v ? (target === 1 ? 1 : v) : 0))];
}

export const habits: SampleHabit[] = [
  { id: "water", title: "Drink water", color: "sage", target: 6, unit: "glasses", days: build(11, 6, 0.62, [6, 6, 0, 5, 6, 0, 6]) },
  { id: "read", title: "Read a few pages", color: "lavender", target: 1, days: build(23, 1, 0.55, [1, 0, 1, 1, 0, 1, 1]) },
  { id: "move", title: "Move your body", color: "clay", target: 1, days: build(37, 1, 0.38, [0, 1, 0, 1, 0, 0, 1]) },
  { id: "plan", title: "Plan tomorrow", color: "honey", target: 1, days: build(41, 1, 0.5, [1, 1, 1, 0, 0, 1, 1]) },
];

/** A day counts when the target is reached. */
export const isDone = (h: SampleHabit, amount: number) => amount >= h.target;
export const lastSeven = (h: SampleHabit) => h.days.slice(-7);
export const doneInLastSeven = (h: SampleHabit) => lastSeven(h).filter((a) => isDone(h, a)).length;

/** Days done in each of the last 12 weeks, oldest first. */
export const weeklyTotals = (h: SampleHabit) =>
  Array.from({ length: 12 }, (_, w) => h.days.slice(w * 7, w * 7 + 7).filter((a) => isDone(h, a)).length);

export interface SampleTask {
  id: string;
  title: string;
  time?: string;
  done?: boolean;
}

export const todayTasks: SampleTask[] = [
  { id: "walk", title: "Morning walk", time: "8:00 AM" },
  { id: "focus", title: "Focus on one thing", time: "10:00 AM" },
  { id: "call", title: "Call someone you miss" },
];

export const overdueTask: SampleTask = { id: "pay", title: "Send the invoice" };

export const weekdayLetters = ["M", "T", "W", "T", "F", "S", "S"];

/** Hover text for each of the 84 days: "Mon 12 Oct · 6 of 6 glasses". The last day is the screens' "today" (20 Oct). */
export function habitTips(h: SampleHabit): string[] {
  return h.days.map((amount, i) => {
    const d = new Date(2026, 9, 20 - (h.days.length - 1 - i));
    const day = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
    if (h.target > 1) return `${day} · ${amount} of ${h.target}${h.unit ? " " + h.unit : ""}`;
    return `${day} · ${amount ? "Done" : "Not done"}`;
  });
}
