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

export const hoverTransition: Transition = {
  duration: DURATION.micro,
  ease: EASE,
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const itemVariants = revealVariants;

export const groupVariants = (
  staggerChildren = 0.09,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const VIEWPORT = { once: true, amount: 0.25 } as const;

export const VIEWPORT_SOFT = { once: true, amount: 0.15 } as const;
