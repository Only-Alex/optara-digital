"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The cursor-following "view" bubble from the reference style: hovering a
 * region makes a dark disc glide after the pointer, labelled with where the
 * click will go.
 *
 * Decorative only. The wrapped content keeps its own real links and focus
 * states — keyboard and touch users never meet the bubble (it is aria-hidden,
 * renders nothing on coarse pointers, and takes no pointer events), so it adds
 * a flourish for mouse users without becoming the interaction itself.
 *
 * Springs run outside React: pointer moves write to motion values, not state,
 * so tracking costs no re-renders.
 */
export function CursorBubble({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <div
      ref={areaRef}
      className={`relative ${className}`}
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:flex"
        style={{ x: sx, y: sy }}
      >
        <motion.span
          initial={false}
          animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-ink text-center text-paper shadow-[0_18px_50px_rgba(18,19,26,0.25)]"
        >
          <ArrowIcon aria-hidden="true" className="h-4 w-4 -rotate-45" />
          <span className="px-3 font-mono text-[0.625rem] uppercase leading-tight tracking-[0.08em]">
            {label}
          </span>
        </motion.span>
      </motion.div>
    </div>
  );
}
