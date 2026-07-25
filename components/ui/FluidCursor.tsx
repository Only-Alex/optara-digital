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

    // Claim the context first so it keeps its drawing buffer. getContext is
    // idempotent, so the library reuses this one and its attributes win. This
    // makes the canvas readable back for verification and screenshots.
    canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: false,
        AUTO: false,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 4.2,
        VELOCITY_DISSIPATION: 0.5,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        COLORFUL: false,
        // Rendered bright-on-black then CSS-inverted, so this is indigo's
        // complement. Because of the inversion, a DIM splat is FAINT ink:
        // black inverts to white paper. Keep these values low.
        SPLAT_COLOR: { r: 0.26, g: 0.3, b: 0.0 },
        SHADING: true,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        // Bloom is what gives the lit-up core under the pointer.
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        // Kept low with a high threshold so only the densest core under the
        // pointer lights up, instead of washing the whole hero.
        BLOOM_INTENSITY: 0.45,
        BLOOM_THRESHOLD: 0.82,
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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-65 [filter:invert(1)_saturate(1.45)]"
    />
  );
}
