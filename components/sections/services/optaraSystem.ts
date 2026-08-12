import * as THREE from "three";

/**
 * The Optara object system (Stage 2C.3A prototype) — one persistent
 * modular 3D protagonist that transforms between three story states:
 *
 *   STATE 0 — INTRO: pieces of one system, not yet aligned. Real depth,
 *   deliberate near/far placement, small rotations, unresolved spacing.
 *   STATE 1 — BRANDING: the same modules resolve into a disciplined
 *   modular lattice with one aperture motif and one clean signal route —
 *   coherent identity, no letters, no logo.
 *   STATE 2 — SEO ENTRY: the lattice remains the source while outer
 *   modules branch outward into structured discovery pathways with
 *   destination nodes.
 *
 * Deterministic by construction: every module stores target transforms
 * per state; the single normalized progress maps to stateFloat = p * 2,
 * and each frame lerps position/rotation/scale between the two
 * neighbouring states with an eased local fraction. Same progress ⇒ same
 * geometry ⇒ same frame, forwards or backwards. Nothing animates after
 * scroll stops except the sub-degree pointer-parallax settle.
 *
 * Module vocabulary (32 modules — no generic cube protagonist): bone
 * ceramic slabs, graphite precision bars, plates, near-black connectors,
 * translucent optical rails, two aperture rings, cobalt signal bars and
 * one violet terminal. Shared geometries, six flat materials, no
 * textures, no shadow maps, no postprocessing — prototype economics.
 *
 * The renderer is transparent and renders on demand (progress or
 * parallax deltas) while running; setRunning(false) parks the loop.
 * destroy() disposes geometries, materials, renderer and listeners.
 */

export type OptaraSystemHandle = {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  setRunning(running: boolean): void;
  destroy(): void;
};

