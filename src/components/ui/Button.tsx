import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none transition-[transform,background-color,box-shadow] duration-200 ease-out active:scale-[0.97]";
const sizes = { md: "h-11 px-5 text-[15px]", lg: "h-[52px] px-7 text-[17px]", sm: "h-9 px-4 text-[14px]" };
const variants: Record<Variant, string> = {
  primary: "bg-btn text-on-btn hover:brightness-110",
  secondary: "bg-surface text-ink ring-1 ring-inset ring-line hover:bg-line/50",
  quiet: "text-accent-text hover:bg-accent/10",
};

interface Props {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}

/** Pill button rendered as a link. Kokonut-style, restyled to Orbit tokens. */
export function Button({ href, variant = "primary", size = "md", className, children, external }: Props) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (external || /^https?:/.test(href))
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
