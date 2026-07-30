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
  const springX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.3 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setActive(
        Boolean(target?.closest("a, button, input, select, textarea, [data-cursor]")),
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] block rounded-full border border-ink/40"
      style={{ x: springX, y: springY }}
      animate={{
        width: active ? 44 : 18,
        height: active ? 44 : 18,
        marginLeft: active ? -22 : -9,
        marginTop: active ? -22 : -9,
        borderColor: active ? "#5B3DF5" : "rgba(18,19,26,0.4)",
        backgroundColor: active ? "rgba(91, 61, 245,0.10)" : "transparent",
      }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