/* Deterministic PRNG so the "scattered" intro is the same scatter on
   every load, every machine. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type StateTransform = {
  p: [number, number, number];
  r: [number, number, number];
  s: number;
};
type ModuleSpec = {
  geo: "slab" | "bar" | "plate" | "connector" | "rail" | "ring" | "signal";
  mat: "bone" | "graphite" | "black" | "optical" | "cobalt" | "violet";
  states: [StateTransform, StateTransform, StateTransform];
};

/** Build the 32-module choreography table. */
function buildModules(): ModuleSpec[] {
  const rand = mulberry32(20260812);
  const scatter = (bias: number): [number, number, number] => [
    -3.2 + rand() * 7.4 + bias,
    -1.9 + rand() * 4.0,
    -3.4 + rand() * 4.6,
  ];
  const rot = (a: number): [number, number, number] => [
    (rand() - 0.5) * a,
    (rand() - 0.5) * a,
    (rand() - 0.5) * a,
  ];
  const mods: ModuleSpec[] = [];

  /* 10 slabs → the lattice's two columns of five. */
  for (let i = 0; i < 10; i++) {
    const col = i % 2 === 0 ? -1.05 : 1.05;
    const row = -1.2 + Math.floor(i / 2) * 0.6;
    const branchA = i % 3 === 0;
    mods.push({
      geo: "slab",
      mat: "bone",
      states: [
        { p: scatter(0.6), r: rot(0.8), s: 1 },
        { p: [col + 0.45, row, 0], r: [0, 0, 0], s: 1 },
        branchA
          ? { p: [col * 0.75 + 0.45, row, 0], r: [0, 0, 0], s: 1 }
          : { p: [col + 0.45, row, 0], r: [0, 0, 0], s: 0.92 },
      ],
    });
  }

  /* 6 bars → lattice rails, then radiating pathways. */
  const branchAngles = [0.32, 0.85, -0.28, 2.6, 3.5, -0.75];
  for (let i = 0; i < 6; i++) {
    const horizontal = i < 3;
    const latticeP: [number, number, number] = horizontal
      ? [0.45, -1.55 + i * 1.55, 0.1]
      : [-2.0 + (i - 3) * 2.45 + 0.45, 0, 0.1];
    const latticeR: [number, number, number] = horizontal
      ? [0, 0, 0]
      : [0, 0, Math.PI / 2];
    const a = branchAngles[i];
    mods.push({
      geo: "bar",
      mat: "graphite",
      states: [
        { p: scatter(0.4), r: rot(1.0), s: 1 },
        { p: latticeP, r: latticeR, s: 1 },
        {
          p: [0.45 + Math.cos(a) * 2.9, Math.sin(a) * 1.8, 0.1],
          r: [0, 0, Math.atan2(Math.sin(a) * 1.8, Math.cos(a) * 2.9)],
          s: 1.08,
        },
      ],
    });
  }

  /* 4 plates → lattice corner accents, then destination nodes. */
  const plateCorners: [number, number, number][] = [
    [-1.9, 1.45, 0.3],
    [2.8, 1.45, 0.3],
    [-1.9, -1.45, 0.3],
    [2.8, -1.45, 0.3],
  ];
  const dest = [
    [4.2, 1.35, 0.2],
    [4.5, -0.6, 0.1],
    [-3.1, 1.7, -0.2],
    [-3.4, -1.5, 0],
  ] as [number, number, number][];
  for (let i = 0; i < 4; i++) {
    mods.push({
      geo: "plate",
      mat: "bone",
      states: [
        { p: scatter(0.2), r: rot(0.9), s: 1 },
        { p: plateCorners[i], r: [Math.PI / 2, 0, 0], s: 1 },
        { p: dest[i], r: [Math.PI / 2, 0, 0], s: 0.72 },
      ],
    });
  }

  /* 4 connectors → lattice joints, then mid-path nodes. */
  const joints: [number, number, number][] = [
    [-2.0, 1.55, 0.1],
    [2.9, 1.55, 0.1],
    [-2.0, -1.55, 0.1],
    [2.9, -1.55, 0.1],
  ];
  const mid = [
    [2.6, 0.85, 0.15],
    [3.4, -0.35, 0.1],
    [-2.2, 1.05, -0.1],
    [-2.5, -0.95, 0],
  ] as [number, number, number][];
  for (let i = 0; i < 4; i++) {
    mods.push({
      geo: "connector",
      mat: "black",
      states: [
        { p: scatter(0), r: rot(1.2), s: 1 },
        { p: joints[i], r: [0, 0, 0], s: 1 },
        { p: mid[i], r: [0, Math.PI / 4, 0], s: 1.15 },
      ],
    });
  }

  /* 4 optical rails → front verticals, then aligned along two branches. */
  for (let i = 0; i < 4; i++) {
    mods.push({
      geo: "rail",
      mat: "optical",
      states: [
        { p: scatter(0.8), r: rot(0.7), s: 1 },
        { p: [-1.3 + i * 1.15, 0.15, 0.55], r: [0, 0, Math.PI / 2], s: 1 },
        i < 2
          ? { p: [1.9 + i * 1.0, 0.62 + i * 0.3, 0.35], r: [0, 0, 0.32], s: 1 }
          : { p: [-1.7 - (i - 2) * 0.9, 0.9, 0.2], r: [0, 0, 2.6], s: 0.9 },
      ],
    });
  }

  /* 2 aperture rings: graphite source ring stays central; the accent ring
     travels to the strongest destination. */
  mods.push({
    geo: "ring",
    mat: "graphite",
    states: [
      { p: [2.6, 1.6, -1.2], r: [0.4, 0.5, 0], s: 0.9 },
      { p: [0.45, 0, 0.6], r: [0, 0, 0], s: 1.6 },
      { p: [0.45, 0, 0.4], r: [0, 0, 0], s: 1.25 },
    ],
  });
  mods.push({
    geo: "ring",
    mat: "cobalt",
    states: [
      { p: [-2.4, -1.3, 0.8], r: [0.7, 0.2, 0.3], s: 0.5 },
      { p: [1.95, 1.7, 0.4], r: [0, 0, 0], s: 0.55 },
      { p: [4.35, 1.4, 0.25], r: [0, 0, 0], s: 0.7 },
    ],
  });

  /* 2 cobalt signal bars resolve into one route through the aperture,
     then extend along the primary branch. */
  mods.push({
    geo: "signal",
    mat: "cobalt",
    states: [
      { p: [-1.6, 0.9, 1.0], r: [0, 0, 0.5], s: 1 },
      { p: [-0.35, 0, 0.62], r: [0, 0, 0], s: 1 },
      { p: [1.35, 0.42, 0.35], r: [0, 0, 0.32], s: 1.1 },
    ],
  });
  mods.push({
    geo: "signal",
    mat: "cobalt",
    states: [
      { p: [1.4, -1.4, -0.6], r: [0, 0, -0.7], s: 1 },
      { p: [1.25, 0, 0.62], r: [0, 0, 0], s: 1 },
      { p: [2.95, 0.95, 0.35], r: [0, 0, 0.32], s: 1.1 },
    ],
  });

  /* Violet terminal at the signal's end. */
  mods.push({
    geo: "connector",
    mat: "violet",
    states: [
      { p: [3.3, -0.4, 1.2], r: rot(1.0), s: 0.9 },
      { p: [2.15, 0, 0.62], r: [0, 0, 0], s: 1.1 },
      { p: [3.75, 1.2, 0.3], r: [0, Math.PI / 4, 0], s: 1.25 },
    ],
  });

  return mods; // 10+6+4+4+4+2+2+1 = 33
}

