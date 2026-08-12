import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * THE OPTARA CORE (Stage 2C.3B) — one persistent, art-directed 3D
 * protagonist. Not scaffolding, not a diagram: a compact sculptural
 * object with mass, a centre of gravity and a recognisable silhouette,
 * built from a small manufactured vocabulary:
 *
 *   · four large rounded ceramic plates (the mass)
 *   · one thick graphite aperture ring (the core — structural focus,
 *     framed off-axis against a plate so it never reads as an eye)
 *   · one ceramic hub plate behind the ring
 *   · two graphite mid plates, two translucent optical slabs
 *   · three short capsule rails, two rounded connectors
 *   · one cobalt signal capsule with a violet terminal
 *
 * 16 primary modules. Every module stores deterministic transforms for
 * three states around the same centre-right anchor (world x ≈ +1.6, so
 * the projected object stays clear of the left text column):
 *
 *   INTRO — the same object, not yet aligned: modest separations, small
 *   rotations, ring slightly off-axis, signal short. One system before
 *   alignment — never debris.
 *   BRANDING — the hero still: plates lock into an equal-rhythm 2×2
 *   composition around the framed core, optical slabs come parallel,
 *   rails bind the edges, the signal completes through the aperture.
 *   SEO — the resolved object OPENS: two plates translate outward, the
 *   optical rails extend into two structured branches, destination
 *   forms appear, the signal travels to the far terminal. The core
 *   remains the source.
 *
 * stateFloat = progress × 2, eased local fraction, pure lerp — same
 * progress, same geometry, both directions, nothing animates after
 * scroll stops. Camera is three product-film poses on the same clock.
 *
 * Materials: five disciplined PBR surfaces lit by a hemisphere + key +
 * rim and Three's self-contained RoomEnvironment via PMREMGenerator
 * (generated at runtime — no HDR download, no textures). No bloom, no
 * postprocessing, no shadow maps, DPR ≤ 1.75.
 */

