"use client";

import { motion } from "motion/react";
import {
  groupVariants,
  itemVariants,
  revealTransition,
  revealVariants,
  VIEWPORT,
  VIEWPORT_SOFT,
} from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Tag = "div" | "li" | "span" | "ul" | "ol" | "p" | "section";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
};

export function RevealText({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
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

type GroupProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: Tag;
  soft?: boolean;
};

export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0,
  as = "div",
  soft = false,
}: GroupProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      variants={groupVariants(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={soft ? VIEWPORT_SOFT : VIEWPORT}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  onMouseEnter,
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  onMouseEnter?: () => void;
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return (
      <Static className={className} onMouseEnter={onMouseEnter}>
        {children}
      </Static>
    );
  }

  return (
    <Component
      className={className}
      variants={itemVariants}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </Component>
  );
}
