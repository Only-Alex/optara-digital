"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let detachForwarding: (() => void) | undefined;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: false,
        AUTO: false,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 0.85,
        VELOCITY_DISSIPATION: 0.3,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.28,
        SPLAT_FORCE: 6000,
        COLORFUL: false,
        // Rendered bright-on-black then CSS-inverted, so this is indigo's
        // complement: invert(#C6E100) lands on the accent #3B1EFF.
        SPLAT_COLOR: { r: 0.6, g: 0.69, b: 0.0 },
        SHADING: true,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        // Bloom is what gives the lit-up core under the pointer.
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.7,
        BLOOM_THRESHOLD: 0.55,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // The library listens on the canvas itself, but the canvas must stay
      // pointer-events:none so the hero's links stay clickable. Forward window
      // pointer movement to it instead; offsetX/offsetY resolve from clientX/Y.
      const forward = (event: PointerEvent) => {
        canvas.dispatchEvent(
          new MouseEvent(event.type === "pointerdown" ? "mousedown" : "mousemove", {
            clientX: event.clientX,
            clientY: event.clientY,
            bubbles: false,
          }),
        );
      };

      window.addEventListener("pointermove", forward, { passive: true });
      window.addEventListener("pointerdown", forward, { passive: true });
      detachForwarding = () => {
        window.removeEventListener("pointermove", forward);
        window.removeEventListener("pointerdown", forward);
      };
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", sizeCanvas);
      detachForwarding?.();
    };
  }, [enabled]);

  if (!enabled) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_48%_at_54%_30%,rgba(59,30,255,0.16),transparent_70%)]"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [filter:invert(1)]"
    />
  );
}
