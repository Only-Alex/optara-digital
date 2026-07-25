"use client";

import { useEffect, useRef, useState } from "react";
import { createFluid, defaultConfig } from "@/lib/fluid/engine";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      return true;
    };

    resizeCanvas();

    const fluid = createFluid(canvas, { ...defaultConfig });
    if (!fluid) {
      setFailed(true);
      return;
    }

    const palette = fluid.config.palette;
    let colorIndex = Math.floor(Math.random() * palette.length);
    let colorTimer = 0;

    const pointer = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      moved: false,
      down: false,
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) return;
      pointer.dx = (x - pointer.x) * fluid.config.splatForce;
      pointer.dy = (y - pointer.y) * fluid.config.splatForce;
      pointer.x = x;
      pointer.y = y;
      pointer.moved = true;
    };

    const onPointerDown = () => {
      pointer.down = true;
    };
    const onPointerUp = () => {
      pointer.down = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });

    const onResize = () => {
      if (resizeCanvas()) fluid.resize();
    };
    window.addEventListener("resize", onResize);

    let last = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.016666);
      last = now;

      colorTimer += dt;
      if (colorTimer > 2.6) {
        colorTimer = 0;
        colorIndex = (colorIndex + 1) % palette.length;
      }

      if (pointer.moved) {
        pointer.moved = false;
        const boost = pointer.down ? 1.6 : 1;
        const color = palette[colorIndex];
        fluid.splat(pointer.x, pointer.y, pointer.dx, pointer.dy, [
          color[0] * boost,
          color[1] * boost,
          color[2] * boost,
        ]);
      }

      fluid.step(dt);
      fluid.render();
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      fluid.destroy();
    };
  }, [enabled]);

  if (!enabled || failed) {
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
      className="pointer-events-none absolute inset-0 h-full w-full [mix-blend-mode:multiply]"
    />
  );
}
