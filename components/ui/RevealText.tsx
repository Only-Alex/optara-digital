"use client";

import { motion } from "motion/react";
import { revealTransition, revealVariants, VIEWPORT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "span";
};

export function RevealText({ children, className, delay = 0, as = "div" }: Props) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </Component>
  );
}
