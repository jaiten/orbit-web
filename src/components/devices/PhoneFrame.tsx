import { ScaledBox } from "./ScaledBox";
import { Screenshot } from "./Screenshot";
import type { ScreenshotSlot } from "@/lib/media";
import { cn } from "@/lib/cn";

export const PHONE_W = 402;
export const PHONE_H = 874;

/**
 * iPhone 16 Pro frame. Pass a ready screenshot slot to show a real screenshot,
 * or children to render the screen as live HTML at 402 x 874.
 * The frame is decorative; `label` describes the screen for assistive tech.
 */
export function PhoneFrame({ label, slot, children, className }: { label: string; slot?: ScreenshotSlot; children?: React.ReactNode; className?: string }) {
  const useShot = slot?.ready;
  return (
    <div role="img" aria-label={label} className={cn("relative aspect-[422/894] w-full rounded-[18%/8.6%] p-[2.4%] shadow-lift", className)} style={{ background: "linear-gradient(145deg, #5b5b60 0%, #2a2a2d 35%, #48484d 70%, #1b1b1d 100%)" }}>
      <div className="relative h-full w-full overflow-hidden rounded-[15.5%/7.4%] bg-canvas" style={{ boxShadow: "0 0 0 2px #000" }}>
        <div aria-hidden={!useShot ? true : undefined}>
          {useShot && slot ? <Screenshot slot={slot} /> : <ScaledBox width={PHONE_W} height={PHONE_H}>{children}</ScaledBox>}
        </div>
        {/* Dynamic Island */}
        <div aria-hidden className="absolute left-1/2 top-[1.3%] h-[4.2%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
        {/* Subtle glass reflection */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(115deg, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0) 32%)" }} />
      </div>
      {/* Side buttons */}
      <span aria-hidden className="absolute -left-[0.8%] top-[16%] h-[5%] w-[0.9%] rounded-l bg-[#3a3a3d]" />
      <span aria-hidden className="absolute -left-[0.8%] top-[23%] h-[8%] w-[0.9%] rounded-l bg-[#3a3a3d]" />
      <span aria-hidden className="absolute -right-[0.8%] top-[27%] h-[12%] w-[0.9%] rounded-r bg-[#3a3a3d]" />
    </div>
  );
}
