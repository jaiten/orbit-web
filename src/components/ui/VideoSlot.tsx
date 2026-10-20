"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { asset } from "@/lib/links";
import type { VideoSlot as Slot } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

/**
 * Short looping clip: muted, playsinline, plays only while on screen.
 * With reduced motion it stays on the poster until the visitor presses play.
 * Until `ready` is true it shows a clearly marked placeholder with the exact file spec.
 */
export function VideoSlot({ slot, className, maxWidth = 280 }: { slot: Slot; className?: string; maxWidth?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const captionId = useId();
  const name = slot.base.split("/").pop();

  useEffect(() => {
    const v = ref.current;
    if (!v || !slot.ready || reduced) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().then(() => setPlaying(true)).catch(() => {});
      else {
        v.pause();
        setPlaying(false);
      }
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [slot.ready, reduced]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className={cn("m-0", className)} style={{ maxWidth }}>
      <div className="relative overflow-hidden rounded-[18px] ring-1 ring-line" style={{ aspectRatio: `${slot.width} / ${slot.height}` }}>
        {slot.ready ? (
          <>
            <video ref={ref} muted loop playsInline preload="none" width={slot.width} height={slot.height} poster={asset(slot.poster)} aria-describedby={captionId} className="h-full w-full object-cover">
              <source src={asset(`${slot.base}.webm`)} type="video/webm" />
              <source src={asset(`${slot.base}.mp4`)} type="video/mp4" />
            </video>
            <button type="button" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"} className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </>
        ) : (
          <div className="grid h-full w-full place-items-center bg-surface p-5 text-center" style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 10px, color-mix(in srgb, var(--ink) 4%, transparent) 10px 11px)" }}>
            <div>
              <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-accent/12 text-accent-text"><Play size={16} /></div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-accent-text">Video placeholder</div>
              <div className="mt-1 text-[14px] font-medium">{name}.mp4 / .webm</div>
              <div className="mt-1 text-[12px] text-muted">{slot.width} × {slot.height} · muted loop · under 2 MB</div>
            </div>
          </div>
        )}
      </div>
      <figcaption id={captionId} className="mt-2 text-[13px] leading-snug text-muted">{slot.description}</figcaption>
    </figure>
  );
}
