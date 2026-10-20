import Link from "next/link";
import { Logo } from "@/components/brand/OrbitMark";
import { links } from "@/lib/links";

/** Quiet footer: logo, three links, copyright. Kokonut-style layout, Orbit tokens. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-12 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-[15px] text-muted">A little space for what matters.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
            <li><Link className="text-muted hover:text-ink" href={links.privacy}>Privacy</Link></li>
            <li><Link className="text-muted hover:text-ink" href={links.support}>Support</Link></li>
            <li><a className="text-muted hover:text-ink" href={links.github} target="_blank" rel="noreferrer noopener">GitHub</a></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 text-[13px] text-muted">© Orbit</div>
    </footer>
  );
}