export type OptaraSystemHandle = {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  setRunning(running: boolean): void;
  destroy(): void;
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type S = { p: [number, number, number]; r: [number, number, number]; s: number };
type Mod = {
  geo: "plateL" | "plateM" | "hub" | "ring" | "optic" | "rail" | "conn" | "signal" | "terminal";
  mat: "ceramic" | "graphite" | "black" | "optical" | "cobalt" | "violet";
  states: [S, S, S];
};

/* The anchor the whole object lives around — right of the text column. */
const AX = 1.6;

function buildModules(): Mod[] {
  const m: Mod[] = [];

  /* Four large ceramic plates: Branding = equal-rhythm 2×2 around the
     core; Intro = modestly separated/tilted; SEO = right pair opens. */
  const platesB: [number, number, number][] = [
    [AX - 1.25, 0.95, -0.25],
    [AX + 1.25, 0.95, -0.25],
    [AX - 1.25, -0.95, -0.25],
    [AX + 1.25, -0.95, -0.25],
  ];
  const platesI: S[] = [
    { p: [AX - 1.7, 1.35, -1.3], r: [0.16, -0.22, -0.1], s: 1 },
    { p: [AX + 1.5, 1.15, 0.6], r: [-0.12, 0.18, 0.08], s: 1 },
    { p: [AX - 1.45, -1.3, 0.45], r: [0.1, 0.14, 0.12], s: 1 },
    { p: [AX + 1.75, -1.15, -1.05], r: [-0.14, -0.12, -0.06], s: 1 },
  ];
  const platesSeo: S[] = [
    { p: [AX - 1.25, 0.95, -0.25], r: [0, 0, 0], s: 1 },
    { p: [AX + 2.35, 1.35, -0.15], r: [0, 0.12, 0], s: 0.92 },
    { p: [AX - 1.25, -0.95, -0.25], r: [0, 0, 0], s: 1 },
    { p: [AX + 2.55, -1.25, -0.2], r: [0, 0.14, 0], s: 0.92 },
  ];
  for (let i = 0; i < 4; i++) {
    m.push({
      geo: "plateL",
      mat: "ceramic",
      states: [platesI[i], { p: platesB[i], r: [0, 0, 0], s: 1 }, platesSeo[i]],
    });
  }

  /* The core: thick graphite aperture ring, framed off-axis. */
  m.push({
    geo: "ring",
    mat: "graphite",
    states: [
      { p: [AX + 0.15, 0.1, 0.55], r: [0.24, -0.3, 0.1], s: 1 },
      { p: [AX, 0, 0.45], r: [0, 0, 0], s: 1 },
      { p: [AX, 0, 0.45], r: [0, 0.16, 0], s: 1 },
    ],
  });

  /* Hub plate behind the ring — the ring frames a corner of it, so the
     centre never reads as a pupil. */
  m.push({
    geo: "hub",
    mat: "ceramic",
    states: [
      { p: [AX + 0.55, 0.45, -0.1], r: [0.1, 0.18, 0.14], s: 1 },
      { p: [AX + 0.42, 0.34, 0.1], r: [0, 0, 0.06], s: 1 },
      { p: [AX + 0.42, 0.34, 0.1], r: [0, 0.1, 0.06], s: 1 },
    ],
  });

  /* Two graphite mid plates: depth shoulders. */
  m.push({
    geo: "plateM",
    mat: "graphite",
    states: [
      { p: [AX - 1.55, 0.15, 0.7], r: [0.05, 0.3, 0.1], s: 1 },
      { p: [AX - 1.2, 0.05, 0.35], r: [0, 0.1, 0], s: 1 },
      { p: [AX - 1.2, 0.05, 0.35], r: [0, 0.1, 0], s: 1 },
    ],
  });
  m.push({
    geo: "plateM",
    mat: "black",
    states: [
      { p: [AX + 1.9, -0.35, 0.95], r: [-0.1, -0.24, -0.06], s: 1 },
      { p: [AX + 1.55, -0.3, 0.4], r: [0, -0.1, 0], s: 1 },
      { p: [AX + 2.9, -0.15, 0.3], r: [0, -0.16, 0], s: 0.9 },
    ],
  });

  /* Two optical slabs: verticals beside the core; SEO extends them into
     the two branch directions. */
  m.push({
    geo: "optic",
    mat: "optical",
    states: [
      { p: [AX - 0.75, 0.2, 0.9], r: [0, 0, 1.35], s: 1 },
      { p: [AX - 0.62, 0, 0.7], r: [0, 0, Math.PI / 2], s: 1 },
      { p: [AX + 0.9, 0.85, 0.55], r: [0, 0, 0.5], s: 1.35 },
    ],
  });
  m.push({
    geo: "optic",
    mat: "optical",
    states: [
      { p: [AX + 0.8, -0.15, 1.0], r: [0, 0, 1.8], s: 1 },
      { p: [AX + 0.62, 0, 0.7], r: [0, 0, Math.PI / 2], s: 1 },
      { p: [AX + 1.15, -0.75, 0.5], r: [0, 0, -0.42], s: 1.35 },
    ],
  });

  /* Three short capsule rails binding plate edges; SEO re-aims two of
     them along the branches. */
  m.push({
    geo: "rail",
    mat: "graphite",
    states: [
      { p: [AX - 0.1, 1.6, 0.15], r: [0, 0, 0.1], s: 1 },
      { p: [AX, 1.7, 0], r: [0, 0, 0], s: 1 },
      { p: [AX + 1.15, 1.72, -0.1], r: [0, 0, 0.16], s: 1.1 },
    ],
  });
  m.push({
    geo: "rail",
    mat: "graphite",
    states: [
      { p: [AX + 0.2, -1.65, 0.35], r: [0, 0, -0.12], s: 1 },
      { p: [AX, -1.7, 0], r: [0, 0, 0], s: 1 },
      { p: [AX + 1.3, -1.72, -0.05], r: [0, 0, -0.14], s: 1.1 },
    ],
  });
  /* Two rounded connectors at working joints. */
  m.push({
    geo: "conn",
    mat: "black",
    states: [
      { p: [AX - 1.15, 1.55, 0.5], r: [0.3, 0.4, 0], s: 1 },
      { p: [AX - 1.05, 1.6, 0.1], r: [0, 0, 0], s: 1 },
      { p: [AX - 1.05, 1.6, 0.1], r: [0, 0, 0], s: 1 },
    ],
  });
  m.push({
    geo: "conn",
    mat: "graphite",
    states: [
      { p: [AX + 1.3, -1.6, 0.75], r: [0.2, -0.3, 0.2], s: 1 },
      { p: [AX + 1.05, -1.6, 0.1], r: [0, 0, 0], s: 1 },
      { p: [AX + 2.3, -1.7, 0], r: [0, Math.PI / 4, 0], s: 1.15 },
    ],
  });

  /* The signal: one cobalt capsule through the aperture; SEO carries it
     outward along the upper branch to the violet terminal. */
  m.push({
    geo: "signal",
    mat: "cobalt",
    states: [
      { p: [AX - 0.55, 0.35, 0.75], r: [0, 0, 0.35], s: 0.8 },
      { p: [AX, 0, 0.62], r: [0, 0, 0], s: 1 },
      { p: [AX + 1.3, 0.6, 0.5], r: [0, 0, 0.42], s: 1.45 },
    ],
  });
  m.push({
    geo: "terminal",
    mat: "violet",
    states: [
      { p: [AX + 0.95, -0.55, 1.1], r: [0.4, 0.3, 0], s: 0.85 },
      { p: [AX + 0.95, 0, 0.62], r: [0, 0, 0], s: 1 },
      { p: [AX + 2.6, 1.15, 0.45], r: [0, Math.PI / 4, 0], s: 1.2 },
    ],
  });

  return m; // 16 modules
}

/* Cameras: composed around the centre-right object with the left text
   region protected. */
/* The whole object is compacted and pushed right after construction:
   root scale 0.72, root x +1.15 — so world centre sits ≈ x 2.3 and the
   projected object clears the left text column. Cameras are posed for
   that transformed centre. */
const ROOT_SCALE = 0.72;
const ROOT_X = 1.15;
const CX = AX * ROOT_SCALE + ROOT_X; // ≈ 2.30

const CAM_POS: [number, number, number][] = [
  [CX - 0.7, 0.5, 9.7],
  [CX - 0.5, 0.18, 7.4],
  [CX - 0.65, 0.4, 8.9],
];
const CAM_TGT: [number, number, number][] = [
  [CX - 0.08, 0.08, 0],
  [CX, 0, 0.15],
  [CX + 0.18, 0.08, 0],
];

/* ── Geometry builders: rounded, chamfered, physical ── */

function roundedPlate(w: number, h: number, depth: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 3,
    curveSegments: 10,
  });
  geo.center();
  return geo;
}

