import { forwardRef } from "react";

/**
 * The Orbit mark: an open ring with a small companion dot.
 * Geometry matches shared/brand/orbit-mark.svg without the app-icon tile.
 * Flat colour, no shadow. Keep at least one dot-width of clear space around it.
 */
export const RING_PATH = "M93 64a29 29 0 1 1-29-29";

interface Props extends React.SVGProps<SVGSVGElement> {
  /** Adds ids used by the hero intro (ring, dot and motion path). */
  intro?: boolean;
  title?: string;
}

export const OrbitMark = forwardRef<SVGSVGElement, Props>(function OrbitMark({ intro, title, ...props }, ref) {
  return (
    <svg ref={ref} viewBox="0 0 128 128" fill="none" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title} {...props}>
      <path className={intro ? "orbit-ring" : undefined} d={RING_PATH} stroke="var(--accent)" strokeWidth={12} strokeLinecap="round" />
      {intro && <circle className="orbit-path" cx="64" cy="64" r="32.5" stroke="none" fill="none" />}
      <circle className={intro ? "orbit-dot" : undefined} cx="87" cy="41" r="8" fill="var(--accent)" />
    </svg>
  );
});

/** Mark plus wordmark, for nav and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <OrbitMark className="size-7" />
      <span className="text-[19px] tracking-[-0.03em]">Orbit</span>
    </span>
  );
}
