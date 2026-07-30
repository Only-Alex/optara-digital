"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  /**
   * Local illumination on the paper around the pointer — reflected light
   * from the smoke, not a spotlight.
   *
   * Kept in its own effect, with its own listener and loop and no state
   * shared with the simulation, so the glow can never interfere with the
   * smoke. Position and opacity travel as CSS custom properties, so nothing
   * re-renders per frame.
   */
  useEffect(() => {
    if (!enabled) return;
    const glow = glowRef.current;
    if (!glow) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let alpha = 0;
    let seeded = false;
    let inside = false;
    let lastMove = 0;
    let raf = 0;
    let running = true;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!seeded) {
        x = targetX;
        y = targetY;
        seeded = true;
      }
      inside = true;
      lastMove = performance.now();
    };
    const onLeave = () => {
      inside = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    const tick = (now: number) => {
      if (!running) return;
      // Eased follow: attached enough to read as the cursor's own light,
      // smooth enough never to jitter.
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      // Falls to a floor when the pointer rests and to nothing when it
      // leaves, so no coloured stain is left sitting on the hero.
      const idle = now - lastMove;
      const want = inside ? Math.max(0.16, 1 - idle / 900) : 0;
      alpha += (want - alpha) * 0.07;

      const rect = glow.getBoundingClientRect();
      glow.style.setProperty("--gx", `${x - rect.left}px`);
      glow.style.setProperty("--gy", `${y - rect.top}px`);
      glow.style.setProperty("--ga", alpha.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Stop the loop when the hero is not on screen or the tab is hidden.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && !document.hidden;
        if (visible && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(glow);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let detachForwarding: (() => void) | undefined;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // 1.75, not 2: the §11 ceiling for expensive WebGL surfaces. On a 3x
      // phone-class display this is ~23% fewer pixels through the whole
      // simulation chain with no visible loss in the smoke.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
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
        // Lowered so a trail stays legible for longer and can travel across
        // the hero instead of fading a hand's width behind the pointer.
        DENSITY_DISSIPATION: 2.6,
        // Velocity is what actually carries the smoke, so this is the dial
        // that lengthens the trail rather than thickening it.
        VELOCITY_DISSIPATION: 0.3,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        // Softened from 30: longer, more elegant curls, fewer tight knots.
        CURL: 22,
        // Wider but much fainter than before, so the smoke is feathered over
        // a larger area instead of concentrated into a disc at the origin.
        SPLAT_RADIUS: 0.28,
        SPLAT_FORCE: 7200,
        COLORFUL: false,
        // Rendered bright-on-black then CSS-inverted, so this is the
        // complement of what the visitor sees. Because of the inversion, a
        // DIM splat is FAINT ink: black inverts to white paper.
        //
        // Derived from the logo rather than picked by hand. Taking the
        // gradient's blue #2B7FFF and violet #5B3DF5, their midpoint is
        // (0.263, 0.369, 0.980); the complement of that is what goes in,
        // scaled by 0.62 to soften the origin — the old value put an opaque
        // core under the pointer. Lower scale means paler ink, and because
        // the whole vector scales together the hue stays put.
        SPLAT_COLOR: { r: 0.457, g: 0.391, b: 0.012 },
        SHADING: true,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        // Bloom is what gives the lit-up core under the pointer.
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        // Kept low with a high threshold so only the densest core under the
        // pointer lights up, instead of washing the whole hero.
        BLOOM_INTENSITY: 0.3,
        BLOOM_THRESHOLD: 0.86,
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

      // Offscreen pause. The library keeps its private merged config, but it
      // also installs a window keydown listener that toggles PAUSED on KeyP —
      // the only runtime pause hook it exposes. A paused sim skips the whole
      // simulation step each frame, so scrolling past the hero stops the GPU
      // work. Tracked locally because the control is a toggle, not a setter;
      // a visitor pressing P themselves can desync it for one cycle, which
      // self-corrects on the next visibility change. Hidden-tab pause needs
      // nothing: the loop is requestAnimationFrame-driven, and browsers halt
      // rAF in hidden tabs.
      let simPaused = false;
      const setPaused = (paused: boolean) => {
        if (paused === simPaused) return;
        simPaused = paused;
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyP" }));
      };
      const visibility = new IntersectionObserver(
        ([entry]) => setPaused(!entry.isIntersecting),
        { threshold: 0 },
      );
      visibility.observe(canvas);

      detachForwarding = () => {
        window.removeEventListener("pointermove", forward);
        window.removeEventListener("pointerdown", forward);
        visibility.disconnect();
        setPaused(false);
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_48%_at_54%_30%,rgba(91,61,245,0.14),transparent_70%)]"
      />
    );
  }

  return (
    <>
      {/* Sits on the paper beneath the canvas and the ghost wordmark, so it
          lifts the surroundings without ever washing over the hero's text.
          Radius scales with the viewport: a pool that reads as ambient light
          on a desktop would read as a spotlight on a phone. */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [--gr:clamp(170px,24vw,380px)]"
        style={{
          background:
            "radial-gradient(circle var(--gr) at var(--gx, 50%) var(--gy, 40%), rgb(91 61 245 / calc(var(--ga, 0) * 0.11)), rgb(43 127 255 / calc(var(--ga, 0) * 0.05)) 45%, transparent 72%)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65 [filter:invert(1)_saturate(1.3)]"
      />
    </>
  );
}
