"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The intro's visual: a brand-and-demand system assembling in space.
 *
 * A sculptural CSS-3D composition rather than an illustration — layered
 * translucent planes at real translateZ depths, a fine signal-line drawing
 * (the same left-entry → anchor-node grammar the six service scenes use, so
 * the intro literally previews the system the visitor is about to enter),
 * and a few floating identity fragments on the nearest planes.
 *
 * Motion:
 * - pointer (mouse only) tilts the whole stage a few degrees on springs;
 * - the section's scroll progress deepens the composition as the scene
 *   exits — plane depths spread ~1.6× and the stage pitches slightly — so
 *   leaving the intro reads as travelling INTO the system, straight toward
 *   the services stage that occupies the same zone of the viewport;
 * - two fragments idle on the shared panel-float keyframe.
 *
 * Reduced motion renders the identical composition as a static still:
 * no tilt, no deepening, no float. Decorative throughout — aria-hidden;
 * materials are the permanent system only (paper planes, ink hairlines,
 * flat accent), no gradients, no glass noise, no blobs.
 */

const PLANE =
  "absolute rounded-[18px] border border-[var(--hairline)] bg-paper/70 shadow-[0_24px_70px_rgba(18,19,26,0.07)]";

/** The signal drawing shared with the service scenes: grid, horizon, one
 *  accent path resolving at an anchor node. */
function SignalPlate() {
  return (
    <svg viewBox="0 0 520 380" className="h-full w-full" aria-hidden="true">
      <g stroke="rgba(18,19,26,0.07)">
        {[76, 152, 228, 304].map((y) => (
          <line key={y} x1="24" y1={y} x2="496" y2={y} />
        ))}
        {[104, 208, 312, 416].map((x) => (
          <line key={x} x1={x} y1="24" x2={x} y2="356" />
        ))}
      </g>
      <line x1="24" y1="330" x2="496" y2="330" stroke="rgba(18,19,26,0.16)" />
      <g className="text-accent">
        <path
          d="M24 190 C 140 190 220 150 300 150 S 430 186 452 190"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.75"
        />
        <circle cx="452" cy="190" r="14" fill="none" stroke="currentColor" opacity="0.4" />
        <circle cx="452" cy="190" r="4.5" fill="currentColor" />
      </g>
    </svg>
  );
}

export function IdentityField({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 16, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 90, damping: 16, mass: 0.5 });

  /* Base pose is a quiet three-quarter view; the pointer steers a few
     degrees around it and the exit pitch adds on top. */
  const pointerY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const pointerX = useTransform(sy, [-0.5, 0.5], [4, -6]);
  const exitPitch = useTransform(progress, [0.68, 1], [0, -6]);
  const rotateX = useTransform(() => -8 + pointerX.get() + exitPitch.get());
  const rotateY = useTransform(() => 9 + pointerY.get());

  /* Scroll deepening: depths spread apart as the scene exits. */
  const spread = useTransform(progress, [0, 0.55, 1], [1, 1, 1.6]);
  const useZ = (depth: number) => useTransform(spread, (s) => depth * s);
  const zBack = useZ(-90);
  const zGrid = useZ(-30);
  const zCard = useZ(55);
  const zRing = useZ(120);
  const zChip = useZ(95);
  const zBar = useZ(140);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  if (reduced) {
    return (
      <div aria-hidden="true" className="relative h-[30rem] w-full">
        <div className={`${PLANE} left-[6%] top-[8%] h-[70%] w-[62%] rotate-[-2deg] bg-paper/50`} />
        <div className="absolute left-[16%] top-[16%] h-[66%] w-[64%] rounded-[18px] border border-[var(--hairline)] bg-paper/80">
          <SignalPlate />
        </div>
        <div className={`${PLANE} bottom-[6%] right-[10%] h-[38%] w-[38%] bg-paper p-5`}>
          <span className="block h-8 w-8 rounded-full border-2 border-accent" />
          <span className="mt-4 block h-2 w-3/4 rounded-full bg-ink/15" />
          <span className="mt-2 block h-2 w-1/2 rounded-full bg-ink/10" />
          <span className="mt-5 block h-2.5 w-16 rounded-full bg-accent" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative h-[30rem] w-full [perspective:1400px]"
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        {/* Deep plane: the environment the system sits in. */}
        <motion.div
          className={`${PLANE} left-[2%] top-[6%] h-[74%] w-[64%] bg-paper/50`}
          style={{ z: zBack, rotate: -2 }}
        />

        {/* The signal plane: grid, horizon, the recurring accent path. */}
        <motion.div
          className="absolute left-[14%] top-[14%] h-[70%] w-[66%] rounded-[18px] border border-[var(--hairline)] bg-paper/85"
          style={{ z: zGrid }}
        >
          <SignalPlate />
        </motion.div>

        {/* Identity plane: an abstract lockup — mark, type bars, accent.
            Cues of an identity system, never a readable fake brand. */}
        <motion.div
          className={`${PLANE} bottom-[4%] right-[6%] h-[40%] w-[40%] bg-paper p-6`}
          style={{ z: zCard, rotate: 1.5 }}
        >
          <span className="block h-9 w-9 rounded-full border-2 border-accent" />
          <span className="mt-4 block h-2 w-3/4 rounded-full bg-ink/15" />
          <span className="mt-2 block h-2 w-1/2 rounded-full bg-ink/10" />
          <span className="mt-5 block h-2.5 w-16 rounded-full bg-accent" />
        </motion.div>

        {/* Floating fragments on the nearest planes. */}
        <motion.span
          className="absolute right-[30%] top-[8%] block h-12 w-12 rounded-full border border-accent/50 [animation:panel-float_11s_ease-in-out_-3s_infinite] motion-reduce:[animation:none]"
          style={{ z: zRing }}
        />
        <motion.span
          className="absolute left-[8%] bottom-[14%] block h-2.5 w-2.5 bg-accent [animation:panel-float_9s_ease-in-out_-6s_infinite] motion-reduce:[animation:none]"
          style={{ z: zChip }}
        />
        <motion.span
          className="absolute left-[38%] top-[2%] block h-14 w-px bg-[var(--hairline)]"
          style={{ z: zBar }}
        />
      </motion.div>
    </div>
  );
}
