"use client";

import { useScroll, type MotionValue } from "motion/react";
import type { RefObject } from "react";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: Offset,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset });
  return scrollYProgress;
}
