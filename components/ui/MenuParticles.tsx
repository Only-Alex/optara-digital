"use client";

import { useEffect, useRef } from "react";

/**
 * Curl-field particle silk around the open mega menu — ink in water, in the
 * brand indigo, after the reference clip's flowing filament look.
 *
 * Canvas 2D, not WebGL: the hero owns the page's only WebGL loop (§11), and
 * ~1,600 particles advected through a smooth flow field is comfortably within
 * 2D canvas budget. The rAF loop here is legitimate hand-rolling — a particle
 * sim is not something `motion` can orchestrate — and it is bounded on every
 * side: mounts with the panel, cancels on unmount, pauses when the tab is
 * hidden, caps device pixel ratio at 1.75, and skips runaway frames.
 *
 * Trails come from fading the canvas with destination-out each frame, so the
 * particles paint accumulating indigo silk rather than dots.
 */

const COUNT = 1000;
const MAX_DPR = 1.75;

// Draws are batched by quantised alpha so a frame costs a handful of fill
// calls rather than a thousand fillStyle changes.
const BUCKETS = [0.03, 0.06, 0.09, 0.12, 0.15];
const FILLS = BUCKETS.map((a) => `rgba(91, 61, 245,${a})`);

type P = { x: number; y: number; age: number; max: number; drift: number };

function spawn(p: P, w: number, h: number) {
  // Weighted to the panel's top rim, where vapour would rise from.
  const r = Math.random();
  if (r < 0.5) {
    p.x = w * (0.12 + Math.random() * 0.76);
    p.y = h * (0.08 + Math.random() * 0.1);
  } else if (r < 0.75) {
    p.x = w * (Math.random() < 0.5 ? 0.06 : 0.94) + (Math.random() - 0.5) * 20;
    p.y = h * (0.15 + Math.random() * 0.55);
  } else {
    p.x = w * (0.15 + Math.random() * 0.7);
    p.y = h * (0.86 + Math.random() * 0.08);
  }
  p.age = 0;
  p.max = 90 + Math.random() * 140;
  p.drift = 0.5 + Math.random();
}

export function MenuParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    const particles: P[] = Array.from({ length: COUNT }, () => {
      const p = { x: 0, y: 0, age: 0, max: 0, drift: 1 };
      spawn(p, w, h);
      p.age = Math.random() * p.max; // desynchronise the first generation
      return p;
    });

    let raf = 0;
    let last = performance.now();
    let t = 0;
    let running = true;

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    function tick(now: number) {
      if (!running || !ctx) return;
      const dt = Math.min((now - last) / 16.7, 3); // cap runaway frames
      last = now;
      t += dt * 0.016;

      // Fade what is already painted — this is what turns dots into silk.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.075)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const batches: number[][] = [[], [], [], [], []];

      for (const p of particles) {
        // Smooth pseudo-curl flow field: layered sines give divergence-free
        // -looking swirls without per-frame noise generation.
        const a =
          Math.sin(p.y * 0.011 + t * 0.9) * 1.9 +
          Math.cos(p.x * 0.008 - t * 0.6) * 1.4 +
          Math.sin((p.x + p.y) * 0.004 + t * 0.35) * 1.1;
        const speed = p.drift * dt;
        p.x += Math.cos(a) * speed * 1.15;
        p.y += Math.sin(a) * speed - 0.22 * dt; // slight rise, like smoke
        p.age += dt;

        if (p.age > p.max || p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) {
          spawn(p, w, h);
          continue;
        }

        // Fade in over the first fifth of life, out over the last third.
        const lifeIn = Math.min(p.age / (p.max * 0.2), 1);
        const lifeOut = Math.min((p.max - p.age) / (p.max * 0.33), 1);
        const alpha = 0.15 * lifeIn * lifeOut;

        const bucket = Math.min(4, (alpha * 33.3) | 0);
        batches[bucket].push(p.x, p.y);
      }

      for (let b = 0; b < 5; b++) {
        const pts = batches[b];
        if (pts.length === 0) continue;
        ctx.fillStyle = FILLS[b];
        for (let i = 0; i < pts.length; i += 2) {
          ctx.fillRect(pts[i], pts[i + 1], 1.4, 1.4);
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-14 -top-8 bottom-[-2.5rem] h-[calc(100%+4.5rem)] w-[calc(100%+7rem)]"
      // Dissolve toward the canvas boundary so silk fades out rather than
      // hitting a hard clipped edge.
      style={{
        maskImage:
          "radial-gradient(115% 115% at 50% 35%, black 55%, transparent 96%)",
        WebkitMaskImage:
          "radial-gradient(115% 115% at 50% 35%, black 55%, transparent 96%)",
      }}
    />
  );
}
