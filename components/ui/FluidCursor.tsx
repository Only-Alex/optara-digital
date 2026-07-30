"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/* ------------------------------------------------------------------ *
 * Colour
 *
 * The canvas renders bright-on-black and is CSS-inverted, so every value
 * handed to the simulation is the complement of what the visitor sees.
 * Writing the brand colours as what they should LOOK like and converting
 * once keeps the intent readable — and keeps them tied to the logo.
 *
 * rendered = k · (1 − displayed) makes `k` a clean density dial: at 0 the
 * splat inverts to pure white paper, at 1 it lands exactly on the brand
 * colour, and every value between is a linear blend towards it. That is
 * what lets the origin be soft without washing the hue out.
 * ------------------------------------------------------------------ */

type Rgb = { r: number; g: number; b: number };

/** Logo gradient ends and the tone between them, as they appear on paper. */
const BRAND = {
  blue: { r: 0.169, g: 0.498, b: 1.0 }, // #2B7FFF
  violet: { r: 0.357, g: 0.239, b: 0.961 }, // #5B3DF5
  purple: { r: 0.482, g: 0.184, b: 0.969 }, // #7B2FF7
} as const;

const mix = (a: Rgb, b: Rgb, t: number): Rgb => ({
  r: a.r + (b.r - a.r) * t,
  g: a.g + (b.g - a.g) * t,
  b: a.b + (b.b - a.b) * t,
});

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/**
 * Density of the injected splat. Deliberately low: the old value put an
 * opaque blob directly under the pointer. The trail now reads because it
 * lingers, not because more colour goes in.
 */
const DENSITY_BASE = 0.3;
/** How much a fast pointer may brighten the splat, so movement leads. */
const DENSITY_SPEED = 0.16;

/**
 * Jitter guard: distance is accumulated rather than dropped, so a slow
 * drag still splats — just less often — instead of falling under a
 * threshold and producing no smoke at all.
 */
const MIN_STEP = 2.5;
/**
 * A jump larger than this is not a flick, it is the pointer re-entering
 * the window or crossing a monitor. Re-seed instead of splatting, so the
 * simulation never takes one enormous impulse.
 */
const JUMP = 260;

