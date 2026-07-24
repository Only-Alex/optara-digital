"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type TargetAndTransition,
} from "motion/react";
import { hoverTransition } from "@/lib/motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  cursorLabel?: string;
  hoverStyle?: TargetAndTransition;
};

export function MagneticButton({
  href,
  children,
  className,
  cursorLabel,
  hoverStyle,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 });

  const onMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      data-cursor={cursorLabel}
      className={className}
      style={enabled ? { x: springX, y: springY } : undefined}
      whileHover={hoverStyle}
      whileFocus={hoverStyle}
      whileTap={{ scale: 0.97 }}
      transition={hoverTransition}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.a>
  );
}
