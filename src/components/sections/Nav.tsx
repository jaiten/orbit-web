"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/OrbitMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { spring } from "@/lib/motion";

const items = [
  { href: "/#features", label: "Features" },
  { href: "/#widgets", label: "Widgets" },
  { href: "/#windows", label: "Windows" },
  { href: "/#sync", label: "Sync" },
];

/** Floating pill. Translucent with blur; it shrinks slightly once the page scrolls. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const scale = useSpring(useTransform(scrollY, [0, 80], [1, 0.965]), spring.follow);
  const edge = useTransform(scrollY, [0, 80], [0.4, 1]);
  useMotionValueEvent(scrollY, "change", () => open && setOpen(false));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <m.nav aria-label="Main" style={{ scale }} className="relative mx-auto flex h-14 max-w-5xl origin-top items-center justify-between rounded-full pl-5 pr-2">
        <m.span aria-hidden style={{ opacity: edge, background: "var(--glass)" }} className="absolute inset-0 -z-10 rounded-full shadow-card ring-1 ring-line backdrop-blur-xl backdrop-saturate-150" />
        <Link href="/" aria-label="Orbit, home" className="rounded-full">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {items.map((i) => (
            <li key={i.href}>
              <Link href={i.href} className="rounded-full px-4 py-2 text-[14px] text-muted transition-colors hover:text-ink">
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button href="/#get" size="sm" className="ml-1">
            Get Orbit
          </Button>
          <button type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="grid size-9 place-items-center rounded-full text-muted md:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </m.nav>
      <AnimatePresence>
        {open && (
          <m.ul
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={spring.ui}
            className="mx-auto mt-2 max-w-5xl origin-top rounded-[18px] p-2 shadow-card ring-1 ring-line backdrop-blur-xl md:hidden"
            style={{ background: "var(--glass)" }}
          >
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} onClick={() => setOpen(false)} className="block rounded-[12px] px-4 py-3 text-[17px] hover:bg-ink/5">
                  {i.label}
                </Link>
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
