import { Minus, Square, X } from "lucide-react";
import { ScaledBox } from "./ScaledBox";
import { Screenshot } from "./Screenshot";
import { OrbitMark } from "@/components/brand/OrbitMark";
import type { ScreenshotSlot } from "@/lib/media";
import { cn } from "@/lib/cn";

export const WIN_W = 1100;
export const WIN_H = 700;
const TITLE_H = 36;

/** Windows 11 window with a title bar and subtle reflection. Children render at 1100 x 664 below the title bar. */
export function WindowFrame({ label, slot, children, className }: { label: string; slot?: ScreenshotSlot; children?: React.ReactNode; className?: string }) {
  const useShot = slot?.ready;
  return (
    <div role="img" aria-label={label} className={cn("relative w-full overflow-hidden rounded-[10px] bg-surface shadow-lift ring-1 ring-line", className)}>
      <div aria-hidden={!useShot ? true : undefined}>
        <ScaledBox width={WIN_W} height={WIN_H}>
          <div className="flex h-full w-full flex-col bg-canvas text-ink">
            <div className="flex shrink-0 items-center justify-between bg-surface/80" style={{ height: TITLE_H }}>
              <div className="flex items-center gap-2 pl-4 text-[12px] text-muted">
                <OrbitMark className="size-4" />
                Orbit
              </div>
              <div className="flex h-full text-muted">
                {[Minus, Square, X].map((Icon, i) => (
                  <span key={i} className="grid w-[46px] place-items-center">
                    <Icon size={i === 1 ? 11 : 14} strokeWidth={1.5} />
                  </span>
                ))}
              </div>
            </div>
            <div className="relative min-h-0 flex-1" style={{ height: WIN_H - TITLE_H }}>
              {useShot && slot ? <Screenshot slot={slot} /> : children}
            </div>
          </div>
        </ScaledBox>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(120deg, rgb(255 255 255 / 0.12) 0%, rgb(255 255 255 / 0) 28%)" }} />
    </div>
  );
}
