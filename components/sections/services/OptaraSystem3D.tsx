"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import type { OptaraSystemHandle } from "@/components/sections/services/optaraSystem";
import { useProtoProgress, useStory } from "@/components/sections/services/story";

/**
 * The client island that owns the Three.js protagonist (Stage 2C.3A).
 *
 * - three is loaded via dynamic import inside the effect, and only when
 *   the immersive gate is on — phones and tablets never download the
 *   chunk, the hero payload never contains it.
 * - The scene receives the canonical prototype progress by subscription
 *   (useMotionValueEvent → handle.setProgress). It never reads scroll
 *   itself; there is no second timeline and no direction logic anywhere.
 * - One IntersectionObserver pauses the render loop when the experience
 *   leaves the viewport; visibilitychange parks it when the tab hides.
 * - Pointer parallax listens on window (mouse only, ~1.5° equivalent);
 *   the canvas layer itself stays pointer-events-none so every link above
 *   keeps working.
 * - If WebGL cannot initialise, createOptaraSystem returns null and the
 *   page silently stays typographic — no error surfaces, and the hero's
 *   separate WebGL system is never touched.
 */
export function OptaraSystem3D() {
  const { enabled } = useStory();
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<OptaraSystemHandle | null>(null);
  const protoP = useProtoProgress();
  const protoPRef = useRef(0);

  useMotionValueEvent(protoP, "change", (v) => {
    protoPRef.current = v;
    handleRef.current?.setProgress(v);
  });

  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const onVisibility = () => {
      handleRef.current?.setRunning(!document.hidden);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      handleRef.current?.setPointer(
        e.clientX / window.innerWidth - 0.5,
        e.clientY / window.innerHeight - 0.5,
      );
    };

    import("@/components/sections/services/optaraSystem").then(
      ({ createOptaraSystem }) => {
        if (cancelled || !hostRef.current) return;
        handleRef.current = createOptaraSystem(hostRef.current);
        if (!handleRef.current) return; // WebGL unavailable → silent fallback
        handleRef.current.setProgress(protoPRef.current);

        observer = new IntersectionObserver(
          ([entry]) =>
            handleRef.current?.setRunning(entry.isIntersecting && !document.hidden),
          { threshold: 0 },
        );
        observer.observe(host);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      },
    );

    return () => {
      cancelled = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={hostRef} className="h-full w-full" />;
}
