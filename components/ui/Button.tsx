"use client";

import { motion } from "motion/react";
import { hoverTransition } from "@/lib/motion";
import { ArrowIcon } from "./Icons";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "light";
  withArrow?: boolean;
  className?: string;
};

const base = "pill";

const styles = {
  solid: "bg-accent text-paper",
  outline: "border border-[var(--hairline)] text-[var(--fg)]",
  light: "bg-paper text-ink",
} as const;

const hover = {
  solid: { backgroundColor: "#1B0FA8", y: -2 },
  outline: {
    borderColor: "var(--accent-fg)",
    color: "var(--accent-fg)",
    y: -2,
  },
  light: { y: -2 },
} as const;

export function Button({
  href,
  children,
  variant = "solid",
  withArrow = false,
  className = "",
}: Props) {
  return (
    <motion.a
      href={href}
      className={`${base} ${styles[variant]} ${className}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={{ scale: 0.97 }}
      variants={{ rest: {}, hover: hover[variant] }}
      transition={hoverTransition}
    >
      {children}
      {withArrow && (
        <motion.span
          className="inline-flex"
          variants={{ rest: { x: 0 }, hover: { x: 4 } }}
          transition={hoverTransition}
        >
          <ArrowIcon className="h-4 w-4" />
        </motion.span>
      )}
    </motion.a>
  );
}