/* Camera states: wider/deeper intro → controlled frontal Branding →
   slight pull for the pathway expansion. Premium product-film movement
   only — no orbit, no spin, no FOV drama. */
const CAM_POS: [number, number, number][] = [
  [0.2, 1.1, 10.2],
  [0.45, 0.45, 7.7],
  [0.25, 0.9, 9.0],
];
const CAM_TGT: [number, number, number][] = [
  [0.7, 0.1, 0],
  [0.45, 0, 0.3],
  [0.35, 0.2, 0],
];

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
    34,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    60,
  );

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(3, 5, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe4ff, 0.35);
  fill.position.set(-4, 2, -3);
  scene.add(fill);

  /* Shared geometries. */
  const GEOS: Record<ModuleSpec["geo"], THREE.BufferGeometry> = {
    slab: new THREE.BoxGeometry(2.0, 0.14, 1.15),
    bar: new THREE.BoxGeometry(2.7, 0.09, 0.09),
    plate: new THREE.BoxGeometry(1.05, 0.06, 1.05),
    connector: new THREE.BoxGeometry(0.17, 0.17, 0.17),
    rail: new THREE.BoxGeometry(1.8, 0.11, 0.11),
    ring: new THREE.TorusGeometry(0.55, 0.035, 12, 48),
    signal: new THREE.BoxGeometry(1.5, 0.07, 0.07),
  };

  /* Six flat materials — bone/graphite/near-black structure, translucent
     optics, flat cobalt and violet signal accents. No gradient wash. */
  const MATS: Record<ModuleSpec["mat"], THREE.Material> = {
    bone: new THREE.MeshStandardMaterial({ color: 0xefece4, roughness: 0.62, metalness: 0.04 }),
    graphite: new THREE.MeshStandardMaterial({ color: 0x2c2e36, roughness: 0.42, metalness: 0.28 }),
    black: new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.35, metalness: 0.3 }),
    optical: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12, metalness: 0, transparent: true, opacity: 0.32 }),
    cobalt: new THREE.MeshBasicMaterial({ color: 0x2b7fff }),
    violet: new THREE.MeshBasicMaterial({ color: 0x5b3df5 }),
  };

  const specs = buildModules();
  const meshes = specs.map((spec) => {
    const mesh = new THREE.Mesh(GEOS[spec.geo], MATS[spec.mat]);
    scene.add(mesh);
    return mesh;
  });

  /* ── State ── */
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
  const eA = new THREE.Euler();

  const apply = () => {
    const stateFloat = Math.min(2, Math.max(0, progress * 2));
    const i = Math.min(1, Math.floor(stateFloat));
    const f = easeInOutCubic(Math.min(1, Math.max(0, stateFloat - i)));

    for (let m = 0; m < specs.length; m++) {
      const a = specs[m].states[i];
      const b = specs[m].states[i + 1];
      const mesh = meshes[m];
      vA.set(...a.p);
      vB.set(...b.p);
      mesh.position.lerpVectors(vA, vB, f);
      eA.set(
        a.r[0] + (b.r[0] - a.r[0]) * f,
        a.r[1] + (b.r[1] - a.r[1]) * f,
        a.r[2] + (b.r[2] - a.r[2]) * f,
      );
      mesh.rotation.copy(eA);
      const s = a.s + (b.s - a.s) * f;
      mesh.scale.setScalar(s);
    }

    const cp = CAM_POS[i];
    const cq = CAM_POS[i + 1];
    const tp = CAM_TGT[i];
    const tq = CAM_TGT[i + 1];
    camera.position.set(
      cp[0] + (cq[0] - cp[0]) * f + pointerLerped.x * 0.3,
      cp[1] + (cq[1] - cp[1]) * f + pointerLerped.y * 0.2,
      cp[2] + (cq[2] - cp[2]) * f,
    );
    vA.set(tp[0] + (tq[0] - tp[0]) * f, tp[1] + (tq[1] - tp[1]) * f, tp[2] + (tq[2] - tp[2]) * f);
    camera.lookAt(vA);

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__optara3d = {
        p: progress,
        cam: camera.position.toArray().map((n) => +n.toFixed(3)),
        target: vA.toArray().map((n) => +n.toFixed(3)),
        meshes: meshes.length,
        m0: meshes[0].position.toArray().map((n) => +n.toFixed(3)),
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
    const parallaxMoving =
      Math.abs(px - pointerLerped.x) > 0.0004 || Math.abs(py - pointerLerped.y) > 0.0004;
    pointerLerped.x = px;
    pointerLerped.y = py;

    if (dirty || parallaxMoving) {
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
      Object.values(MATS).forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
