"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. Keep small: depth cue, not a gimmick. */
  max?: number;
};

/**
 * Pointer-tracked 3D tilt. The card rotates a few degrees toward the cursor
 * and springs flat on leave — an L1 depth cue, not a scene.
 *
 * Mouse only: `pointerType` is checked per event, so touch scrolling over the
 * card never tilts it. Reduced motion renders a plain div. The springs live
 * here rather than in CSS because the release should overshoot slightly and
 * settle, which a transition cannot do.
 */
export function TiltCard({ children, className, max = 6 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
