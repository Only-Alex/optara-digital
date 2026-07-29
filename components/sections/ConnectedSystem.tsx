"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { connectedSystem, type Discipline } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealText } from "@/components/ui/RevealText";

/* ------------------------------------------------------------------ *
 * Geometry
 *
 * The scene is drawn in one fixed coordinate space and the stage box is
 * given the matching aspect ratio, so SVG units and HTML percentages map
 * to the same pixels. That is what lets the orbital paths (SVG) and the
 * discipline labels (real HTML text) stay locked together at any width.
 * ------------------------------------------------------------------ */

const VIEW = { w: 1900, h: 900 };
const CENTRE = { x: 950, y: 450 };
const SCENE_R = 430;
const CORE_R = 146;

type Orbit = {
  /** Multiple of the scene radius. */
  radius: number;
  /** Degrees tipped away from the viewer. Higher is flatter. */
  tilt: number;
  /** Degrees of roll in the picture plane. */
  roll: number;
  /** Depth plane, in px, inside the stage's perspective. */
  z: number;
};

// Three coordinated planes rather than one flat ellipse: different radii,
// tilts and roll, so the system reads as architecture seen in perspective
// instead of a diagram. `mid` is deliberately the flattest — flat enough
// that it crosses the core's face, which is what sells the depth: its far
// half is hidden behind the core and its near half draws across the front.
const ORBITS: Record<Discipline["orbit"], Orbit> = {
  back: { radius: 1.62, tilt: 66, roll: 7, z: -64 },
  mid: { radius: 1.36, tilt: 79, roll: -4, z: 0 },
  front: { radius: 1.48, tilt: 62, roll: 11, z: 54 },
};

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Where a seat on an orbit lands on screen, in view units. */
function seat(orbit: Orbit, angle: number) {
  const a = rad(angle);
  const t = rad(orbit.tilt);
  const r = rad(orbit.roll);
  const radius = SCENE_R * orbit.radius;
  // A circle tipped away from the viewer projects to an ellipse: full width
  // across, width × cos(tilt) down. Roll then turns the whole ellipse.
  const x = radius * Math.cos(a);
  const y = -radius * Math.sin(a) * Math.cos(t);
  return {
    x: CENTRE.x + x * Math.cos(r) - y * Math.sin(r),
    y: CENTRE.y + x * Math.sin(r) + y * Math.cos(r),
  };
}

const px = (value: number) => `${(value / VIEW.w) * 100}%`;
const py = (value: number) => `${(value / VIEW.h) * 100}%`;

/** Half of an orbit as an arc command: the far half runs over the top. */
function arc(orbit: Orbit, half: "far" | "near") {
  const a = SCENE_R * orbit.radius;
  const b = a * Math.cos(rad(orbit.tilt));
  const { x, y } = CENTRE;
  return half === "far"
    ? `M ${x - a} ${y} A ${a} ${b} 0 0 1 ${x + a} ${y}`
    : `M ${x + a} ${y} A ${a} ${b} 0 0 1 ${x - a} ${y}`;
}

/* ------------------------------------------------------------------ *
 * Entrance timeline, expressed once as named windows on 0 → 1.
 * ------------------------------------------------------------------ */

const CUE = {
  core: [0, 0.2],
  ring: { back: [0.1, 0.42], mid: [0.18, 0.5], front: [0.26, 0.58] },
  nodeFirst: 0.34,
  nodeStep: 0.055,
  nodeSpan: 0.16,
  signal: [0.58, 0.86],
  signalIn: [0.86, 0.94],
  land: [0.86, 0.93, 1],
} as const;

// Nodes wake from the back plane forward, so the sequence reads as depth
// rather than as a clockwise sweep.
const DEPTH_ORDER: Discipline["orbit"][] = ["back", "mid", "front"];

/* ------------------------------------------------------------------ *
 * Layers
 * ------------------------------------------------------------------ */

