"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * A constant plume rising from the hero's bottom-right corner, up the right
 * edge — requested 2026-07-28, from a capture of the site's own cursor smoke
 * held in that corner.
 *
 * Renders nothing. It drives the EXISTING FluidCursor simulation by walking a
 * synthetic pointer up the right edge, so the plume is made of exactly the
 * same smoke as the cursor and costs no second render loop, no new context —
 * the sim is already running. Strokes alternate pointer ids so each respawn
 * starts with zero velocity (no teleport splat), and the ids never collide
 * with the user's real pointer.
 *
 * Stops emitting when the tab is hidden or the hero has scrolled away; the
 * smoke then simply dissipates. Reduced motion emits nothing.
 */

const RISE_PER_FRAME = 2.1;
const WANDER_PX = 26;
const EDGE_INSET = 0.07; // fraction of width in from the right edge
const TOP_LIMIT = 0.22; // stop rising at 22% of hero height
const IDS = [9001, 9002];

export function AmbientPlume() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const hero = document.getElementById("top");
    const canvas = hero?.querySelector("canvas");
    if (!hero || !canvas) return;

    let raf = 0;
    let running = true;
    let visible = true;
    let y = 1; // fraction of hero height, 1 = bottom
    let t = 0;
    let idFlip = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(hero);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    function emit() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.height === 0) return;
      const px =
        rect.right -
        rect.width * EDGE_INSET +
        Math.sin(y * 9 + t * 1.3) * WANDER_PX;
      const py = rect.top + rect.height * y;

      canvas!.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: px,
          clientY: py,
          pointerId: IDS[idFlip],
          pointerType: "mouse",
          bubbles: true,
        }),
      );
    }

    function tick() {
      if (!running) return;
      t += 0.016;

      if (visible) {
        const rect = canvas!.getBoundingClientRect();
        if (rect.height > 0) {
          y -= RISE_PER_FRAME / rect.height;
          if (y < TOP_LIMIT) {
            // Respawn at the bottom on the other id, so the first move of the
            // new stroke has no velocity and cannot streak.
            y = 1 - Math.random() * 0.04;
            idFlip = 1 - idFlip;
          }
          emit();
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return null;
}
