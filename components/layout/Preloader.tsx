"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const RUN_MS = 1200;

export function Preloader() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / RUN_MS, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const exit = window.setTimeout(() => {
      setCount(100);
      setDone(true);
    }, RUN_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exit);
    };
  }, [reduced]);

  useEffect(() => {
    if (done) {
      document.body.style.removeProperty("overflow");
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const strip = window.setTimeout(() => setRemoved(true), 900);
    return () => window.clearTimeout(strip);
  }, [done]);

  if (reduced || removed) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center"
          aria-hidden="true"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-paper"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-paper"
            exit={{ y: "100%" }}
            transition={{ duration: 0.7, ease: EASE }}
          />
          <span className="t-mono relative text-ink">
            {String(count).padStart(3, "0")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
