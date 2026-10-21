"use client";
import { Component, useEffect, useRef, useState } from "react";

/** If one section throws in some unusual browser, the rest of the page keeps working. */
class Contain extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Orbit section failed to start", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Keeps a section's server-rendered HTML as is and only brings it to life (hydrates it) once it is
 * within `rootMargin` of the viewport. Everything stays in the static HTML for search engines and
 * readers; the main thread just doesn't pay for sections nobody has scrolled near yet.
 */
export function LazyIsland({ children, rootMargin = "1500px 0px" }: { children: React.ReactNode; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (live || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    // Find-in-page and anchors work on the static HTML; make sure we are live by the time the visitor arrives.
    const hash = () => location.hash && el.querySelector(location.hash) && setLive(true);
    window.addEventListener("hashchange", hash);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", hash);
    };
  }, [live, rootMargin]);

  // On the server, and once live, render the real thing. Before that, React is told the (already present) HTML is correct.
  if (typeof window === "undefined" || live) return (
      <div ref={ref}>
        <Contain>{children}</Contain>
      </div>
    );
  return <div ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />;
}
