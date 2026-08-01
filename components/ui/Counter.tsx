"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to `value` once the element scrolls into view. */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          if (reduced) {
            setN(value);
            setDone(true);
            return;
          }

          const start = performance.now();
          const duration = 1600;
          const step = (now: number) => {
            const k = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - k, 3);
            setN(Math.round(value * eased));
            if (k < 1) requestAnimationFrame(step);
            else setDone(true);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {n}
      {done ? suffix : ""}
    </span>
  );
}
