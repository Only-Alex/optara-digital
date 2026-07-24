import type { Transition, Variants } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  micro: 0.25,
  reveal: 0.7,
  wipe: 0.9,
} as const;

export const revealTransition: Transition = {
  duration: DURATION.reveal,
  ease: EASE,
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const VIEWPORT = { once: true, amount: 0.25 } as const;
