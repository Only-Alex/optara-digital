import * as THREE from "three";

/**
 * The hero's particle field: a shallow landscape of brand-coloured points
 * rolling in a slow wave, lifting and brightening around the pointer.
 *
 * Loaded only by the homepage, only after first paint, via a dynamic import —
 * so three.js never enters another route's bundle and never blocks the hero
 * copy, which is server-rendered and readable before this module arrives.
 *
 * Every particle's motion lives in the vertex shader. The per-frame JS cost is
 * a handful of uniform writes, so there is no attribute upload and no
 * per-frame React state — the render loop runs entirely outside React.
 *
 * The palette is the logo's, already tuned across the smoke sprints:
 * blue #2B7FFF → violet #5B3DF5 → purple #7B2FF7, blended along the field's
 * depth so the far edge reads blue and the near edge purple, exactly like the
 * mark's own gradient.
 */

const BLUE = new THREE.Color("#2B7FFF");
const VIOLET = new THREE.Color("#5B3DF5");
const PURPLE = new THREE.Color("#7B2FF7");

export type HeroFieldHandle = {
  destroy: () => void;
  /** Freeze/unfreeze the render loop (offscreen, hidden tab). */
  setRunning: (running: boolean) => void;
};

export function createHeroField(
  container: HTMLElement,
  {
    reducedMotion = false,
    coarsePointer = false,
  }: { reducedMotion?: boolean; coarsePointer?: boolean } = {},
): HeroFieldHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    // No WebGL: the hero simply keeps its CSS backdrop.
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  // Fade in once the first frame exists, so there is no pop.
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 1.2s ease";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 2.1, 8.2);
  camera.lookAt(0, -0.4, 0);

  /* ── Geometry: a grid of points forming the landscape ─────────────────
     Phones get a quarter of the points; the wave reads identically and the
     fill-rate cost drops with it. */
  const COLS = coarsePointer ? 90 : 170;
  const ROWS = coarsePointer ? 50 : 92;
  const WIDTH = 26;
  const DEPTH = 13;

  const count = COLS * ROWS;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      positions[i * 3] = (c / (COLS - 1) - 0.5) * WIDTH;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * DEPTH;
      seeds[i] = Math.random();
      i++;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: reducedMotion ? 40 : 0 },
    uPointer: { value: new THREE.Vector3(0, 0, -40) },
    uPointerStrength: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uBlue: { value: BLUE },
    uViolet: { value: VIOLET },
    uPurple: { value: PURPLE },
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform vec3 uPointer;
      uniform float uPointerStrength;
      uniform float uPixelRatio;
      varying float vGlow;
      varying float vDepth;
      varying float vSeed;

      void main() {
        vec3 p = position;

        // Two crossing waves make the landscape roll without visible tiling.
        float w1 = sin(p.x * 0.55 + uTime * 0.5) * cos(p.z * 0.7 + uTime * 0.32);
        float w2 = sin((p.x + p.z) * 0.28 - uTime * 0.35);
        p.y += w1 * 0.42 + w2 * 0.3;

        // The pointer lifts a soft hill and feeds the glow varying.
        float d = distance(p.xz, uPointer.xz);
        float influence = exp(-d * d * 0.28) * uPointerStrength;
        p.y += influence * 1.15;
        vGlow = influence;

        vDepth = clamp((p.z + ${(DEPTH / 2).toFixed(1)}) / ${DEPTH.toFixed(1)}, 0.0, 1.0);
        vSeed = aSeed;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = (1.1 + aSeed * 1.4 + influence * 2.4) * uPixelRatio;
        gl_PointSize = size * (9.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uBlue;
      uniform vec3 uViolet;
      uniform vec3 uPurple;
      varying float vGlow;
      varying float vDepth;
      varying float vSeed;

      void main() {
        // Round, soft-edged sprite.
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float disc = smoothstep(0.5, 0.18, d);
        if (disc < 0.01) discard;

        // Logo gradient along depth: blue far, violet mid, purple near.
        vec3 colour = vDepth < 0.5
          ? mix(uBlue, uViolet, vDepth * 2.0)
          : mix(uViolet, uPurple, (vDepth - 0.5) * 2.0);

        // Pointer glow pushes toward white so the lift reads as light.
        colour = mix(colour, vec3(1.0), vGlow * 0.55);

        float alpha = disc * (0.28 + vSeed * 0.35 + vGlow * 0.5);
        // The far rows dissolve so the field has a horizon, not a hard edge.
        alpha *= smoothstep(0.0, 0.22, vDepth) * 0.9 + 0.1;
        gl_FragColor = vec4(colour, alpha);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = -0.12;
  scene.add(points);

  /* ── Pointer → world-space, lerped so the hill glides ─────────────────
     Touch devices get a slow autonomous wander instead: the field still
     feels alive without tracking anything. */
  const targetPointer = new THREE.Vector3(0, 0, -40);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  let targetStrength = 0;

  function onPointerMove(e: PointerEvent) {
    const rect = container.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const hit = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, hit)) {
      targetPointer.copy(hit);
      targetStrength = 1;
    }
  }
  function onPointerLeave() {
    targetStrength = 0;
  }

  if (!reducedMotion && !coarsePointer) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave);
  }

  /* ── Sizing ──────────────────────────────────────────────────────────── */
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  /* ── Render loop ─────────────────────────────────────────────────────── */
  let raf = 0;
  let running = true;
  let destroyed = false;
  let framesRendered = 0;
  const clock = new THREE.Clock();

  function frame() {
    if (destroyed || !running) return;
    const dt = Math.min(clock.getDelta(), 0.05);

    if (!reducedMotion) {
      uniforms.uTime.value += dt;
      if (coarsePointer) {
        // Ambient wander for touch: a slow Lissajous path across the field.
        const t = uniforms.uTime.value * 0.22;
        targetPointer.set(Math.sin(t) * 7, 0, Math.sin(t * 1.7) * 3.5);
        targetStrength = 0.7;
      }
      uniforms.uPointer.value.lerp(targetPointer, 1 - Math.exp(-dt * 4));
      uniforms.uPointerStrength.value +=
        (targetStrength - uniforms.uPointerStrength.value) *
        (1 - Math.exp(-dt * 3));
    }

    renderer.render(scene, camera);
    if (framesRendered === 0) canvas.style.opacity = "1";
    framesRendered++;

    // Reduced motion renders a handful of frames (so the fade-in and initial
    // resize settle) and then parks: a complete still composition, no loop.
    if (reducedMotion && framesRendered > 5) return;
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* ── Failure and teardown ────────────────────────────────────────────── */
  function onContextLost(e: Event) {
    e.preventDefault();
    // Bow out visually; the hero copy never depended on the canvas.
    canvas.style.opacity = "0";
    running = false;
  }
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    setRunning(next: boolean) {
      if (destroyed || next === running) return;
      running = next;
      if (running) {
        clock.getDelta(); // swallow the pause so the wave does not jump
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
