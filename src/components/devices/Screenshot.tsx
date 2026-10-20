import { asset } from "@/lib/links";
import type { ScreenshotSlot } from "@/lib/media";

/** A supplied screenshot as AVIF with a WebP fallback and explicit dimensions. */
export function Screenshot({ slot, className }: { slot: ScreenshotSlot; className?: string }) {
  return (
    <picture>
      <source srcSet={asset(`${slot.base}.avif`)} type="image/avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(`${slot.base}.webp`)} alt={slot.alt} width={slot.width} height={slot.height} decoding="async" className={className} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </picture>
  );
}