export function createOptaraSystem(
  container: HTMLElement,
): OptaraSystemHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    33,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    60,
  );

  /* Self-contained environment lighting: RoomEnvironment through
     PMREMGenerator — generated once at runtime, no downloads. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;

  scene.add(new THREE.HemisphereLight(0xfff6e9, 0x30323a, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8ecff, 0.45);
  rim.position.set(-5, 2.5, -4);
  scene.add(rim);

  const GEOS: Record<Mod["geo"], THREE.BufferGeometry> = {
    plateL: roundedPlate(1.7, 1.15, 0.16, 0.16),
    plateM: roundedPlate(1.05, 0.8, 0.13, 0.12),
    hub: roundedPlate(0.85, 0.85, 0.12, 0.2),
    ring: new THREE.TorusGeometry(0.88, 0.15, 22, 72),
    optic: roundedPlate(1.25, 0.42, 0.1, 0.1),
    rail: new THREE.CapsuleGeometry(0.085, 1.35, 6, 14),
    conn: roundedPlate(0.24, 0.24, 0.22, 0.06),
    signal: new THREE.CapsuleGeometry(0.05, 1.5, 6, 12),
    terminal: roundedPlate(0.17, 0.17, 0.16, 0.05),
  };
  /* Capsules stand on Y; lay the rails/signal horizontal by default. */
  GEOS.rail.rotateZ(Math.PI / 2);
  GEOS.signal.rotateZ(Math.PI / 2);

  const MATS: Record<Mod["mat"], THREE.Material> = {
    ceramic: new THREE.MeshStandardMaterial({ color: 0xede9df, roughness: 0.38, metalness: 0.03, envMapIntensity: 0.55 }),
    graphite: new THREE.MeshStandardMaterial({ color: 0x2e3038, roughness: 0.32, metalness: 0.55, envMapIntensity: 0.7 }),
    black: new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.26, metalness: 0.5, envMapIntensity: 0.6 }),
    optical: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.3, envMapIntensity: 0.9 }),
    cobalt: new THREE.MeshBasicMaterial({ color: 0x2b7fff }),
    violet: new THREE.MeshBasicMaterial({ color: 0x5b3df5 }),
  };

  const specs = buildModules();
  const root = new THREE.Group();
  root.scale.setScalar(ROOT_SCALE);
  root.position.x = ROOT_X;
  scene.add(root);
  const meshes = specs.map((spec) => {
    const mesh = new THREE.Mesh(GEOS[spec.geo], MATS[spec.mat]);
    root.add(mesh);
    return mesh;
  });

  let progress = 0;
  let running = true;
  let dirty = true;
  let raf = 0;
  let destroyed = false;
  const pointer = { x: 0, y: 0 };
  const pointerLerped = { x: 0, y: 0 };
  let lastTime = performance.now();

  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  const box = new THREE.Box3();
  const corner = new THREE.Vector3();

  const apply = () => {
    const stateFloat = Math.min(2, Math.max(0, progress * 2));
    const i = Math.min(1, Math.floor(stateFloat));
    const f = easeInOutCubic(Math.min(1, Math.max(0, stateFloat - i)));

    for (let k = 0; k < specs.length; k++) {
      const a = specs[k].states[i];
      const b = specs[k].states[i + 1];
      const mesh = meshes[k];
      vA.set(...a.p);
      vB.set(...b.p);
      mesh.position.lerpVectors(vA, vB, f);
      mesh.rotation.set(
        a.r[0] + (b.r[0] - a.r[0]) * f,
        a.r[1] + (b.r[1] - a.r[1]) * f,
        a.r[2] + (b.r[2] - a.r[2]) * f,
      );
      mesh.scale.setScalar(a.s + (b.s - a.s) * f);
    }

    const cp = CAM_POS[i];
    const cq = CAM_POS[i + 1];
    const tp = CAM_TGT[i];
    const tq = CAM_TGT[i + 1];
    /* Pointer influence clamped small so geometry can never drift into
       the text column. */
    camera.position.set(
      cp[0] + (cq[0] - cp[0]) * f + pointerLerped.x * 0.18,
      cp[1] + (cq[1] - cp[1]) * f + pointerLerped.y * 0.12,
      cp[2] + (cq[2] - cp[2]) * f,
    );
    vA.set(tp[0] + (tq[0] - tp[0]) * f, tp[1] + (tq[1] - tp[1]) * f, tp[2] + (tq[2] - tp[2]) * f);
    camera.lookAt(vA);

    if (process.env.NODE_ENV !== "production") {
      box.setFromObject(root);
      let minX = 1, minY = 1, maxX = -1, maxY = -1;
      for (let cx = 0; cx < 2; cx++)
        for (let cy = 0; cy < 2; cy++)
          for (let cz = 0; cz < 2; cz++) {
            corner.set(
              cx ? box.max.x : box.min.x,
              cy ? box.max.y : box.min.y,
              cz ? box.max.z : box.min.z,
            );
            corner.project(camera);
            minX = Math.min(minX, corner.x);
            maxX = Math.max(maxX, corner.x);
            minY = Math.min(minY, corner.y);
            maxY = Math.max(maxY, corner.y);
          }
      (window as unknown as Record<string, unknown>).__optara3d = {
        p: +progress.toFixed(4),
        cam: camera.position.toArray().map((n) => +n.toFixed(3)),
        target: vA.toArray().map((n) => +n.toFixed(3)),
        meshes: meshes.length,
        bboxPct: {
          left: +(((minX + 1) / 2) * 100).toFixed(1),
          right: +(((maxX + 1) / 2) * 100).toFixed(1),
          top: +(((1 - maxY) / 2) * 100).toFixed(1),
          bottom: +(((1 - minY) / 2) * 100).toFixed(1),
        },
      };
    }
  };

  const tick = () => {
    if (destroyed) return;
    raf = running ? requestAnimationFrame(tick) : 0;
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const px = pointerLerped.x + (pointer.x - pointerLerped.x) * (1 - Math.exp(-dt * 5));
    const py = pointerLerped.y + (pointer.y - pointerLerped.y) * (1 - Math.exp(-dt * 5));
    const moving =
      Math.abs(px - pointerLerped.x) > 0.0004 || Math.abs(py - pointerLerped.y) > 0.0004;
    pointerLerped.x = px;
    pointerLerped.y = py;

    if (dirty || moving) {
      apply();
      renderer.render(scene, camera);
      dirty = false;
    }
  };
  raf = requestAnimationFrame(tick);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  });
  ro.observe(container);

  const onContextLost = (e: Event) => {
    e.preventDefault();
    renderer.domElement.style.opacity = "0";
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);

  return {
    setProgress(p) {
      progress = Math.min(1, Math.max(0, p));
      dirty = true;
    },
    setPointer(x, y) {
      pointer.x = Math.min(0.5, Math.max(-0.5, x));
      pointer.y = Math.min(0.5, Math.max(-0.5, -y));
    },
    setRunning(r) {
      if (destroyed || running === r) return;
      running = r;
      if (r && !raf) {
        lastTime = performance.now();
        dirty = true;
        raf = requestAnimationFrame(tick);
      }
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      Object.values(GEOS).forEach((g) => g.dispose());
      Object.values(MATS).forEach((mt) => mt.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
