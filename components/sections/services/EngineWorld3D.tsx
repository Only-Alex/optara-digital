"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import type { EngineHandle } from "@/components/sections/services/engineWorld";
import { useProtoProgress, useStory } from "@/components/sections/services/story";

/**
 * Client island for the Optara Intelligence Engine (Stage 2D.1).
 *
 * Same proven contract as the previous 3D island: three.js loads via
 * dynamic import only when the immersive gate is on (phones never
 * download the chunk); the scene receives the canonical prototype
 * progress by subscription and never reads scroll itself; one
 * IntersectionObserver parks the render loop offscreen and
 * visibilitychange parks it when the tab hides; WebGL construction
 * failure returns null and the page silently stays typographic; full
 * disposal on unmount. Pointer parallax is window-level, mouse-only,
 * and clamped inside the scene so geometry can never drift over the
 * left typography column.
 */
export function EngineWorld3D() {
  const { enabled } = useStory();
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<EngineHandle | null>(null);
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

    import("@/components/sections/services/engineWorld").then(
      ({ createEngineWorld }) => {
        if (cancelled || !hostRef.current) return;
        handleRef.current = createEngineWorld(hostRef.current);
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
