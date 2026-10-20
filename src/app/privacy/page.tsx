import type { Metadata } from "next";
import { PageShell } from "@/components/ui/Prose";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Orbit keeps your data on your device unless you turn on sync. No ads, no tracking.",
  alternates: { canonical: "/privacy/" },
};

const sections = [
  { h: "Your data stays on your device", p: "Orbit saves your tasks, habits and lists on the device you are using. If you never turn on sync, nothing leaves that device." },
  { h: "Sync is your choice", p: "Sync is off until you sign in. When you do, Orbit uses your own account to keep iPhone and Windows in step. Changes are saved on the device first and sent afterwards, so Orbit keeps working offline. You can sign out at any time, and your data stays on the device." },
  { h: "No ads, no tracking", p: "Orbit has no ads and no tracking. There are no advertising identifiers, and no analytics that follow you around." },
  { h: "Your data is yours", p: "Export everything whenever you like: a JSON backup that both apps can read, and a CSV for spreadsheets. You do not need an account to export." },
  { h: "This website", p: "This site does not use cookies for tracking. The only thing it stores is your light or dark theme choice, in your own browser." },
];

export default function Privacy() {
  return (
    <PageShell title="Privacy" intro="Short version: your plan is yours. Here is the longer version, in plain words.">
      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{s.h}</h2>
            <p className="mt-2 text-[17px] text-muted">{s.p}</p>
          </section>
        ))}
        <p className="border-t border-line pt-8 text-[15px] text-muted">
          Questions? Open an issue on <a className="text-accent-text underline underline-offset-2" href={links.github}>GitHub</a> or visit <a className="text-accent-text underline underline-offset-2" href={links.support}>Support</a>.
        </p>
      </div>
    </PageShell>
  );
}
