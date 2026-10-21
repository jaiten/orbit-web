"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { Bell, Download } from "lucide-react";
import { DesktopApp, type PageId } from "@/components/devices/DesktopApp";
import { WindowFrame } from "@/components/devices/WindowFrame";
import { OrbitMark } from "@/components/brand/OrbitMark";
import { Keycap } from "@/components/ui/Keycap";
import { Reveal, RevealGroup, reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { links } from "@/lib/links";
import { screenshots } from "@/lib/media";

const PAGES_LABEL: Record<PageId, string> = { today: "Today", calendar: "Calendar", lists: "Lists", habits: "Habits", settings: "Settings" };
const PAGE_IDS: PageId[] = ["today", "calendar", "lists", "habits", "settings"];
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const norm = (k: string) => (k === "Control" ? "ctrl" : k === " " ? "space" : k.toLowerCase());

export function WindowsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  // The demo owns the shortcuts only while the visitor's pointer or focus is on it, so find-in-page keeps working everywhere else.
  const armed = useRef(false);
  const [canLock, setCanLock] = useState(false);
  const [locked, setLocked] = useState(false);
  const [page, setPage] = useState<PageId>("today");
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState(0);
  const run = useRef(0);
  // What the window is doing right now, shown beside the keys so it is visible even when the window is scrolled out of view.
  const status = quickAdd !== null ? `Quick add: “${quickAdd}”` : search !== null ? `Search: “${search}”` : `Page: ${PAGES_LABEL[page]}`;

  const typeInto = useCallback(async (text: string, set: (v: string | null) => void, hold: number, id: number, pace = 80) => {
    for (let i = 1; i <= text.length; i++) {
      if (run.current !== id) return;
      set(text.slice(0, i));
      await wait(pace);
    }
    await wait(hold);
    if (run.current === id) set(null);
  }, []);

  const doQuickAdd = useCallback(() => {
    const id = ++run.current;
    setSearch(null);
    setQuickAdd("");
    void typeInto("gym tomorrow 6pm", setQuickAdd, 3000, id, 100);
  }, [typeInto]);
  const doSearch = useCallback(() => {
    const id = ++run.current;
    setQuickAdd(null);
    setPage("lists");
    setSearch("");
    void typeInto("walk", setSearch, 4000, id, 320);
  }, [typeInto]);
  const goTo = useCallback((i: number) => {
    run.current++;
    setQuickAdd(null);
    setSearch(null);
    setPage(PAGE_IDS[i]);
  }, []);

  // Real key presses: individual keys light up as they go down, and a full combo drives the window.
  useEffect(() => {
    if (!inView) return;
    const down = (e: KeyboardEvent) => {
      const k = norm(e.key);
      setPressed((p) => new Set(p).add(k));
      if (!(e.ctrlKey || e.metaKey) || e.altKey) {
        // Alt+N: a stand-in for Ctrl+N, which browsers never hand to a page.
        if (e.altKey && !e.ctrlKey && !e.metaKey && k === "n") {
          doQuickAdd();
          e.preventDefault();
        }
        return;
      }
      let handled = true;
      if (e.shiftKey && k === " ") doQuickAdd();
      else if (k === "n") doQuickAdd();
      else if (/^[1-5]$/.test(k)) goTo(Number(k) - 1);
      else if (k === "f") doSearch();
      else if (k === "/") setPulse((n) => n + 1);
      else handled = false;
      // Keep the browser from acting on the same keys (find, tab switching). Ctrl+F is only taken while the
      // pointer or focus is on the demo, so find-in-page still works elsewhere. Ctrl+N is reserved by browsers.
      if (handled && (armed.current || k !== "f")) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      const k = norm(e.key);
      setPressed((p) => {
        const n = new Set(p);
        n.delete(k);
        // Releasing a modifier mid-combo can swallow the other key's keyup, so clear dependants.
        if (k === "ctrl" || k === "meta") n.clear();
        return n;
      });
    };
    const clear = () => setPressed(new Set());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [inView, doQuickAdd, goTo, doSearch]);

  useEffect(() => {
    // Some browsers (Brave with shields up, older Safari) hide or stub these APIs, so check defensively.
    try {
      const kb = (navigator as Navigator & { keyboard?: { lock?: unknown } }).keyboard;
      setCanLock(typeof document.documentElement.requestFullscreen === "function" && typeof kb?.lock === "function");
    } catch {
      setCanLock(false);
    }
    const onFs = () => {
      const on = document.fullscreenElement === stage.current;
      setLocked(on);
      armed.current = on || armed.current;
      if (!on) (navigator as Navigator & { keyboard?: { unlock?: () => void } }).keyboard?.unlock?.();
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Fullscreen plus the Keyboard Lock API (Chrome, Edge) hands Ctrl+N and friends to the page. Esc leaves.
  const captureKeys = async () => {
    try {
      await stage.current?.requestFullscreen();
      await (navigator as Navigator & { keyboard?: { lock?: () => Promise<void> } }).keyboard?.lock?.();
    } catch {}
  };

  // Clicking a keycap group plays the same action, for touch and for keys the browser keeps for itself.
  const flash = async (keys: string[], action: () => void) => {
    setPressed(new Set(keys));
    action();
    await wait(260);
    setPressed(new Set());
  };
  const on = (k: string) => pressed.has(k) || (k === "ctrl" && pressed.has("meta"));
  const numPressed = ["1", "2", "3", "4", "5"].some((n) => pressed.has(n));
  const pageNum = PAGE_IDS.indexOf(page) + 1;

  const groups = [
    { name: "Quick add", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={on("n")}>N</Keycap></>, act: () => flash(["ctrl", "n"], doQuickAdd) },
    { name: "Pages 1 to 5", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={numPressed}>1–5</Keycap></>, act: () => flash(["ctrl", "2"], () => goTo(((pageNum) % 5))) },
    { name: "Search", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={on("f")}>F</Keycap></>, act: () => flash(["ctrl", "f"], doSearch) },
    { name: "All shortcuts", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={on("/")}>/</Keycap></>, act: () => flash(["ctrl", "/"], () => setPulse((n) => n + 1)) },
  ];

  return (
    <section id="windows" aria-labelledby="windows-title" className="scroll-mt-20 bg-surface/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Windows</p>
          <h2 id="windows-title" className="section-title mt-3">Keyboard first.</h2>
          <p className="lead mt-5">Orbit for Windows is built for the keys under your hands. Add from anywhere, jump between pages, and search without reaching for the mouse.</p>
        </Reveal>

        <div
          ref={stage}
          className="[&:fullscreen]:flex [&:fullscreen]:flex-col [&:fullscreen]:justify-center [&:fullscreen]:overflow-auto [&:fullscreen]:bg-canvas [&:fullscreen]:px-8"
          onPointerEnter={() => (armed.current = true)}
          onPointerLeave={() => (armed.current = locked)}
          onFocus={() => (armed.current = true)}
          onBlur={() => (armed.current = locked)}
        >
        <Reveal className="mx-auto mt-14 max-w-[1100px] w-full">
          <div ref={ref}>
            <WindowFrame label="Orbit on Windows. The window responds as you press the shortcuts below." slot={screenshots.windowsToday}>
              <DesktopApp page={page} quickAdd={quickAdd} search={search} />
            </WindowFrame>
          </div>
        </Reveal>

        <m.div animate={{ scale: pulse ? [1, 1.015, 1] : 1 }} key={pulse} transition={{ duration: 0.4 }} className="mx-auto mt-10 max-w-[1100px] rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Try the keys</h3>
            <p className="text-[14px] text-muted">
              {locked ? "Keys captured. Press Esc to leave." : "Press the keys while this section is on screen, or click a pair."}{" "}
              {!locked && (
                <>
                  Browsers keep Ctrl+N for themselves, so <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Alt+N</kbd> works here too
                  {canLock && (
                    <>
                      , or <button type="button" onClick={captureKeys} className="rounded font-medium text-accent-text underline underline-offset-2">capture keys</button> for the real thing
                    </>
                  )}
                  .
                </>
              )}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-[12px] bg-canvas px-4 py-3 text-[14px] ring-1 ring-line" aria-live="polite">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
            <span className="text-muted">Window</span>
            <span className="min-w-0 truncate font-medium">{status}</span>
            {search !== null && <i aria-hidden className="caret -ml-2 inline-block h-4 w-px bg-ink" />}
          </div>
          <div className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((g) => (
              <div key={g.name} role="group" aria-label={g.name}>
                {/* Clicking either keycap in the pair plays the action */}
                <div className="flex gap-2" onClickCapture={g.act}>{g.keys}</div>
                <div className="mt-3 text-[14px] text-muted">{g.name}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-line pt-5 text-[14px] text-muted">
            Also <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Space</kbd> or <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Enter</kbd> to complete the focused item, <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">E</kbd> to edit it, and a global quick add on <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Ctrl+Shift+Space</kbd> from any app.
          </p>
        </m.div>
        </div>

        <RevealGroup className="mx-auto mt-6 grid max-w-[1100px] gap-6 md:grid-cols-3">
          <m.div variants={reveal} className="rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
            <div className="flex h-14 items-center justify-end gap-3 rounded-[12px] bg-canvas px-4 ring-1 ring-line" aria-hidden>
              <span className="size-3 rounded-full bg-muted/40" />
              <span className="size-3 rounded-full bg-muted/40" />
              <span className="grid size-7 place-items-center rounded-[6px] bg-surface ring-1 ring-line"><OrbitMark className="size-4" /></span>
              <span className="text-[12px] text-muted">9:41</span>
            </div>
            <h3 className="mt-5 text-[17px] font-semibold">Lives in the tray</h3>
            <p className="mt-1 text-[15px] text-muted">Close the window and Orbit stays one click away in the system tray.</p>
          </m.div>
          <m.div variants={reveal} className="rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
            <div className="flex items-center gap-3 rounded-[12px] bg-canvas p-3 ring-1 ring-line" aria-hidden>
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-surface ring-1 ring-line"><OrbitMark className="size-5" /></span>
              <div className="min-w-0 text-[13px] leading-tight">
                <div className="flex items-center gap-1 text-muted"><Bell size={11} /> Orbit</div>
                <div className="mt-0.5 truncate font-medium">Focus on one thing · 10:00 AM</div>
              </div>
            </div>
            <h3 className="mt-5 text-[17px] font-semibold">Reminders as notifications</h3>
            <p className="mt-1 text-[15px] text-muted">Reminders arrive as regular Windows notifications.</p>
          </m.div>
          <m.div variants={reveal} className="rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line">
            <div className="flex h-[62px] items-center justify-center rounded-[12px] bg-canvas ring-1 ring-line" aria-hidden>
              <Download size={22} className="text-accent-text" />
            </div>
            <h3 className="mt-5 text-[17px] font-semibold">Portable. No install.</h3>
            <p className="mt-1 text-[15px] text-muted">One file you can run from a folder or a USB stick. Free.</p>
            <Button href={links.windows} size="sm" className="mt-4">Download for Windows</Button>
          </m.div>
        </RevealGroup>
      </div>
    </section>
  );
}
