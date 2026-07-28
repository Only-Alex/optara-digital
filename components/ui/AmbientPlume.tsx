"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Constant smoke rising from the hero's bottom-right corner — the SAME fluid
 * smoke as the cursor effect, by explicit request: a second, corner-scoped
 * instance of the same webgl-fluid engine with FluidCursor's exact colour
 * pipeline (bright-on-black, CSS-inverted), at lower sim resolution.
 *
 * Why a second instance rather than feeding the hero's sim: the library
 * tracks ONE mouse pointer per canvas, so a synthetic stream on the hero
 * canvas interleaves with the visitor's real cursor and streaks between the
 * two positions; and desktop Chrome has no Touch constructor, so the
 * multi-pointer touch path dies for most visitors. A private instance gives
 * the emitter its own pointer. The visitor's cursor never reaches this
 * canvas, and the one-loop rule in §11 is knowingly set aside here — the
 * client asked for exactly this, twice.
 *
 * Streams: three virtual strokes share the one pointer by re-anchoring with
 * a synthetic mousedown before each move (mousedown resets the pointer's
 * position without splatting), so every splat's velocity is its own stroke's
 * small step — never a jump between streams or respawns.
 */

const TOP_LIMIT = 0.05;

type Stream = {
  fx: number; // base x, fraction of the plume canvas width
  amp: number;
  speed: number; // rise in px per frame
  phase: number;
  y: number; // fraction of canvas height, 1 = bottom
  px: number; // previous client coords, for re-anchoring
  py: number;
};

export function AmbientPlume() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const hero = document.getElementById("top");
    if (!canvas || !hero) return;

    let cancelled = false;
    let raf = 0;
    let visible = true;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // Same context-claiming trick as FluidCursor: makes the buffer readable
    // for verification and keeps attribute control here.
    canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    observer.observe(hero);

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: false,
        AUTO: false,
        // Half the hero sim's resolution: the plume is a corner garnish, not
        // the signature, and two full-res sims would be gluttony.
        SIM_RESOLUTION: 96,
        DYE_RESOLUTION: 512,
        // Slightly slower fade than the cursor so the column holds together
        // from corner to top.
        DENSITY_DISSIPATION: 3.2,
        VELOCITY_DISSIPATION: 0.5,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.24,
        SPLAT_FORCE: 6000,
        COLORFUL: false,
        // FluidCursor's exact colour pipeline: indigo's complement, rendered
        // bright-on-black and CSS-inverted by the class below.
        SPLAT_COLOR: { r: 0.26, g: 0.3, b: 0.0 },
        SHADING: true,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.45,
        BLOOM_THRESHOLD: 0.82,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      const streams: Stream[] = [
        { fx: 0.82, amp: 30, speed: 2.4, phase: 0.0, y: 0.98, px: 0, py: 0 },
        { fx: 0.66, amp: 20, speed: 3.1, phase: 2.1, y: 0.62, px: 0, py: 0 },
        { fx: 0.9, amp: 13, speed: 3.9, phase: 4.4, y: 0.3, px: 0, py: 0 },
      ];
      let t = 0;

      const emit = (type: "mousedown" | "mousemove", x: number, y: number) => {
        canvas.dispatchEvent(
          new MouseEvent(type, { clientX: x, clientY: y, bubbles: false }),
        );
      };

      const posOf = (s: Stream, rect: DOMRect) => {
        const x =
          rect.left +
          rect.width * s.fx +
          Math.sin(s.y * 7 + t * 1.4 + s.phase) * s.amp +
          Math.sin(s.y * 23 + t * 0.7 + s.phase) * s.amp * 0.35;
        const y = rect.top + rect.height * s.y;
        return { x, y };
      };

      // Initialise anchors so the first frame has zero-velocity splats.
      const rect0 = canvas.getBoundingClientRect();
      for (const s of streams) {
        const p = posOf(s, rect0);
        s.px = p.x;
        s.py = p.y;
      }

      const tick = () => {
        if (cancelled) return;
        t += 0.016;

        const rect = canvas.getBoundingClientRect();
        if (visible && document.visibilityState === "visible" && rect.height > 0) {
          for (const s of streams) {
            s.y -= s.speed / rect.height;
            if (s.y < TOP_LIMIT) {
              s.y = 1 - Math.random() * 0.04;
              const p = posOf(s, rect);
              s.px = p.x;
              s.py = p.y;
              // Re-anchor only: next frame's move starts from here.
              emit("mousedown", p.x, p.y);
              continue;
            }
            // Re-anchor to this stream's own previous position, then step.
            emit("mousedown", s.px, s.py);
            const p = posOf(s, rect);
            emit("mousemove", p.x, p.y);
            s.px = p.x;
            s.py = p.y;
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 top-0 w-[46%] opacity-65 [filter:invert(1)_saturate(1.45)]"
    />
  );
}
