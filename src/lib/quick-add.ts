/**
 * Quick add: one line of text becomes a task or a habit.
 * A TypeScript port of Orbit's shared parser (windows/ui/planning.js), so the
 * demo on this page understands the same phrases as the apps.
 */
export type Schedule = "DAILY" | "WEEKDAYS" | "WEEKENDS" | "WEEKLY";

export interface QuickAddResult {
  kind: "task" | "habit";
  title: string;
  /** Local "YYYY-MM-DD", null for habits, Someday and undated tasks. */
  date: string | null;
  /** Minutes after midnight. */
  time: number | null;
  schedule: Schedule | null;
  someday: boolean;
  list: string | null;
}

const WEEKDAYS: Record<string, number> = { sun: 0, mon: 1, tue: 2, tues: 2, wed: 3, weds: 3, thu: 4, thur: 4, thurs: 4, fri: 5, sat: 6 };
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DAY = "(sun|mon|tues?|wed(?:nes)?|weds|thu(?:rs?)?|thurs|fri|sat(?:ur)?)(?:day)?";
const MONTH = "(jan|feb|mar|apr|may|jun|jul|aug|sept?|oct|nov|dec)[a-z]*\\.?";
const NUMBERS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const weekdayOf = (word: string) => WEEKDAYS[word.toLowerCase().replace(/day$/, "").slice(0, 3)];
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
function addMonths(d: Date, n: number) {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
}
/** Nearest coming weekday; skipToday moves past today ("next fri"). */
function nextWeekday(from: Date, weekday: number, skipToday: boolean) {
  let offset = (weekday - from.getDay() + 7) % 7;
  if (offset === 0 && skipToday) offset = 7;
  return addDays(from, offset);
}

export function parse(input: string, defaultDate: string | null = null, now = new Date()): QuickAddResult {
  let text = " " + input.trim() + " ";
  const take = (pattern: RegExp) => {
    const match = text.match(pattern);
    if (match) text = text.replace(match[0], " ");
    return match;
  };
  const someday = !!take(/\ssomeday(?=\s)/i);
  const list = take(/\s#([\p{L}\p{N}_-]+)(?=\s)/u)?.[1] ?? null;

  let schedule: Schedule | null = null;
  const repeats: [RegExp, Schedule][] = [
    [/\s(?:every\s*day|daily)(?=\s)/i, "DAILY"],
    [/\s(?:every\s+weekday|weekdays)(?=\s)/i, "WEEKDAYS"],
    [/\s(?:every\s+weekend|weekends)(?=\s)/i, "WEEKENDS"],
    [/\s(?:every\s+week|weekly)(?=\s)/i, "WEEKLY"],
    [new RegExp(`\\severy\\s+${DAY}(?=\\s)`, "i"), "WEEKLY"],
  ];
  for (const [pattern, value] of repeats) if (!schedule && take(pattern)) schedule = value;

  let time: number | null = null;
  const clock12 = take(/\s(?:at\s+)?(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)(?=\s)/i);
  if (clock12) time = ((Number(clock12[1]) % 12) + (clock12[3].toLowerCase() === "pm" ? 12 : 0)) * 60 + Number(clock12[2] || 0);
  const clock24 = time === null && take(/\s(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)(?=\s)/);
  if (clock24) time = Number(clock24[1]) * 60 + Number(clock24[2]);
  if (time === null && take(/\s(?:at\s+)?noon(?=\s)/i)) time = 720;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let date: Date | null = null;
  if (!schedule) {
    let match: RegExpMatchArray | null;
    if ((match = take(/\s(?:on\s+)?(today|tonight)(?=\s)/i))) date = today;
    else if ((match = take(/\s(?:on\s+)?(tomorrow|tmrw|tmr)(?=\s)/i))) date = addDays(today, 1);
    else if ((match = take(/\sin\s+(\d+|an?|one|two|three|four|five|six)\s+(day|week|month)s?(?=\s)/i))) {
      const n = NUMBERS[match[1].toLowerCase()] ?? Number(match[1]);
      const unit = match[2].toLowerCase();
      date = unit === "month" ? addMonths(today, n) : addDays(today, unit === "week" ? n * 7 : n);
    } else if ((match = take(/\snext\s+week(?=\s)/i))) date = nextWeekday(today, 1, true);
    else if ((match = take(new RegExp(`\\s(?:on\\s+)?(next\\s+|this\\s+)?${DAY}(?=\\s)`, "i"))))
      date = nextWeekday(today, weekdayOf(match[2]), /next/i.test(match[1] || ""));
    else if (
      (match =
        take(new RegExp(`\\s(?:on\\s+)?${MONTH}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?=\\s)`, "i")) ||
        take(new RegExp(`\\s(?:on\\s+)?(\\d{1,2})(?:st|nd|rd|th)?\\s+${MONTH}(?=\\s)`, "i")))
    ) {
      const [monthWord, dayNumber] = /^\d/.test(match[1]) ? [match[2], match[1]] : [match[1], match[2]];
      const month = MONTHS.indexOf(monthWord.toLowerCase().slice(0, 3));
      date = new Date(today.getFullYear(), month, Number(dayNumber));
      if (date < today) date = new Date(today.getFullYear() + 1, month, Number(dayNumber));
    }
  }

  const title = text.replace(/\s+/g, " ").trim().replace(/\s(?:on|at|by)$/i, "");
  if (schedule) return { kind: "habit", title, schedule, time, date: null, someday: false, list };
  if (someday) return { kind: "task", title, date: null, time: null, schedule: null, someday, list };
  if (!date) {
    // Adding to a list: without date words the task stays in the list, undated.
    if (defaultDate === "undated" && time === null) return { kind: "task", title, date: null, time, schedule: null, someday, list };
    if (defaultDate === "undated") defaultDate = null;
    date = defaultDate ? new Date(defaultDate + "T12:00:00") : today;
    // A bare time that has already passed today means tomorrow.
    if (!defaultDate && time !== null && time < now.getHours() * 60 + now.getMinutes()) date = addDays(today, 1);
  }
  return { kind: "task", title, date: key(date), time, schedule: null, someday, list };
}

const SCHEDULE_LABEL: Record<Schedule, string> = { DAILY: "Daily", WEEKDAYS: "Weekdays", WEEKENDS: "Weekends", WEEKLY: "Weekly" };

/** The chip's pieces, e.g. ["Task", "Tomorrow", "6:00 PM"]. Empty until there is a title. */
export function chipParts(result: QuickAddResult, now = new Date()): string[] {
  if (!result.title) return [];
  const clock =
    result.time === null
      ? ""
      : new Date(2000, 0, 1, Math.floor(result.time / 60), result.time % 60)
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          .replace(/ /g, " ");
  const tag = result.list ? "#" + result.list : "";
  if (result.kind === "habit") return ["Habit", SCHEDULE_LABEL[result.schedule!], clock].filter(Boolean);
  if (result.someday) return ["Someday", tag].filter(Boolean);
  if (!result.date) return ["Task", "No date", tag].filter(Boolean);
  const today = key(now);
  const tomorrow = key(addDays(now, 1));
  const day =
    result.date === today
      ? "Today"
      : result.date === tomorrow
        ? "Tomorrow"
        : new Date(result.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return ["Task", day, clock, tag].filter(Boolean);
}
