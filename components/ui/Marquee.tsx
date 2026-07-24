"use client";

import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  items: string[];
  speed?: number;
};

export function Marquee({ items, speed = 28 }: Props) {
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

  const sequence = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex w-max items-center gap-12"
        style={reduced ? undefined : { x }}
      >
        {sequence.map((item, i) => (
          <span key={`${item}-${i}`} className="t-mono whitespace-nowrap">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
