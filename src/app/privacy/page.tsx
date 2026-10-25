import type { Metadata } from "next";
import { PageShell } from "@/components/ui/Prose";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Orbit stores, when data leaves your device, and what it never does.",
  alternates: { canonical: "/privacy/" },
};

const rows = [
  { h: "What Orbit stores", p: "Your tasks, habits and lists. They are saved on the device you use, and nothing else is collected." },
  { h: "Sync", p: "Sync is off until you sign in. When it is on, your data is sent to your own Orbit account so your devices match. Changes are saved on the device first, so Orbit works offline. If you sign out, the data stays on the device." },
  { h: "Ads and tracking", p: "There are no ads, no advertising identifiers and no analytics in the apps." },
  { h: "Your data", p: "You can export everything from Settings at any time, as a JSON backup that both apps can read or as a CSV. Exporting does not need an account." },
  { h: "This website", p: "It does not use tracking cookies. The only thing it keeps is your light or dark theme choice, in your own browser." },
];

export default function Privacy() {
  return (
    <PageShell title="Privacy" intro="What Orbit stores, when data leaves your device, and what it does not do">
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.h} className="grid gap-2 py-6 sm:grid-cols-[200px_1fr] sm:gap-8">
            <dt className="text-[16px] font-semibold tracking-[-0.01em]">{r.h}</dt>
            <dd className="text-[16px] text-muted">{r.p}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-[15px] text-muted">
        Questions? Open an issue on <a className="text-accent-text underline underline-offset-2" href={links.github}>GitHub</a> or see <a className="text-accent-text underline underline-offset-2" href={links.support}>Support</a>.
      </p>
    </PageShell>
  );
}
