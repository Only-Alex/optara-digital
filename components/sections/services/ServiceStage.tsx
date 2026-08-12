"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { SERVICE_SCENES } from "@/components/sections/services/scenes";

/**
 * The persistent visual stage for the six-service immersive scroll
 * (Stage 2B). One client island: the six service chapters themselves stay
 * server-rendered in ServicesSticky.tsx, and this component only renders
 * the sticky right-hand stage plus the 01/06 progress rail.
 *
 * Active-chapter tracking: ONE Motion scroll progress across the whole
 * chapter run, cut into six equal bands — the chapters are equal-height by
 * construction (78vh each in ServicesSticky), so band k is chapter k, and
 * the crossover between two scenes lands at the midpoint between their
 * chapter centres. useMotionValueEvent watches the progress and React
 * state changes only when the computed band index actually changes, never
 * per scroll frame. Because the index is a pure monotonic function of
 * scroll position, slow scroll, fast scroll, reverse scroll and scrollbar
 * drags all resolve to the same deterministic active chapter with no
 * possibility of a missed or out-of-order callback. The same progress
 * value drives the depth transforms and the same state drives scenes and
 * progress UI, so none of the three can disagree.
 *
 * Scene transitions overlap: every scene stays mounted, absolutely
 * stacked, and the active one fades/settles in over ~650ms while the
 * outgoing one fades back — the stage is never blank and never flashes
 * white between services. Under reduced motion the transition collapses
 * to an instant swap (duration-0 via motion-reduce) and the scroll-linked
 * depth is disabled entirely, while activation itself keeps working.
 *
 * Scroll-linked depth is two token transforms on the stage interior
 * (scale 0.98→1→1.01, y 14→0→-10) driven by the same progress —
 * transform-only, rAF-batched, no scroll listeners anywhere.
 */
export function ServiceStage({ names }: { names: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(names.length - 1, Math.max(0, Math.floor(p * names.length)));
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  });

  const depthScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.01]);
  const depthY = useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, -10]);
  const depthStyle = reduced ? undefined : { scale: depthScale, y: depthY };

  return (
    <div ref={rootRef} aria-hidden="true" className="h-full">
      <div className="sticky top-[6.5rem]">
        <motion.div
          style={depthStyle}
          className="relative h-[calc(100svh-8.5rem)] max-h-[46rem] overflow-hidden"
        >
          {/* Soft edge mask so the stage sits IN the bone ground rather than
              on it — no card chrome, no border, no fill. */}
          <div className="absolute inset-0 [mask-image:radial-gradient(120%_100%_at_50%_50%,black_62%,transparent_96%)]">
            {SERVICE_SCENES.map((Scene, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  i === active
                    ? "translate-y-0 scale-100 opacity-100"
                    : i < active
                      ? "-translate-y-4 scale-[1.015] opacity-0"
                      : "translate-y-5 scale-[0.985] opacity-0"
                }`}
              >
                <Scene />
              </div>
            ))}
          </div>

          {/* Progress: bottom-left, clear of the floating Speak bubble which
              lives bottom-right. Same active state as the scenes. */}
          <div className="absolute bottom-2 left-2 flex items-center gap-4">
            <p className="t-mono text-ink/60">
              {String(active + 1).padStart(2, "0")} / {String(names.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-1.5">
              {names.map((name, i) => (
                <span
                  key={name}
                  className={`h-1 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    i === active ? "w-6 bg-accent" : "w-2.5 bg-ink/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
