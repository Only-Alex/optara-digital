"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  hue: number;
};

const MAX_BLOBS = 240;
const SPAWN_PER_FRAME = 4;
const AMBIENT_EVERY = 7;

export function InkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const blobs: Blob[] = [];
    const pointer = { x: width * 0.5, y: height * 0.4, active: false };
    const eased = { x: pointer.x, y: pointer.y };
    let last = { x: eased.x, y: eased.y };

    const seed = (count: number) => {
      for (let i = 0; i < count; i += 1) {
        blobs.push({
          x: width * (0.35 + Math.random() * 0.3),
          y: height * (0.2 + Math.random() * 0.3),
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.12 - Math.random() * 0.2,
          radius: 90 + Math.random() * 160,
          life: 0.35 + Math.random() * 0.5,
          hue: Math.random(),
        });
      }
    };

    seed(45);

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    if (enabled) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    let frame = 0;
    let tick = 0;

    const render = () => {
      eased.x += (pointer.x - eased.x) * 0.12;
      eased.y += (pointer.y - eased.y) * 0.12;

      const dx = eased.x - last.x;
      const dy = eased.y - last.y;
      const speed = Math.hypot(dx, dy);
      last = { x: eased.x, y: eased.y };

      if (pointer.active) {
        const spawn = Math.min(SPAWN_PER_FRAME + Math.round(speed / 6), 8);
        for (let i = 0; i < spawn; i += 1) {
          blobs.push({
            x: eased.x + (Math.random() - 0.5) * 26,
            y: eased.y + (Math.random() - 0.5) * 26,
            vx: dx * 0.16 + (Math.random() - 0.5) * 0.7,
            vy: dy * 0.16 + (Math.random() - 0.5) * 0.7 - 0.18,
            radius: 54 + Math.random() * 120 + speed * 1.8,
            life: 1,
            hue: Math.random(),
          });
        }
      }

      if (tick % AMBIENT_EVERY === 0) {
        blobs.push({
          x: width * (0.34 + Math.random() * 0.32),
          y: height * (0.24 + Math.random() * 0.34),
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.14 - Math.random() * 0.22,
          radius: 80 + Math.random() * 150,
          life: 0.55 + Math.random() * 0.45,
          hue: Math.random(),
        });
      }
      tick += 1;

      while (blobs.length > MAX_BLOBS) blobs.shift();

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      for (let i = blobs.length - 1; i >= 0; i -= 1) {
        const blob = blobs[i];
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.vy -= 0.006;
        blob.vx *= 0.99;
        blob.vy *= 0.99;
        blob.radius += 0.95;
        blob.life -= 0.0055;

        if (blob.life <= 0) {
          blobs.splice(i, 1);
          continue;
        }

        const alpha = Math.max(blob.life, 0) * 0.24;
        const gradient = context.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius,
        );
        const light = blob.hue > 0.55;
        const core = light ? "94, 68, 255" : "40, 16, 200";
        gradient.addColorStop(0, `rgba(${core}, ${alpha})`);
        gradient.addColorStop(0.45, `rgba(${core}, ${alpha * 0.45})`);
        gradient.addColorStop(1, "rgba(59, 30, 255, 0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(render);
    };

    if (reduced) {
      context.clearRect(0, 0, width, height);
    } else {
      frame = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled, reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_55%_28%,rgba(59,30,255,0.16),transparent_70%)]"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [filter:blur(42px)saturate(1.3)] [mix-blend-mode:multiply]"
    />
  );
}
