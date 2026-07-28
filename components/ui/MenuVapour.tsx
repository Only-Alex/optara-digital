"use client";

import { motion } from "motion/react";

/**
 * Theme-coloured vapour clinging to the mega-menu borders while it is open —
 * lighter than smoke: accent light in a grey haze, drifting off the top edge
 * and pooling under the bottom one, after the reference clip's pour-and-pool.
 *
 * Not a fluid simulation — the hero owns the page's only WebGL loop. These
 * are blurred gradient layers animated on transform and opacity only, plus
 * one *static* turbulence texture whose transform drifts; nothing recomputes
 * noise per frame. The whole cluster mounts with the panel and unmounts with
 * it, so no loop survives the menu closing. Callers gate on reduced motion.
 */
export function MenuVapour() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-8 overflow-visible"
    >
      {/* Crown — accent vapour rising off the top edge */}
      <motion.div
        className="absolute left-1/2 top-1 h-24 w-[68%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(52% 62% at 50% 100%, rgba(59,30,255,0.20), transparent 74%)",
          filter: "blur(20px)",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          y: [-3, -13, -3],
          scaleX: [0.96, 1.05, 0.96],
        }}
        transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Shoulders — grey haze with a trace of accent, one each side */}
      <motion.div
        className="absolute left-0 top-6 h-40 w-28 rounded-full"
        style={{
          background:
            "radial-gradient(60% 55% at 80% 40%, rgba(122,126,142,0.16), rgba(59,30,255,0.10) 55%, transparent 78%)",
          filter: "blur(18px)",
        }}
        animate={{ opacity: [0.35, 0.6, 0.35], x: [-4, -11, -4], y: [2, -5, 2] }}
        transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute right-0 top-10 h-40 w-28 rounded-full"
        style={{
          background:
            "radial-gradient(60% 55% at 20% 40%, rgba(122,126,142,0.16), rgba(59,30,255,0.10) 55%, transparent 78%)",
          filter: "blur(18px)",
        }}
        animate={{ opacity: [0.3, 0.58, 0.3], x: [4, 11, 4], y: [-3, 4, -3] }}
        transition={{
          duration: 4.8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.6,
        }}
      />

      {/* Skirt — vapour pooling and spreading under the bottom edge */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-20 w-[85%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(55% 58% at 50% 0%, rgba(59,30,255,0.13), rgba(122,126,142,0.10) 50%, transparent 76%)",
          filter: "blur(22px)",
        }}
        animate={{
          opacity: [0.3, 0.55, 0.3],
          y: [2, 10, 2],
          scaleX: [0.97, 1.07, 0.97],
        }}
        transition={{
          duration: 5.2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.3,
        }}
      />

      {/* Turbulent veil along the top border: static fractal noise displaces
          a soft accent gradient so the edge curls like vapour instead of
          reading as a blurred ellipse. Only its transform animates. */}
      <svg
        className="absolute inset-x-10 top-[-14px] h-14 w-[calc(100%-5rem)]"
        style={{ filter: "blur(5px)" }}
        viewBox="0 0 600 56"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="mv-turb" x="-20%" y="-60%" width="140%" height="220%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.045"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="34" />
          </filter>
          <linearGradient id="mv-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(59,30,255,0)" />
            <stop offset="0.5" stopColor="rgba(59,30,255,0.30)" />
            <stop offset="1" stopColor="rgba(59,30,255,0)" />
          </linearGradient>
        </defs>
        <motion.rect
          x="20"
          y="18"
          width="560"
          height="26"
          rx="13"
          fill="url(#mv-grad)"
          filter="url(#mv-turb)"
          animate={{ x: [-10, 10, -10], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 5.6, ease: "easeInOut", repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
