"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

export function InversionWipe() {
  const marker = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const scrollYProgress = useScrollProgress(marker, ["start end", "start start"]);

  const scaleY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const origin = useTransform(scrollYProgress, (value) =>
    value < 0.5 ? "bottom" : "top",
  );

  return (
    <div ref={marker} aria-hidden="true" className="h-0">
      {!reduced && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 bg-blue"
          style={{ scaleY, transformOrigin: origin, willChange: "transform" }}
        />
      )}
    </div>
  );
}