export function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    if (!canvas) return;

    let cancelled = false;
    let detach: (() => void) | undefined;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      // Sets the backing store before the library initialises. Measured
      // caveat: webgl-fluid resizes the canvas itself each frame at the
      // device's own pixel ratio, so this cap only holds until the first
      // simulation frame. The simulation cost is bounded by SIM_RESOLUTION
      // and DYE_RESOLUTION instead, which the library does respect.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // Claim the context first so it keeps its drawing buffer.
    canvas.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    // The library reads config.SPLAT_COLOR on every splat and copies its
    // channels, so this object stays live: mutating it re-tints the smoke
    // without touching the library or re-initialising the simulation.
    const splatColor: Rgb = { r: 0, g: 0, b: 0 };

    import("webgl-fluid").then(({ default: WebGLFluid }) => {
      if (cancelled) return;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: false,
        AUTO: false,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        // Lower than before, so a trail stays legible for longer and can
        // travel across the hero rather than fading a hand's width behind
        // the pointer.
        DENSITY_DISSIPATION: 2.6,
        // Lower again: velocity is what carries the smoke, so this is the
        // dial that actually lengthens the trail.
        VELOCITY_DISSIPATION: 0.3,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        // Softened from 30: fewer tight knots, longer elegant curls.
        CURL: 22,
        // Wider but much fainter than before — feathered across a larger
        // area instead of concentrated into a disc.
        SPLAT_RADIUS: 0.28,
        SPLAT_FORCE: 7200,
        COLORFUL: false,
        SPLAT_COLOR: splatColor,
        SHADING: true,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        // Pulled back with a higher threshold: bloom was part of what made
        // the origin read as a solid core.
        BLOOM_INTENSITY: 0.3,
        BLOOM_THRESHOLD: 0.86,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      /* ---- pointer ------------------------------------------------- */

      let lastX = 0;
      let lastY = 0;
      let seeded = false;
      let speed = 0; // px per event, smoothed
      let pending = 0; // accumulated distance below the jitter threshold
      let lastMove = 0;
      // Target and eased glow position, so the light follows without jitter.
      let targetX = 0;
      let targetY = 0;
      let glowX = 0;
      let glowY = 0;
      let glowAlpha = 0;
      let inside = false;

      const forward = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const x = event.clientX;
        const y = event.clientY;

        if (!seeded) {
          lastX = x;
          lastY = y;
          glowX = x;
          glowY = y;
          seeded = true;
        }

        const step = Math.hypot(x - lastX, y - lastY);
        lastX = x;
        lastY = y;
        targetX = x;
        targetY = y;
        lastMove = performance.now();
        inside = true;

        // Re-entering the window looks like one huge move; seed the new
        // position rather than dragging a splat across the whole hero.
        if (step > JUMP) {
          pending = 0;
          return;
        }

        // Accumulate instead of discarding, so slow movement still draws.
        pending += step;
        if (pending < MIN_STEP && event.type !== "pointerdown") return;
        pending = 0;

        speed += (step - speed) * 0.25;

        // The real position is always forwarded: clamping it here would
        // leave the smoke trailing behind the cursor after a fast drag.
        canvas.dispatchEvent(
          new MouseEvent(
            event.type === "pointerdown" ? "mousedown" : "mousemove",
            { clientX: x, clientY: y, bubbles: false },
          ),
        );
      };

      const onLeave = () => {
        inside = false;
      };

      window.addEventListener("pointermove", forward, { passive: true });
      window.addEventListener("pointerdown", forward, { passive: true });
      document.addEventListener("pointerleave", onLeave);

      /* ---- colour and glow loop ------------------------------------ */

      let raf = 0;
      let running = true;

      const tick = (now: number) => {
        if (!running) return;

        // Primary tone eases between the logo's blue and violet; purple
        // rides in underneath as a slower, smaller accent, so the smoke
        // reads as one family rather than cycling.
        const swing = (Math.sin(now / 4200) + 1) / 2;
        const accent = (Math.sin(now / 9700) + 1) / 2;
        const tone = mix(
          mix(BRAND.blue, BRAND.violet, swing),
          BRAND.purple,
          accent * 0.35,
        );

        // Brighter where the movement is, fading back as the pointer eases.
        const idle = now - lastMove;
        const moving = clamp(1 - idle / 260, 0, 1);
        speed *= 0.94;
        const density =
          DENSITY_BASE + DENSITY_SPEED * clamp(speed / 90, 0, 1) * moving;

        splatColor.r = density * (1 - tone.r);
        splatColor.g = density * (1 - tone.g);
        splatColor.b = density * (1 - tone.b);

        if (glow) {
          // Eased follow: close enough to feel attached to the pointer,
          // smooth enough never to jitter.
          glowX += (targetX - glowX) * 0.16;
          glowY += (targetY - glowY) * 0.16;
          // Falls away when the pointer rests or leaves, so no coloured
          // stain is left sitting on the hero.
          const want = inside ? clamp(1 - idle / 900, 0.18, 1) : 0;
          glowAlpha += (want - glowAlpha) * 0.07;

          const rect = canvas.getBoundingClientRect();
          glow.style.setProperty("--gx", `${glowX - rect.left}px`);
          glow.style.setProperty("--gy", `${glowY - rect.top}px`);
          glow.style.setProperty("--ga", glowAlpha.toFixed(3));
          glow.style.setProperty(
            "--gc",
            `${Math.round(tone.r * 255)} ${Math.round(tone.g * 255)} ${Math.round(tone.b * 255)}`,
          );
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      /* ---- offscreen and hidden-tab pause -------------------------- */

      // The library exposes no pause setter, only a window keydown that
      // toggles PAUSED on KeyP. Tracked locally because it is a toggle: a
      // visitor pressing P can desync it for one cycle, which self-corrects
      // on the next visibility change.
      let simPaused = false;
      const setPaused = (paused: boolean) => {
        if (paused === simPaused) return;
        simPaused = paused;
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyP" }));
      };

      let offscreen = false;
      let hidden = false;
      const apply = () => {
        const stop = offscreen || hidden;
        setPaused(stop);
        if (stop && running) {
          running = false;
          cancelAnimationFrame(raf);
        } else if (!stop && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      };

      const visibility = new IntersectionObserver(
        ([entry]) => {
          offscreen = !entry.isIntersecting;
          apply();
        },
        { threshold: 0 },
      );
      visibility.observe(canvas);

      const onVisibility = () => {
        hidden = document.hidden;
        apply();
      };
      document.addEventListener("visibilitychange", onVisibility);

      detach = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", forward);
        window.removeEventListener("pointerdown", forward);
        document.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", onVisibility);
        visibility.disconnect();
        setPaused(false);
      };
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", sizeCanvas);
      detach?.();
    };
  }, [enabled]);

  if (!enabled) {
    // Touch and reduced-motion get the settled atmosphere rather than a
    // simulation: same brand light, no pointer loop, no WebGL context.
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_48%_at_54%_30%,rgba(91,61,245,0.14),transparent_70%)]"
      />
    );
  }

  return (
    <>
      {/* Local illumination: reflected light from the smoke, sitting on the
          paper beneath the canvas and the ghost wordmark so it lifts the
          environment without ever washing over the hero's text. */}
      <div
        ref={glowRef}
        aria-hidden="true"
        // --gr scales the pool with the hero: a 340px circle that reads as
        // ambient light on a desktop would read as a spotlight on a phone.
        className="pointer-events-none absolute inset-0 [--gr:clamp(170px,24vw,380px)]"
        style={{
          background:
            "radial-gradient(circle var(--gr, 340px) at var(--gx, 50%) var(--gy, 40%), rgb(var(--gc, 91 61 245) / calc(var(--ga, 0) * 0.11)), rgb(var(--gc, 91 61 245) / calc(var(--ga, 0) * 0.045)) 42%, transparent 72%)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65 [filter:invert(1)_saturate(1.25)]"
      />
    </>
  );
}
