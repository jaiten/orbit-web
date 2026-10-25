"use client";
import { useCallback, useState } from "react";
import { chipParts, parse } from "@/lib/quick-add";
import type { HabitColor } from "@/lib/sample-data";
import type { PageId } from "./DesktopApp";

export interface DeskTask {
  id: string;
  title: string;
  when?: string;
  done: boolean;
  /** agenda and pace show on Today; personal on Lists; someday on the Someday list. */
  list: "agenda" | "pace" | "personal" | "someday";
}
export interface DeskHabit {
  id: string;
  title: string;
  color: HabitColor;
  target: number;
  count: number;
  weekly?: boolean;
}

/** The moment the screens are drawn at, so "tomorrow" and "6pm" mean the same thing for every visitor. */
const NOW = new Date(2026, 9, 20, 9, 0);

const START_TASKS: DeskTask[] = [
  { id: "walk", title: "Morning walk", when: "8:00 AM · 30 min", done: false, list: "agenda" },
  { id: "focus", title: "Focus on one thing", when: "10:00 AM · 90 min", done: false, list: "agenda" },
  { id: "dinner", title: "Make something nourishing", when: "6:00 PM", done: false, list: "agenda" },
  { id: "call", title: "Call someone you miss", done: false, list: "pace" },
  { id: "dentist", title: "Book the dentist", done: false, list: "personal" },
  { id: "shoes", title: "Order new running shoes", done: false, list: "personal" },
  { id: "trip", title: "Plan a weekend away", done: false, list: "someday" },
];
const START_HABITS: DeskHabit[] = [
  { id: "water", title: "Drink water", color: "sage", target: 6, count: 4 },
  { id: "read", title: "Read a few pages", color: "lavender", target: 1, count: 0 },
  { id: "move", title: "Move your body", color: "clay", target: 3, count: 2, weekly: true },
];

export interface DesktopApi {
  tasks: DeskTask[];
  habits: DeskHabit[];
  toggle: (id: string) => void;
  bump: (id: string) => void;
  page: PageId;
  setPage: (p: PageId) => void;
  /** Smart add dialog text; null means closed. */
  quickAdd: string | null;
  setQuickAdd: (v: string | null) => void;
  /** Adds what is in the dialog, or `text` when given. */
  submitQuickAdd: (text?: string) => void;
  search: string | null;
  setSearch: (v: string | null) => void;
  shortcuts: boolean;
  setShortcuts: (v: boolean) => void;
  day: number;
  setDay: (d: number) => void;
  /** Called when the visitor types, so demo auto-typing can stand down. */
  onUserInput?: () => void;
}

/** All the state of the interactive Windows window. */
export function useDesktopApp(onUserInput?: () => void): DesktopApi {
  const [tasks, setTasks] = useState(START_TASKS);
  const [habits, setHabits] = useState(START_HABITS);
  const [page, setPage] = useState<PageId>("today");
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [shortcuts, setShortcuts] = useState(false);
  const [day, setDay] = useState(20);

  const toggle = useCallback((id: string) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x))), []);
  const bump = useCallback((id: string) => setHabits((h) => h.map((x) => (x.id === id ? { ...x, count: x.count >= x.target ? 0 : x.count + 1 } : x))), []);

  const submitQuickAdd = useCallback((override?: string) => {
    const text = (override ?? quickAdd)?.trim();
    if (!text) return;
    const r = parse(text, null, NOW);
    if (!r.title) return;
    const title = r.title.charAt(0).toUpperCase() + r.title.slice(1);
    const id = "new-" + Date.now();
    if (r.kind === "habit") {
      setHabits((h) => [...h, { id, title, color: "honey", target: 1, count: 0 }]);
      setPage("habits");
    } else if (r.someday) {
      setTasks((t) => [...t, { id, title, done: false, list: "someday" }]);
      setPage("lists");
    } else {
      setTasks((t) => [...t, { id, title, when: chipParts(r, NOW).slice(1).join(" · "), done: false, list: "agenda" }]);
      setPage("today");
    }
    setQuickAdd(null);
  }, [quickAdd]);

  return { tasks, habits, toggle, bump, page, setPage, quickAdd, setQuickAdd, submitQuickAdd, search, setSearch, shortcuts, setShortcuts, day, setDay, onUserInput };
}

export const STATIC_TASKS = START_TASKS;
export const STATIC_HABITS = START_HABITS;
export const SMART_ADD_NOW = NOW;
