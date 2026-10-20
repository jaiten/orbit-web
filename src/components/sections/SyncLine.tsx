"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";

const PATH = "M4 40C50 4 110 76 156 40";

/** A soft line between two devices with a dot that drifts back and forth (anime.js), only while on screen. */
export function SyncLine({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const p = path.current;
    const d = dot.current;
    if (!p || !d) return;
    const place = (t: number) => {
      const pt = p.getPointAtLength(t * p.getTotalLength());
      d.setAttribute("cx", String(pt.x));
      d.setAttribute("cy", String(pt.y));
    };
    place(0.5);
    if (prefersReducedMotion()) return;
    const lap = { t: 0 };
    let anim: { play(): unknown; pause(): unknown } | null = null;
    let visible = false;
    let gone = false;
    void import("animejs").then(({ animate }) => {
      if (gone) return;
      anim = animate(lap, { t: 1, duration: 2800, ease: "inOutSine", alternate: true, loop: true, autoplay: false, onUpdate: () => place(lap.t) });
      if (visible) anim.play();
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) anim?.play();
      else anim?.pause();
    }, { threshold: 0.2 });
    if (svg.current) io.observe(svg.current);
    return () => {
      gone = true;
      io.disconnect();
      anim?.pause();
    };
  }, []);

  return (
    <svg ref={svg} viewBox="0 0 160 80" aria-hidden className={className} fill="none">
      <path ref={path} d={PATH} stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
      <circle ref={dot} r="5" fill="var(--accent)" />
    </svg>
  );
}
