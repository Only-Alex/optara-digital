"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  items: string[];
  speed?: number;
};

export function Marquee({ items, speed = 40 }: Props) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (reduced || !trackRef.current) return;
    const width = trackRef.current.scrollWidth / 2;
    if (width === 0) return;
    const next = x.get() - (speed * delta) / 1000;
    x.set(next <= -width ? next + width : next);
  });

  if (reduced) {
    return (
      <ul className="shell flex flex-wrap justify-center gap-x-10 gap-y-3">
        {items.map((item) => (
          <li key={item} className="t-body text-[var(--muted)]">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        ref={trackRef}
        className="flex w-max items-center gap-14"
        style={{ x }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="t-body whitespace-nowrap text-[var(--muted)]"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
