"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 900, damping: 60, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 900, damping: 60, mass: 0.4 });

  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>(
        "a, button, input, select, textarea, [data-cursor]",
      );
      setActive(Boolean(hit));
      setLabel(hit?.dataset.cursor ?? null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.style.cursor = "none";
    return () => {
      document.documentElement.style.removeProperty("cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] grid place-items-center mix-blend-normal"
      style={{ x: springX, y: springY }}
    >
      <motion.span
        className="grid place-items-center bg-blue text-paper"
        style={{ borderRadius: "9999px" }}
        animate={{
          width: active ? 56 : 10,
          height: active ? 56 : 10,
          marginLeft: active ? -28 : -5,
          marginTop: active ? -28 : -5,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {active && label ? (
          <span className="t-mono text-[0.5rem] leading-none">{label}</span>
        ) : null}
      </motion.span>
    </motion.div>
  );
}
