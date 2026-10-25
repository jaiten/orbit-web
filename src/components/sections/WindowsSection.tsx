"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { DesktopApp, type PageId } from "@/components/devices/DesktopApp";
import { useDesktopApp } from "@/components/devices/use-desktop-app";
import { WindowFrame } from "@/components/devices/WindowFrame";
import { Keycap } from "@/components/ui/Keycap";
import { Reveal } from "@/components/ui/Reveal";
import { screenshots } from "@/lib/media";

const PAGE_IDS: PageId[] = ["today", "calendar", "lists", "habits", "settings"];
const PAGE_LABEL: Record<PageId, string> = { today: "Today", calendar: "Calendar", lists: "Lists", habits: "Habits", settings: "Settings" };
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const norm = (k: string) => (k === "Control" ? "ctrl" : k === " " ? "space" : k.toLowerCase());

export function WindowsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  // Ctrl+F is only taken while the pointer or focus is on the demo, so find-in-page still works elsewhere.
  const armed = useRef(false);
  const [canLock, setCanLock] = useState(false);
  const [locked, setLocked] = useState(false);
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const run = useRef(0);

  // Typing by the visitor cancels any demo auto-typing.
  const app = useDesktopApp(() => void run.current++);
  const appRef = useRef(app);
  appRef.current = app;

  const status = app.shortcuts
    ? "Keyboard shortcuts"
    : app.quickAdd !== null
      ? `Smart add: “${app.quickAdd}”`
      : app.search
        ? `Search: “${app.search}”`
        : `Page: ${PAGE_LABEL[app.page]}`;

  const typeInto = useCallback(async (text: string, set: (v: string) => void, id: number, pace: number) => {
    for (let i = 1; i <= text.length; i++) {
      if (run.current !== id) return false;
      set(text.slice(0, i));
      await wait(pace);
    }
    return run.current === id;
  }, []);

  const doSmartAdd = useCallback(async () => {
    const a = appRef.current;
    const id = ++run.current;
    a.setSearch(null);
    a.setShortcuts(false);
    a.setQuickAdd("");
    const text = "gym tomorrow 6pm";
    if (await typeInto(text, (v) => appRef.current.setQuickAdd(v), id, 100)) {
      await wait(1500);
      if (run.current === id) appRef.current.submitQuickAdd(text);
    }
  }, [typeInto]);
  const doSearch = useCallback(async () => {
    const a = appRef.current;
    const id = ++run.current;
    a.setQuickAdd(null);
    a.setShortcuts(false);
    a.setSearch("");
    if (await typeInto("walk", (v) => appRef.current.setSearch(v), id, 320)) {
      await wait(4000);
      if (run.current === id) appRef.current.setSearch(null);
    }
  }, [typeInto]);
  const goTo = useCallback((i: number) => {
    const a = appRef.current;
    run.current++;
    a.setQuickAdd(null);
    a.setSearch(null);
    a.setShortcuts(false);
    a.setPage(PAGE_IDS[i]);
  }, []);
  const toggleShortcuts = useCallback(() => {
    const a = appRef.current;
    run.current++;
    a.setQuickAdd(null);
    a.setSearch(null);
    a.setShortcuts(!a.shortcuts);
  }, []);
  const closeOverlays = useCallback(() => {
    const a = appRef.current;
    run.current++;
    a.setQuickAdd(null);
    a.setShortcuts(false);
  }, []);

  // Real key presses: individual keys light up as they go down, and a full combo drives the window.
  useEffect(() => {
    if (!inView) return;
    const down = (e: KeyboardEvent) => {
      const k = norm(e.key);
      setPressed((p) => new Set(p).add(k));
      if (k === "escape") return closeOverlays();
      if (!(e.ctrlKey || e.metaKey) || e.altKey) {
        // Alt+N: a stand-in for Ctrl+N, which browsers never hand to a page.
        if (e.altKey && !e.ctrlKey && !e.metaKey && k === "n") {
          void doSmartAdd();
          e.preventDefault();
        }
        return;
      }
      let handled = true;
      if (e.shiftKey && k === " ") void doSmartAdd();
      else if (k === "n") void doSmartAdd();
      else if (/^[1-5]$/.test(k)) goTo(Number(k) - 1);
      else if (k === "f") void doSearch();
      else if (k === "/") toggleShortcuts();
      else handled = false;
      // Keeps the browser from acting on the same keys (find, tab switching). Ctrl+N is reserved by browsers.
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
  }, [inView, doSmartAdd, goTo, doSearch, toggleShortcuts, closeOverlays]);

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
  const pageNum = PAGE_IDS.indexOf(app.page) + 1;

  const groups = [
    { name: "Smart add", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={on("n")}>N</Keycap></>, act: () => flash(["ctrl", "n"], () => void doSmartAdd()) },
    { name: "Pages 1 to 5", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={numPressed}>1–5</Keycap></>, act: () => flash(["ctrl", "2"], () => goTo(pageNum % 5)) },
    { name: "Search", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={on("f")}>F</Keycap></>, act: () => flash(["ctrl", "f"], () => void doSearch()) },
    { name: "All shortcuts", keys: <><Keycap pressed={on("ctrl")} wide>Ctrl</Keycap><Keycap pressed={on("/")}>/</Keycap></>, act: () => flash(["ctrl", "/"], toggleShortcuts) },
  ];

  return (
    <section id="windows" aria-labelledby="windows-title" className="scroll-mt-20 bg-surface/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Windows</p>
          <h2 id="windows-title" className="section-title mt-3">Keyboard first</h2>
          <p className="lead mt-5">Orbit for Windows is built for the keys under your hands. Add from anywhere, jump between pages and search without reaching for the mouse. The window below works, so click around</p>
        </Reveal>

        <div
          ref={stage}
          className="[&:fullscreen]:flex [&:fullscreen]:flex-col [&:fullscreen]:justify-center [&:fullscreen]:overflow-auto [&:fullscreen]:bg-canvas [&:fullscreen]:px-8"
          onPointerEnter={() => (armed.current = true)}
          onPointerLeave={() => (armed.current = locked)}
          onFocus={() => (armed.current = true)}
          onBlur={() => (armed.current = locked)}
        >
          <Reveal className="mx-auto mt-14 w-full max-w-[1100px]">
            <div ref={ref}>
              <WindowFrame interactive label="Orbit on Windows. A working copy of the app: tick tasks, switch pages, search and use smart add." slot={screenshots.windowsToday}>
                <DesktopApp api={app} />
              </WindowFrame>
            </div>
          </Reveal>

          <div className="mx-auto mt-10 max-w-[1100px] rounded-[18px] bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">Try the keys</h3>
              <p className="text-[14px] text-muted">
                {locked ? "Keys captured. Press Esc to leave" : "Press the keys while this section is on screen, or click a pair"}
                {canLock && !locked && (
                  <>
                    {" · "}
                    <button type="button" onClick={captureKeys} className="rounded font-medium text-accent-text underline underline-offset-2">capture keys</button>
                  </>
                )}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-[12px] bg-canvas px-4 py-3 text-[14px] ring-1 ring-line" aria-live="polite">
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
              <span className="text-muted">Window</span>
              <span className="min-w-0 truncate font-medium">{status}</span>
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
              Also <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Space</kbd> or <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Enter</kbd> to tick the focused item, <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Esc</kbd> to close a dialog, and a global smart add on <kbd className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px] ring-1 ring-line">Ctrl+Shift+Space</kbd> from any app
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
