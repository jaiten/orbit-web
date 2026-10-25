import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { PageShell } from "@/components/ui/Prose";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "Support",
  description: "Answers about Orbit: sync, the Windows unknown publisher warning, exporting your data and TestFlight.",
  alternates: { canonical: "/support/" },
};

const faq = [
  {
    q: "How does sync work?",
    a: (
      <>
        <p>Create or confirm an account in <b>Settings → Account</b> on Windows, then sign in with the same account on iPhone in <b>Settings → Account</b>. Local items are imported into that account, and Orbit keeps working offline.</p>
        <p>If two devices change the same thing, Orbit shows both versions in Settings so you can choose. It never overwrites quietly.</p>
      </>
    ),
  },
  {
    q: "Windows says “unknown publisher”. Is it safe?",
    a: (
      <>
        <p>Orbit for Windows is a portable app that is not signed with a paid publisher certificate yet, so Windows SmartScreen may warn you the first time you open it.</p>
        <p>If you downloaded it from the official <a href={links.windows}>Orbit releases page</a>, choose <b>More info</b>, then <b>Run anyway</b>. The source is public on <a href={links.github}>GitHub</a> if you want to check it first.</p>
      </>
    ),
  },
  {
    q: "How do I export my data?",
    a: (
      <>
        <p>Open <b>Settings</b> in either app. Export a <b>JSON backup</b>, which both apps can read and import with a preview, or a <b>CSV</b> for spreadsheets.</p>
      </>
    ),
  },
  {
    q: "How do I join the iPhone beta?",
    a: (
      <>
        <p>Install Apple’s free <b>TestFlight</b> app from the App Store, then open the <a href={links.testflight}>Orbit beta link</a> on your iPhone and tap <b>Install</b>. Apple’s TestFlight builds expire after 90 days, so update to the latest build when TestFlight offers it.</p>
      </>
    ),
  },
  {
    q: "Does Orbit work offline?",
    a: <p>Yes. Everything is saved on your device first and synced afterwards, so nothing waits for a connection.</p>,
  },
  {
    q: "Why did a task not move when I travelled?",
    a: <p>That is on purpose. All-day tasks stay on their calendar day in any time zone. Timed tasks keep their moment.</p>,
  },
];

export default function Support() {
  return (
    <PageShell title="Support" intro="Answers to common questions about sync, Windows, exporting your data and the iPhone beta">
      <Accordion items={faq} />
      <p className="mt-10 text-[15px] text-muted">
        Still stuck? <a className="text-accent-text underline underline-offset-2" href={`${links.github}/issues`}>Open an issue on GitHub</a>.
      </p>
    </PageShell>
  );
}
