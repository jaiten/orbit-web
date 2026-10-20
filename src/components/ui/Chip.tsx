import { cn } from "@/lib/cn";

/** Pill-shaped chip. */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1 text-[13px] font-medium text-accent-text", className)}>
      {children}
    </span>
  );
}
