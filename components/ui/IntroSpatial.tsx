"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The intro's visual: the three abstract brand panels arranged as a true 3D
 * cluster that answers the pointer.
 *
 * How the depth works: a perspective wrapper, one preserve-3d stage that
 * tilts toward the cursor on springs, and each card pushed to its own
 * translateZ plane. Hovering the cluster widens the depth spread, so the
 * cards visibly separate in space; a glare plane above the cards follows the
 * pointer like light moving across glass, and the ground shadow slides
 * against the tilt to keep the cluster anchored.
 *
 * Division of labour per card: the outer motion wrapper owns position and
 * depth (motion's `z`), an inner div owns the static tilt and the idle
 * panel-float levitation. They must be separate elements — a CSS animation's
 * transform beats an inline style transform, so on one element the float
 * would erase the depth.
 *
 * Interactivity is mouse-only (pointerType check); touch devices keep the
 * idle float. Reduced motion renders the static cluster and nothing moves.
 * Decorative throughout — the whole thing is aria-hidden and lg-and-up.
 */

/** The three panels plus mock-card content, shared by both renders. */
function PanelArt({ variant }: { variant: "back" | "mid" | "front" }) {
  if (variant === "back") {
    return (
      <div className="h-56 w-44 -rotate-6 rounded-[18px] bg-[linear-gradient(160deg,rgba(43,127,255,0.13),rgba(91,61,245,0.20))] shadow-[0_24px_60px_rgba(43,127,255,0.18)] [--tilt:-6deg] [animation:panel-float_10s_ease-in-out_infinite] motion-reduce:[animation:none]" />
    );
  }
  if (variant === "mid") {
    return (
      <div className="h-64 w-48 rotate-3 rounded-[18px] bg-[linear-gradient(200deg,rgba(91,61,245,0.18),rgba(123,47,247,0.13))] shadow-[0_24px_60px_rgba(123,47,247,0.16)] [--tilt:3deg] [animation:panel-float_12s_ease-in-out_-4s_infinite] motion-reduce:[animation:none]" />
    );
  }
  return (
    <div className="h-52 w-56 rotate-1 rounded-[18px] border border-[var(--hairline)] bg-paper p-5 shadow-[0_30px_70px_rgba(18,19,26,0.10)] [--tilt:1deg] [animation:panel-float_11s_ease-in-out_-7s_infinite] motion-reduce:[animation:none]">
      <span className="block h-2.5 w-2/3 rounded-full bg-[linear-gradient(90deg,#2B7FFF,#5B3DF5)]" />
      <span className="mt-3 block h-1.5 w-full rounded-full bg-ink/10" />
      <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-ink/10" />
      <span className="mt-2 block h-1.5 w-5/6 rounded-full bg-ink/10" />
      <span className="mt-6 inline-block rounded-full bg-accent px-4 py-2 text-[0.6875rem] font-medium text-paper">
        Qualified enquiry
      </span>
    </div>
  );
}

const WRAP = "relative mx-auto hidden h-[26rem] w-full max-w-[24rem] lg:block";

export function IntroSpatial() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  /* Pointer position across the cluster, -0.5..0.5 on both axes, and the
     depth spread multiplier. Springs keep every response fluid and give the
     settle-back on leave its weight. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spread = useMotionValue(1);
  const sx = useSpring(px, { stiffness: 110, damping: 16, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 110, damping: 16, mass: 0.4 });
  const sSpread = useSpring(spread, { stiffness: 130, damping: 19 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-11, 11]);

  /* Depth planes. A little separation even at rest, half again on hover.
     All hooks live above the reduced-motion return: the preference can flip
     mid-session, and a hook that only exists on one side of that branch
     would corrupt React's hook order. */
  const zBack = useTransform(sSpread, (s) => -55 * s);
  const zMid = useTransform(sSpread, (s) => 15 * s);
  const zFront = useTransform(sSpread, (s) => 85 * s);
  const zOrbA = useTransform(sSpread, (s) => 120 * s);
  const zOrbB = useTransform(sSpread, (s) => 45 * s);
  const zOrbC = useTransform(sSpread, (s) => -30 * s);

  /* Light and ground. The glare tracks the pointer; the shadow slides the
     opposite way to the tilt and deepens as the cards rise. */
  const glareX = useTransform(sx, [-0.5, 0.5], ["18%", "82%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["14%", "86%"]);
  const glare = useMotionTemplate`radial-gradient(22rem circle at ${glareX} ${glareY}, rgba(255,255,255,0.34), transparent 62%)`;
  const shadowX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const shadowOpacity = useTransform(sSpread, [1, 1.55], [0.45, 0.75]);

  if (reduced) {
    return (
      <div aria-hidden="true" className={WRAP}>
        <div className="absolute left-0 top-6">
          <PanelArt variant="back" />
        </div>
        <div className="absolute right-2 top-0">
          <PanelArt variant="mid" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <PanelArt variant="front" />
        </div>
      </div>
    );
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    spread.set(1.55);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
    spread.set(1);
  };

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={`${WRAP} [perspective:1200px]`}
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        <motion.div className="absolute left-0 top-6" style={{ z: zBack }}>
          <PanelArt variant="back" />
        </motion.div>

        <motion.div className="absolute right-2 top-0" style={{ z: zMid }}>
          <PanelArt variant="mid" />
        </motion.div>

        {/* Depth orbs: small brand-gradient points on their own planes, so
            the tilt reads as space rather than a flat card fan. */}
        <motion.span
          className="absolute left-[8%] top-[12%] h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#2B7FFF,#5B3DF5)] opacity-70 [animation:panel-float_9s_ease-in-out_-2s_infinite] motion-reduce:[animation:none]"
          style={{ z: zOrbA }}
        />
        <motion.span
          className="absolute right-[4%] top-[46%] h-2 w-2 rounded-full bg-[linear-gradient(135deg,#5B3DF5,#7B2FF7)] opacity-60 [animation:panel-float_11s_ease-in-out_-6s_infinite] motion-reduce:[animation:none]"
          style={{ z: zOrbB }}
        />
        <motion.span
          className="absolute bottom-[10%] left-[16%] h-1.5 w-1.5 rounded-full bg-[linear-gradient(135deg,#2B7FFF,#7B2FF7)] opacity-50 [animation:panel-float_10s_ease-in-out_-4s_infinite] motion-reduce:[animation:none]"
          style={{ z: zOrbC }}
        />

        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ z: zFront }}
        >
          <PanelArt variant="front" />
        </motion.div>

        {/* The glare plane: light crossing the cluster, above every card. */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[24px] mix-blend-soft-light"
          style={{ z: 130, background: glare }}
        />
      </motion.div>

      {/* Ground shadow, outside the tilting stage so it stays on the floor. */}
      <motion.div
        className="absolute -bottom-9 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[100%] bg-ink/15 blur-2xl"
        style={{ x: shadowX, opacity: shadowOpacity }}
      />
    </div>
  );
}
