"use client";

import { useEffect, useState } from "react";
import { OrbitMark } from "@/components/brand/OrbitMark";

/** What the app reports in the address: ?service=google|microsoft&status=ok|calendar|cancelled|error */
type Status = "ok" | "calendar" | "cancelled" | "error";
const names: Record<string, string> = {
  google: "Google Calendar",
  microsoft: "Outlook",
};

function copy(status: Status, name: string) {
  switch (status) {
    case "ok":
      return {
        title: `${name} is connected`,
        body: "Your calendars are now in Orbit.",
        hint: "Choose which calendars show in Orbit under Settings → Calendar.",
      };
    case "calendar":
      return {
        title: "Orbit needs calendar access",
        body: `${name} didn't share your calendars with Orbit, so nothing was connected.`,
        hint: "In Orbit, open Settings → Calendar and connect again. On the permissions screen, tick the box that lets Orbit see and edit your calendars.",
      };
    case "cancelled":
      return {
        title: "Sign-in was cancelled",
        body: "Nothing was connected.",
        hint: "You can try again any time from Settings → Calendar in Orbit.",
      };
    default:
      return {
        title: "Couldn't connect",
        body: `Something went wrong while connecting ${name}.`,
        hint: "Switch back to Orbit and try again from Settings → Calendar.",
      };
  }
}

export function ConnectedStatus() {
  const [state, setState] = useState<{ status: Status; name: string } | null>(
    null,
  );
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const status = query.get("status");
    setState({
      status:
        status === "ok" || status === "calendar" || status === "cancelled"
          ? status
          : "error",
      name: names[query.get("service") ?? ""] ?? "your calendar",
    });
  }, []);
  if (!state) return <div className="h-[340px]" aria-hidden />;
  const ok = state.status === "ok";
  const text = copy(state.status, state.name);
  return (
    <section
      className="w-full max-w-[440px] rounded-[var(--radius-card)] bg-surface px-8 pb-9 pt-10 text-center"
      style={{ boxShadow: "var(--shadow-lift)" }}
      aria-live="polite"
    >
      <div className="relative mx-auto mb-7 grid size-20 place-items-center">
        <OrbitMark className="size-20" />
        <span
          className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full ring-4 ring-[var(--surface)]"
          style={{ background: ok ? "var(--sage)" : "var(--muted)" }}
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ok ? (
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            ) : (
              <path d="M12 7v6m0 4h.01" />
            )}
          </svg>
        </span>
      </div>
      <h1 className="display text-[30px] leading-tight">{text.title}</h1>
      <p className="mt-3 text-[17px] text-ink">{text.body}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{text.hint}</p>
      {/* Orbit for Windows handles orbit:// links; the browser asks once before opening the app. */}
      <a
        href="orbit://open"
        className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-btn px-6 text-[15px] font-medium text-on-btn transition hover:brightness-110"
      >
        Open Orbit
      </a>
      <p className="mt-3 text-[13px] text-muted">You can close this tab.</p>
    </section>
  );
}
