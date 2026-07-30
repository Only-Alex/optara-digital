"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The three brightest colours in the logo, as the visitor SEES them. The deep
 * accent (#3A22C9) is left out on purpose: it is the shadow end of the brand
 * and reads as grime rather than light in smoke.
 */
const BRAND_RAMP = [
  [43, 127, 255], // blue   #2B7FFF
  [91, 61, 245], // violet #5B3DF5
  [123, 47, 247], // purple #7B2FF7
] as const;

/** Seconds for one pass along the ramp and back. Slow enough not to read as a loop. */
const RAMP_PERIOD = 16;

/**
 * How much brand colour a single splat carries, 0 = white paper, 1 = full.
 *
 * The canvas renders bright-on-black and is CSS-inverted, so the simulation is
 * fed the COMPLEMENT of what is seen. Displayed = (1 - k) + k * brand, so this
 * is a clean white-to-brand tint dial: lower k is paler ink at the same hue.
 */
const INK = 0.24;

/**
 * Minimum pointer travel between splats, in CSS pixels.
 *
 * This is the dial that actually softens the injection point, and it took
 * measurement to find. Dye accumulates and clips, and the pile-up is driven by
 * splats per unit of PATH, not per unit of time — so a pointer that dwells or
 * drifts slowly used to stack dozens of splats on one spot and pin it to fully
 * solid. Gating on distance caps how much ink can ever land in one place while
 * leaving a fast sweep untouched, since its moves are already farther apart
 * than the gate. Lowering the per-splat colour alone could never do this: the
 * pile-up simply refills to the same ceiling.
 */
const SPLAT_GAP = 13;

/**
 * The ramp colour at absolute time `now`, as displayed RGB.
 *
 * Driven from the wall clock and nothing else, so the smoke and the glow stay
 * in step without sharing any state — they just read the same function.
 */
function rampAt(now: number): [number, number, number] {
  const phase = (now / (RAMP_PERIOD * 1000)) % 1;
  // Ping-pong, so the ends meet and the sequence never jumps purple to blue.
  const bounced = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
  const span = bounced * (BRAND_RAMP.length - 1);
  const index = Math.min(Math.floor(span), BRAND_RAMP.length - 2);
  const mix = span - index;
  const from = BRAND_RAMP[index];
  const to = BRAND_RAMP[index + 1];
  return [
    from[0] + (to[0] - from[0]) * mix,
    from[1] + (to[1] - from[1]) * mix,
    from[2] + (to[2] - from[2]) * mix,
  ];
}

export function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  /**
   * Local illumination on the paper around the pointer — light thrown off by
   * the smoke, so it carries the smoke's current colour off the same ramp.
   *
   * Kept in its own effect, with its own listener and loop and no state shared
   * with the simulation, so it can never disturb the smoke. Position, colour
   * and opacity all travel as CSS custom properties, so nothing re-renders.
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
      // Falls to a floor when the pointer rests and to nothing when it leaves,
      // so no coloured stain is left sitting on the hero.
      const idle = now - lastMove;
      const want = inside ? Math.max(0.3, 1 - idle / 900) : 0;
      alpha += (want - alpha) * 0.07;

      const [r, g, b] = rampAt(now);
      const rect = glow.getBoundingClientRect();
      glow.style.setProperty("--gx", `${x - rect.left}px`);
      glow.style.setProperty("--gy", `${y - rect.top}px`);
      glow.style.setProperty("--ga", alpha.toFixed(3));
      glow.style.setProperty("--gc", `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`);
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

      // Handed to the library and then mutated in place. Its config merge is
      // shallow, so this exact object is what it reads back on every refresh.
      const splatColor = { r: 0, g: 0, b: 0 };
      const paintRamp = () => {
        const [r, g, b] = rampAt(performance.now());
        // Complement, because of the CSS inversion, scaled to the ink strength.
        splatColor.r = (1 - r / 255) * INK;
        splatColor.g = (1 - g / 255) * INK;
        splatColor.b = (1 - b / 255) * INK;
      };
      paintRamp();

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: false,
        AUTO: false,
        SIM_RESOLUTION: 128,
        // Raised from 1024. A finer dye grid means less numerical smearing, so
        // filaments hold their edges instead of blurring outward as they age —
        // compactness bought without touching the flow itself.
        DYE_RESOLUTION: 1280,
        // Lowered from 4.2 so a stroke stays legible long enough to travel,
        // but nowhere near as low as the previous attempt: below about 2 the
        // hero holds a visible haze for seconds after the pointer has left.
        DENSITY_DISSIPATION: 2.2,
        // Velocity is what carries the smoke, so this is the dial that
        // lengthens a trail instead of thickening it. Low, because with the
        // gentler force below there is less momentum to begin with and it has
        // to persist for the trail to keep travelling.
        VELOCITY_DISSIPATION: 0.12,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        // Barely softened from 30. The previous attempt dropped this to 15 and
        // lost the fine filaments that make it read as smoke rather than dye.
        CURL: 20,
        // Only slightly wider than the original 0.2. Both directions were
        // measured: at 0.5+ the smoke turns into rolling blobs, and at 0.18 the
        // dye volume — which goes with the SQUARE of this — drops so far that
        // the trail breaks up and its reach collapsed to 288px.
        SPLAT_RADIUS: 0.24,
        // Down from 7600, and this is what makes the smoke compact. Force is
        // momentum injected into the fluid, and it was the thing throwing dye
        // wide of the pointer's path: cutting it took the trail 23% narrower
        // and 26% FARTHER at the same time, because dye that stays coherent
        // outlives dye that gets blasted apart. Not lower, though — measured at
        // 3000 there is too little momentum to carry dye away at all, so it
        // pools around the pointer and spreads worse than it started.
        SPLAT_FORCE: 4200,
        // With SPLAT_COLOR set this is NOT random rainbow — Z() returns our own
        // colour. It is the only hook the library exposes for re-reading
        // SPLAT_COLOR after init, and it is what lets the ramp work at all: a
        // pointer is otherwise assigned its colour once, at construction.
        COLORFUL: true,
        // How often the library re-reads SPLAT_COLOR, ~10x/sec, so the hue
        // shifts along a trail rather than stepping.
        COLOR_UPDATE_SPEED: 10,
        SPLAT_COLOR: splatColor,
        SHADING: true,
        TRANSPARENT: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        // Pulled back behind a higher threshold. Bloom lit the densest pixels
        // under the pointer into a solid centre, so it was half of the problem
        // the brief describes.
        BLOOM_INTENSITY: 0.26,
        BLOOM_THRESHOLD: 0.88,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false,
      });

      // The library listens on the canvas itself, but the canvas must stay
      // pointer-events:none so the hero's links stay clickable. Forward window
      // pointer movement to it instead; offsetX/offsetY resolve from clientX/Y.
      //
      // The distance gate lives here: a move closer than SPLAT_GAP to the last
      // splat is dropped rather than forwarded. See the constant for why.
      let lastX: number | null = null;
      let lastY: number | null = null;
      const forward = (event: PointerEvent) => {
        if (event.type === "pointermove") {
          if (lastX !== null && lastY !== null) {
            const dx = event.clientX - lastX;
            const dy = event.clientY - lastY;
            if (dx * dx + dy * dy < SPLAT_GAP * SPLAT_GAP) return;
          }
          lastX = event.clientX;
          lastY = event.clientY;
        }
        paintRamp();
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_48%_at_54%_30%,rgba(91,61,245,0.16),transparent_70%)]"
      />
    );
  }

  return (
    <>
      {/* Sits on the paper beneath the canvas and the ghost wordmark, so it
          lifts the surroundings without ever washing over the hero's text.
          Takes its colour from --gc, the same ramp the smoke is using, so the
          paper glows in whatever the cursor is currently giving off. Radius
          scales with the viewport: a pool that reads as ambient light on a
          desktop would read as a spotlight on a phone. */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [--gr:clamp(180px,25vw,400px)]"
        style={{
          background:
            "radial-gradient(circle var(--gr) at var(--gx, 50%) var(--gy, 40%), rgb(var(--gc, 91 61 245) / calc(var(--ga, 0) * 0.30)), rgb(var(--gc, 91 61 245) / calc(var(--ga, 0) * 0.13)) 48%, transparent 74%)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65 [filter:invert(1)_saturate(1.45)]"
      />
    </>
  );
}