function Layer({
  z,
  children,
  className,
}: {
  z: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      // --depth flattens the whole stack on tablet without changing any of
      // the geometry maths.
      style={{
        transform: `translateZ(calc(var(--depth) * ${z}px))`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

function Plane({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="none"
    >
      {children}
    </svg>
  );
}

/** One orbital path. Contrast, not thickness, carries the depth hierarchy. */
function Ring({
  orbit,
  half,
  opacity,
  width,
  progress,
  window: cue,
}: {
  orbit: Orbit;
  half?: "far" | "near";
  opacity: number;
  width: number;
  progress: MotionValue<number>;
  window: readonly [number, number] | number[];
}) {
  const reveal = useTransform(progress, [cue[0], cue[1]], [0, opacity]);
  const grow = useTransform(progress, [cue[0], cue[1]], [0.94, 1]);
  const a = SCENE_R * orbit.radius;
  const b = a * Math.cos(rad(orbit.tilt));

  return (
    <motion.g style={{ opacity: reveal, scale: grow, originX: "950px", originY: "450px" }}>
      {half ? (
        <path
          d={arc(orbit, half)}
          fill="none"
          stroke="var(--accent-fg)"
          strokeWidth={width}
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <ellipse
          cx={CENTRE.x}
          cy={CENTRE.y}
          rx={a}
          ry={b}
          transform={`rotate(${orbit.roll} ${CENTRE.x} ${CENTRE.y})`}
          fill="none"
          stroke="var(--accent-fg)"
          strokeWidth={width}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </motion.g>
  );
}

/** A discipline's line in to the core. Subtle until its node is active. */
function Connector({
  point,
  order,
  active,
  progress,
}: {
  point: { x: number; y: number };
  order: number;
  active: boolean;
  progress: MotionValue<number>;
}) {
  const start = CUE.nodeFirst + order * CUE.nodeStep;
  const reveal = useTransform(progress, [start + 0.12, start + 0.3], [0, 1]);

  // Stops at the core's edge, so no line ever crosses the core's face.
  const dx = CENTRE.x - point.x;
  const dy = CENTRE.y - point.y;
  const length = Math.hypot(dx, dy) || 1;

  return (
    <motion.g style={{ opacity: reveal }}>
      <motion.line
        x1={point.x}
        y1={point.y}
        x2={CENTRE.x - (dx / length) * CORE_R}
        y2={CENTRE.y - (dy / length) * CORE_R}
        stroke="var(--accent-fg)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ opacity: active ? 0.85 : 0.17 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </motion.g>
  );
}

/** One discipline: a real text label anchored to its seat in the system. */
function Node({
  discipline,
  point,
  order,
  active,
  muted,
  reduced,
  onHover,
  progress,
}: {
  discipline: Discipline;
  point: { x: number; y: number };
  order: number;
  active: boolean;
  muted: boolean;
  reduced: boolean;
  onHover: (id: string | null) => void;
  progress: MotionValue<number>;
}) {
  const start = CUE.nodeFirst + order * CUE.nodeStep;
  const appear = useTransform(progress, [start, start + CUE.nodeSpan], [0, 1]);
  const rise = useTransform(progress, [start, start + CUE.nodeSpan], [14, 0]);
  const above = point.y < CENTRE.y;

  return (
    <motion.li
      className="absolute flex h-[86px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{
        left: px(point.x),
        top: py(point.y),
        opacity: appear,
        y: rise,
        // Depth plane, plus a small step forward while active.
        z: ORBITS[discipline.orbit].z,
        transformStyle: "preserve-3d",
      }}
      onPointerEnter={(event) =>
        event.pointerType === "mouse" && onHover(discipline.id)
      }
      onPointerLeave={() => onHover(null)}
    >
      <motion.span
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        initial={false}
        // Reduced motion keeps the emphasis but drops the step forward in
        // depth: brightness and contrast still mark the active discipline.
        animate={
          reduced
            ? { scale: 1, z: 0 }
            : { scale: active ? 1.05 : 1, z: active ? 14 : 0 }
        }
        transition={{ duration: 0.32, ease: EASE }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <span
          aria-hidden="true"
          className="block h-2.5 w-2.5 rounded-full bg-[var(--accent-fg)] transition-[box-shadow,transform] duration-300"
          style={{
            transform: active ? "scale(1.3)" : "scale(1)",
            boxShadow: active
              ? "0 0 18px 3px rgba(142,123,255,0.55)"
              : "0 0 10px rgba(142,123,255,0.35)",
          }}
        />
      </motion.span>
      <span
        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.75rem] uppercase leading-tight tracking-[0.05em] transition-[color,opacity] duration-300 lg:text-[0.8125rem] ${
          above ? "bottom-[calc(50%+13px)]" : "top-[calc(50%+13px)]"
        }`}
        style={{
          color: active ? "var(--color-paper)" : "rgba(255,255,255,0.84)",
          // Unrelated disciplines step back a little; none of them dim to
          // the point of being hard to read.
          opacity: muted ? 0.58 : 1,
        }}
      >
        {discipline.spoken ? (
          <>
            <span aria-hidden="true">{discipline.title}</span>
            <span className="sr-only">{discipline.spoken}</span>
          </>
        ) : (
          discipline.title
        )}
      </span>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ *
 * The scene
 * ------------------------------------------------------------------ */

function Scene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const inView = useInView(stageRef, {
    once: true,
    margin: "0px 0px -18% 0px",
  });

  // One value drives the whole entrance, so every cue stays in step and the
  // sequence stops for good when it reaches 1.
  const progress = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(progress, 1, {
      duration: 2.8,
      ease: EASE,
      delay: 0.15,
    });
    return () => controls.stop();
  }, [inView, reduced, progress]);

  /* Pointer-led depth. Motion values only — no React state, so pointer
     movement never re-renders the tree. Parked when the section is out of
     view, and never attached without a fine pointer. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 55, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), spring);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [3, -3]), spring);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let live = false;
    const onMove = (event: PointerEvent) => {
      if (!live || event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX.set(Math.max(-0.5, Math.min(0.5, nx)));
      pointerY.set(Math.max(-0.5, Math.min(0.5, ny)));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        live = entry.isIntersecting;
        if (!live) {
          pointerX.set(0);
          pointerY.set(0);
        }
      },
      { threshold: 0 },
    );
    observer.observe(element);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, pointerX, pointerY]);

  /* Core */
  const coreOpacity = useTransform(progress, [CUE.core[0], CUE.core[1]], [0, 1]);
  const coreScale = useTransform(progress, [0, 0.26], [0.82, 1]);
  const coreZ = useTransform(progress, [0, 0.26], [-140, 8]);
  const coreLand = useTransform(progress, [...CUE.land], [0.35, 1, 0.62]);

  /* One signal: out of Branding, along the near half of the mid orbit and
     through SEO & GEO, then in to the core. It traces the sentence the copy
     makes — brand shapes the search, search feeds the system. */
  // 180 → 360 rather than 180 → 0: the rising number sweeps the near half of
  // the orbit, across the front of the core, instead of the far half.
  const signalFrom = 180;
  const signalTo = 360;
  const signalPoint = (v: number) => {
    if (v <= CUE.signal[0]) return seat(ORBITS.mid, signalFrom);
    if (v <= CUE.signal[1]) {
      const k = (v - CUE.signal[0]) / (CUE.signal[1] - CUE.signal[0]);
      return seat(ORBITS.mid, signalFrom + (signalTo - signalFrom) * k);
    }
    const k = Math.min(
      1,
      (v - CUE.signalIn[0]) / (CUE.signalIn[1] - CUE.signalIn[0]),
    );
    const from = seat(ORBITS.mid, signalTo);
    return {
      x: from.x + (CENTRE.x - from.x) * k,
      y: from.y + (CENTRE.y - from.y) * k,
    };
  };
  const signalX = useTransform(progress, (v) => px(signalPoint(v).x));
  const signalY = useTransform(progress, (v) => py(signalPoint(v).y));
  const signalOpacity = useTransform(
    progress,
    [0.55, 0.6, 0.9, 0.95],
    [0, 1, 1, 0],
  );

  const order = (discipline: Discipline) =>
    DEPTH_ORDER.indexOf(discipline.orbit) * 2 +
    (connectedSystem.disciplines
      .filter((item) => item.orbit === discipline.orbit)
      .findIndex((item) => item.id === discipline.id) %
      2);

  return (
    <div
      ref={stageRef}
      // 19:9 matches the view box exactly, so nothing in the scene is
      // stretched at any width.
      className="relative mx-auto mt-8 aspect-[19/9] w-full max-w-[64rem] [--depth:0.55] [perspective:1100px] md:mt-6 lg:[--depth:0.78] xl:[--depth:1] xl:[perspective:1300px]"
    >
      {/* Atmosphere: one contained pool of light under the core, and a
          restrained vignette. Flat, outside the 3D stack, so it never
          parallaxes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(42%_54%_at_50%_50%,rgba(142,123,255,0.13),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(74%_74%_at_50%_50%,transparent_56%,rgba(10,10,14,0.5))]"
      />

      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Back plane */}
        <Layer z={ORBITS.back.z}>
          <Plane>
            <Ring
              orbit={ORBITS.back}
              opacity={0.34}
              width={1}
              progress={progress}
              window={CUE.ring.back}
            />
            {connectedSystem.disciplines
              .filter((d) => d.orbit === "back")
              .map((d) => (
                <Connector
                  key={d.id}
                  point={seat(ORBITS.back, d.angle)}
                  order={order(d)}
                  active={hovered === d.id}
                  progress={progress}
                />
              ))}
          </Plane>
        </Layer>

        {/* The mid orbit is split at its widest points: the far half runs
            behind the core, the near half across the front of it. */}
        <Layer z={-22}>
          <Plane>
            <Ring
              orbit={ORBITS.mid}
              half="far"
              opacity={0.36}
              width={1}
              progress={progress}
              window={CUE.ring.mid}
            />
          </Plane>
        </Layer>

        {/* Core, and the mid plane's own connectors */}
        <Layer z={0}>
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              width: `${((CORE_R * 2) / VIEW.w) * 100}%`,
              aspectRatio: "1",
              opacity: coreOpacity,
              scale: coreScale,
              z: coreZ,
              // Solid, so the far half of the mid orbit genuinely disappears
              // behind it. Layered surfaces and a fine edge, not glass.
              background:
                "radial-gradient(circle at 50% 38%, #23213a 0%, #16161f 58%, #101017 100%)",
              boxShadow:
                "inset 0 0 0 1px rgba(142,123,255,0.38), inset 0 1px 0 rgba(255,255,255,0.07), 0 30px 70px -34px rgba(0,0,0,0.95)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9%] rounded-full border border-paper/10"
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                opacity: coreLand,
                background:
                  "radial-gradient(circle at 50% 50%, rgba(142,123,255,0.3), transparent 62%)",
              }}
            />
            <span className="relative max-w-[78%] text-center font-mono text-[0.6875rem] uppercase leading-[1.6] tracking-[0.1em] text-paper/95 lg:text-[0.8125rem]">
              {connectedSystem.caption}
            </span>
          </motion.div>

          <Plane>
            {connectedSystem.disciplines
              .filter((d) => d.orbit === "mid")
              .map((d) => (
                <Connector
                  key={d.id}
                  point={seat(ORBITS.mid, d.angle)}
                  order={order(d)}
                  active={hovered === d.id}
                  progress={progress}
                />
              ))}
          </Plane>
        </Layer>

        {/* Near half of the mid orbit, and the signal that runs along it */}
        <Layer z={22}>
          <Plane>
            <Ring
              orbit={ORBITS.mid}
              half="near"
              opacity={0.9}
              width={1.5}
              progress={progress}
              window={CUE.ring.mid}
            />
          </Plane>
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-fg)]"
              style={{
                left: signalX,
                top: signalY,
                opacity: signalOpacity,
                boxShadow: "0 0 14px 3px rgba(142,123,255,0.6)",
              }}
            />
          )}
        </Layer>

        {/* Front plane */}
        <Layer z={ORBITS.front.z}>
          <Plane>
            <Ring
              orbit={ORBITS.front}
              opacity={0.72}
              width={1.3}
              progress={progress}
              window={CUE.ring.front}
            />
            {connectedSystem.disciplines
              .filter((d) => d.orbit === "front")
              .map((d) => (
                <Connector
                  key={d.id}
                  point={seat(ORBITS.front, d.angle)}
                  order={order(d)}
                  active={hovered === d.id}
                  progress={progress}
                />
              ))}
          </Plane>
        </Layer>

        {/* One list for all six, each sitting on its own depth plane. Hover
            is emphasis only: every label is readable without it. */}
        <ul
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {connectedSystem.disciplines.map((discipline) => (
            <Node
              key={discipline.id}
              discipline={discipline}
              point={seat(ORBITS[discipline.orbit], discipline.angle)}
              order={order(discipline)}
              active={hovered === discipline.id}
              muted={hovered !== null && hovered !== discipline.id}
              reduced={reduced}
              onHover={setHovered}
              progress={progress}
            />
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Small screens get a system of their own, not a shrunken orbit: the core
 * at the top, a spine descending from it, and the six disciplines paired
 * off either side of it.
 * ------------------------------------------------------------------ */

function CompactSystem() {
  const reduced = useReducedMotion();
  const rows = [0, 1, 2].map((row) => connectedSystem.disciplines.slice(row * 2, row * 2 + 2));

  return (
    <motion.div
      className="relative mx-auto mt-12 max-w-sm md:hidden"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-12%" }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(50%_60%_at_50%_28%,rgba(142,123,255,0.14),transparent_72%)]"
      />

      <motion.div
        className="relative mx-auto flex h-[104px] w-[104px] items-center justify-center rounded-full"
        variants={{
          hidden: { opacity: 0, scale: 0.86 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 38%, #23213a 0%, #16161f 58%, #101017 100%)",
          boxShadow:
            "inset 0 0 0 1px rgba(142,123,255,0.38), 0 24px 50px -30px rgba(0,0,0,0.9)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[9%] rounded-full border border-paper/10"
        />
        <span className="relative max-w-[76%] text-center font-mono text-[0.625rem] uppercase leading-[1.6] tracking-[0.08em] text-paper/95">
          {connectedSystem.caption}
        </span>
      </motion.div>

      <ol className="relative mt-6">
        {/* The spine: one line out of the core that every discipline meets. */}
        <span
          aria-hidden="true"
          // Runs up into the gap so the spine leaves the core itself rather
          // than floating below it.
          className="pointer-events-none absolute left-1/2 -top-6 h-[calc(100%+1.5rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[rgba(142,123,255,0.55)] via-[rgba(142,123,255,0.28)] to-transparent"
        />
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent-fg)]"
            style={{ boxShadow: "0 0 12px 3px rgba(142,123,255,0.6)" }}
            initial={{ top: "0%", opacity: 0 }}
            whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 1.5, ease: EASE, delay: 0.5 }}
          />
        )}

        {rows.map((pair, rowIndex) => (
          <li key={rowIndex} className="relative">
            <div className="grid grid-cols-2 items-center gap-x-7 py-[13px]">
              {pair.map((discipline, side) => (
                <motion.div
                  key={discipline.id}
                  className={`flex items-center gap-2 ${
                    side === 0 ? "justify-end" : "flex-row-reverse justify-end"
                  }`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: EASE },
                    },
                  }}
                  // A small step back per row, so the stack reads with depth
                  // without anything becoming hard to read.
                  style={{ opacity: 1 - rowIndex * 0.06 }}
                >
                  <span className="whitespace-nowrap font-mono text-[0.75rem] uppercase tracking-[0.04em] text-paper/90">
                    {discipline.spoken ? (
                      <>
                        <span aria-hidden="true">{discipline.title}</span>
                        <span className="sr-only">{discipline.spoken}</span>
                      </>
                    ) : (
                      discipline.title
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fg)]"
                    style={{ boxShadow: "0 0 9px rgba(142,123,255,0.45)" }}
                  />
                </motion.div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

export function ConnectedSystem() {
  return (
    // Ink: the homepage's mid-page dark moment. The system draws in light on
    // dark, which is where the depth treatment earns its place.
    // The system now fills its own box, so the section no longer needs a full
    // measure of padding under it to feel unhurried.
    <section
      id="system"
      data-theme="ink"
      className="section relative pb-[calc(var(--section-y)*0.72)]"
    >
      {/* Chapter seam in: a fine lit line and a falling wash, so the ground
          change reads as a new chapter rather than a background swap. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(142,123,255,0.45)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(142,123,255,0.06),transparent_72%)]"
      />
      {/* And out: the ink lifts fractionally towards the light section below,
          so the handover is deliberate rather than a hard cut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.035))]"
      />

      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <RevealText>
              <p className="t-mono text-paper/70">{connectedSystem.eyebrow}</p>
              <h2 className="t-display-lg mt-6 max-w-[20ch]">
                {connectedSystem.heading.lead}{" "}
                <span className="text-[var(--accent-fg)]">
                  {connectedSystem.heading.accent}
                </span>
              </h2>
            </RevealText>
          </div>

          {/* The floating Speak-to-us button sits over the shell's right edge
              until about 1600px, and this column is the only body copy that
              reaches it. Inset while it does, flush once it no longer does. */}
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end lg:pr-10 min-[1600px]:pr-0">
            <RevealText delay={0.1}>
              {/* Larger and brighter than the muted token: dark-ground body
                  copy was sitting below comfortable reading contrast. */}
              <p className="t-body-lg max-w-[42ch] text-paper/80">
                {connectedSystem.body}
              </p>
              <p className="t-body-lg mt-5 max-w-[42ch] text-paper/92">
                {connectedSystem.secondary}
              </p>
            </RevealText>
          </div>
        </div>

        <div className="hidden md:block">
          <Scene />
        </div>
        <CompactSystem />
      </div>
    </section>
  );
}
