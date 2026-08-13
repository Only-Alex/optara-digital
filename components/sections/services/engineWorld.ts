import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * THE OPTARA INTELLIGENCE ENGINE (Stage 2D.1 proof).
 *
 * One connected marketing ecosystem — the whole system is the hero:
 *
 *   AudienceField (GPU point clusters + abstract identity marks)
 *      ↓ primary ribbon
 *   IntelligenceCore (offset graphite strata, optical planes, seam light,
 *   one vertical routing fissure)          ← ContentField (editorial
 *      ↓ primary fall                         planes resolving into a
 *   Basin (receiving pool on the ground)      disciplined system)
 *      → growth rings
 *
 * Every narrative value — camera pose, audience cohesion, content
 * alignment, ribbon reveal/intensity, basin/ring state, world reveal —
 * is a pure function of ONE progress value pushed in via setProgress.
 * uTime drives only micro pulse-flow and mote drift; it carries no
 * narrative state, so forward and reverse scrolling reconstruct the
 * identical world. No direction logic, no queues, nothing completes
 * after scroll stops.
 *
 * Draw-call economics: strata, seams and rings are merged; the sixteen
 * secondary routes are ONE merged geometry with a per-route reveal-band
 * attribute; audience and motes are two Points systems; identity marks
 * are two InstancedMeshes. ~34 draw calls, ≤60k triangles, 2 custom
 * shaders (signal flow, audience points), no textures, no post, no
 * shadow maps, DPR ≤ 1.75.
 */

export type EngineHandle = {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  setRunning(running: boolean): void;
  destroy(): void;
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const band = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* World anchor: centre-right so the left 34–38% stays typographic. */
const CX = 2.1;
const GROUND_Y = -2.6;

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

function roundedPlate(w: number, h: number, depth: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 8,
  });
  g.center();
  return g;
}

/** Flat ribbon geometry along a curve: two vertices per sample, uv.x = t. */
function ribbonGeometry(curve: THREE.CatmullRomCurve3, width: number, segments = 64) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 0, 1);
  const side = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPoint(t);
    const tan = curve.getTangent(t);
    side.crossVectors(tan, up).normalize().multiplyScalar(width / 2);
    if (side.lengthSq() < 1e-6) side.set(width / 2, 0, 0);
    positions.push(p.x - side.x, p.y - side.y, p.z - side.z);
    positions.push(p.x + side.x, p.y + side.y, p.z + side.z);
    uvs.push(t, 0, t, 1);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  return g;
}

/* ── Shaders ── */

const SIGNAL_VERT = /* glsl */ `
  attribute vec2 aBand;
  varying vec2 vUv;
  varying vec2 vBand;
  void main() {
    vUv = uv;
    vBand = aBand;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* One material serves primary (uBand uniform) and secondary (aBand
   attribute) ribbons via USE_ATTR_BAND define. */
const SIGNAL_FRAG = /* glsl */ `
  uniform float uP;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uBand;
  varying vec2 vUv;
  varying vec2 vBand;
  void main() {
    vec2 bandv = uBand;
    #ifdef USE_ATTR_BAND
      bandv = vBand;
    #endif
    float reveal = smoothstep(bandv.x, bandv.x + 0.08, uP);
    float drawn = 1.0 - smoothstep(reveal, reveal + 0.001, vUv.x);
    if (bandv.y > 0.0) {
      drawn = step(vUv.x, mix(0.0, 1.0, smoothstep(bandv.x, bandv.y, uP)));
    }
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float core = smoothstep(0.35, 1.0, edge);
    float glow = smoothstep(0.0, 1.0, edge) * 0.45;
    float pulse = 0.75 + 0.25 * sin((vUv.x - uTime * 0.22) * 28.0);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.2, 0.9, vUv.x) * 0.35);
    float a = (core * pulse + glow) * uIntensity * drawn;
    gl_FragColor = vec4(col * (0.6 + core * 1.2), a);
  }
`;

const POINTS_VERT = /* glsl */ `
  attribute vec3 aDiffuse;
  attribute vec3 aCohere;
  attribute float aSeed;
  uniform float uCohere;
  uniform float uTime;
  uniform float uSize;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 p = mix(aDiffuse, aCohere, uCohere);
    p += vec3(
      sin(uTime * 0.6 + aSeed * 40.0),
      cos(uTime * 0.5 + aSeed * 60.0),
      sin(uTime * 0.4 + aSeed * 80.0)
    ) * 0.03;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (10.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const POINTS_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, d) * uAlpha;
    vec3 col = mix(uColor, vec3(0.95), step(0.92, vSeed) * 0.8);
    gl_FragColor = vec4(col, a);
  }
`;

/* Camera keyframes: [progress stop, position, look target]. */
const CAM: [number, [number, number, number], [number, number, number]][] = [
  [0.0, [-1.5, 2.2, 15.0], [1.8, 0.4, 0]],
  [0.08, [-1.35, 2.05, 14.2], [1.8, 0.4, 0]],
  [0.28, [-0.5, 1.4, 12.0], [1.9, 0.3, 0]],
  [0.45, [-1.2, 1.8, 10.5], [CX - 1.5, 1.3, 0]],
  [0.6, [-0.2, 1.2, 9.6], [CX, 0.2, 0]],
  [0.8, [0.6, 1.0, 9.2], [2.2, 0.75, 0]],
  [1.0, [1.0, 0.7, 8.6], [2.1, 0.5, 0]],
];

export function createEngineWorld(container: HTMLElement): EngineHandle | null {
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
  renderer.domElement.style.opacity = "0";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    34,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    80,
  );

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;

  scene.add(new THREE.HemisphereLight(0x8b93a8, 0x14151b, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 0.8);
  key.position.set(4, 7, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbcc6ff, 0.4);
  rim.position.set(-6, 3, -5);
  scene.add(rim);
  const basinLight = new THREE.PointLight(0x2b7fff, 0.0, 7, 1.8);
  basinLight.position.set(CX + 0.2, GROUND_Y + 0.5, 0.45);
  scene.add(basinLight);

  /* Materials */
  const graphite = new THREE.MeshStandardMaterial({ color: 0x23252d, roughness: 0.38, metalness: 0.5, envMapIntensity: 0.55 });
  const polymer = new THREE.MeshStandardMaterial({ color: 0x0e0f14, roughness: 0.34, metalness: 0.4, envMapIntensity: 0.22 });
  const optical = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.16, envMapIntensity: 0.9, depthWrite: false });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0xd8d3c6, roughness: 0.5, metalness: 0.03, envMapIntensity: 0.25 });
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x08090c, roughness: 0.5, metalness: 0.35, envMapIntensity: 0.12 });
  const inkBar = new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.5, metalness: 0.1 });

  const makeSignalMat = (intensity: number, attrBand: boolean) => {
    const m = new THREE.ShaderMaterial({
      vertexShader: SIGNAL_VERT,
      fragmentShader: SIGNAL_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      defines: attrBand ? { USE_ATTR_BAND: "" } : {},
      uniforms: {
        uP: { value: 0 },
        uTime: { value: 0 },
        uIntensity: { value: intensity },
        uColorA: { value: new THREE.Color(0x2b7fff) },
        uColorB: { value: new THREE.Color(0x5b3df5) },
        uBand: { value: new THREE.Vector2(0, 0) },
      },
    });
    return m;
  };

  const disposables: (THREE.BufferGeometry | THREE.Material)[] = [
    graphite, polymer, optical, ceramic, groundMat, inkBar,
  ];

  /* ── Ground, basin, growth rings ── */
  const groundGeo = new THREE.PlaneGeometry(46, 30);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(CX, GROUND_Y, -2);
  scene.add(ground);
  disposables.push(groundGeo);

  const basinMat = makeSignalMat(0.9, false);
  basinMat.uniforms.uBand.value.set(0.5, 0.72);
  const basinGeo = new THREE.CircleGeometry(1.1, 48);
  /* Radial UVs: reuse uv.y as edge falloff via vUv.x — bake uv.x as radius. */
  {
    const uv = basinGeo.attributes.uv as THREE.BufferAttribute;
    const pos = basinGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i)) / 1.1;
      uv.setXY(i, 0.5, 1 - r); // vUv.y: 1 centre → 0 rim (edge profile)
    }
  }
  const basin = new THREE.Mesh(basinGeo, basinMat);
  basin.rotation.x = -Math.PI / 2;
  basin.position.set(CX + 0.2, GROUND_Y + 0.01, 0.45);
  scene.add(basin);
  disposables.push(basinGeo, basinMat);

  const ringsMat = makeSignalMat(0.32, false);
  ringsMat.uniforms.uBand.value.set(0.68, 0.95);
  const ringGeos = [1.7, 2.5, 3.4].map((r) => {
    const g = new THREE.RingGeometry(r, r + 0.035, 72);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.5, 0.5);
    return g;
  });
  const ringsGeo = mergeGeometries(ringGeos);
  ringGeos.forEach((g) => g.dispose());
  const rings = new THREE.Mesh(ringsGeo, ringsMat);
  rings.rotation.x = -Math.PI / 2;
  rings.position.set(CX + 0.2, GROUND_Y + 0.02, 0.45);
  scene.add(rings);
  disposables.push(ringsGeo, ringsMat);

  /* ── Intelligence core: offset strata, merged ── */
  const strataSpecs: [number, number, number, number, number, number, number][] = [
    // w, h(depthY), d, x, y, z, rotY
    [2.6, 0.34, 1.4, 0.0, -2.2, 0.0, 0.04],
    [2.2, 0.3, 1.25, 0.22, -1.78, -0.12, -0.07],
    [2.45, 0.36, 1.3, -0.14, -1.32, 0.08, 0.09],
    [2.0, 0.3, 1.15, 0.3, -0.88, -0.05, -0.05],
    [2.35, 0.4, 1.35, -0.05, -0.36, 0.1, 0.06],
    [1.9, 0.3, 1.1, 0.26, 0.12, -0.15, -0.09],
    [2.2, 0.34, 1.25, -0.18, 0.6, 0.04, 0.05],
    [1.75, 0.28, 1.05, 0.18, 1.04, -0.08, -0.04],
    [2.05, 0.32, 1.2, -0.08, 1.5, 0.06, 0.08],
    [1.55, 0.26, 0.95, 0.12, 1.92, -0.02, -0.06],
  ];
  const strataParts = strataSpecs.map(([w, h, d, x, y, z, ry]) => {
    const g = roundedPlate(w, h, d, 0.09);
    g.rotateX(Math.PI / 2); // plate lies flat: w × d footprint, h tall
    g.rotateY(ry);
    g.translate(CX + x, y, z);
    return g;
  });
  const strataGeo = mergeGeometries(strataParts);
  strataParts.forEach((g) => g.dispose());
  const strata = new THREE.Mesh(strataGeo, graphite);
  scene.add(strata);
  disposables.push(strataGeo);

  /* Dark internal volume behind the seams. */
  const innerGeo = new THREE.BoxGeometry(1.5, 4.1, 0.9);
  const inner = new THREE.Mesh(innerGeo, polymer);
  inner.position.set(CX + 0.05, -0.2, -0.05);
  scene.add(inner);
  disposables.push(innerGeo);

  /* Two optical planes interleaved. */
  const opticGeo = roundedPlate(1.9, 1.3, 0.05, 0.1);
  const optic1 = new THREE.Mesh(opticGeo, optical);
  optic1.rotation.x = Math.PI / 2;
  optic1.position.set(CX + 0.05, -0.62, 0.02);
  const optic2 = new THREE.Mesh(opticGeo, optical);
  optic2.rotation.x = Math.PI / 2;
  optic2.position.set(CX - 0.06, 0.86, 0.02);
  scene.add(optic1, optic2);
  disposables.push(opticGeo);

  /* Seam light + the vertical routing fissure, merged emissives. */
  const seamMat = makeSignalMat(0.5, false);
  seamMat.uniforms.uBand.value.set(0.1, 0.3);
  const seamParts: THREE.BufferGeometry[] = [];
  [[-1.06, 1.6], [-0.6, 1.9], [0.38, 1.7], [1.28, 1.4]].forEach(([y, w]) => {
    const g = new THREE.PlaneGeometry(w, 0.045);
    g.translate(CX + 0.05, y, 0.72);
    seamParts.push(g);
  });
  {
    const fissure = new THREE.PlaneGeometry(0.075, 3.9);
    fissure.translate(CX + 0.34, -0.15, 0.74);
    seamParts.push(fissure);
  }
  const seamGeo = mergeGeometries(seamParts);
  seamParts.forEach((g) => g.dispose());
  const seams = new THREE.Mesh(seamGeo, seamMat);
  scene.add(seams);
  disposables.push(seamGeo, seamMat);

  /* ── Audience field: clustered GPU points ── */
  const AUD_N = 3000;
  const rand = mulberry32(20260813);
  const clusters = [
    new THREE.Vector3(CX - 2.7, 2.35, -0.9),
    new THREE.Vector3(CX - 3.2, 1.35, 0.2),
    new THREE.Vector3(CX - 2.1, 1.0, -1.6),
    new THREE.Vector3(CX - 1.5, 2.7, 0.4),
    new THREE.Vector3(CX - 1.0, 1.7, -0.5),
  ];
  const diffuse = new Float32Array(AUD_N * 3);
  const cohere = new Float32Array(AUD_N * 3);
  const seeds = new Float32Array(AUD_N);
  for (let i = 0; i < AUD_N; i++) {
    const c = clusters[i % clusters.length];
    const rD = 1.35;
    const rC = 0.55 + (i % clusters.length) * 0.06;
    const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    const dirC = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    const dLen = Math.cbrt(rand()) * rD;
    const cLen = Math.cbrt(rand()) * rC;
    diffuse.set([c.x + dir.x * dLen * 1.6, c.y + dir.y * dLen, c.z + dir.z * dLen], i * 3);
    cohere.set([c.x + dirC.x * cLen, c.y + dirC.y * cLen, c.z + dirC.z * cLen], i * 3);
    seeds[i] = rand();
  }
  const audGeo = new THREE.BufferGeometry();
  audGeo.setAttribute("position", new THREE.BufferAttribute(diffuse.slice(), 3));
  audGeo.setAttribute("aDiffuse", new THREE.BufferAttribute(diffuse, 3));
  audGeo.setAttribute("aCohere", new THREE.BufferAttribute(cohere, 3));
  audGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const audMat = new THREE.ShaderMaterial({
    vertexShader: POINTS_VERT,
    fragmentShader: POINTS_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uCohere: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.6 * Math.min(window.devicePixelRatio, 1.75) },
      uColor: { value: new THREE.Color(0x5f8dff) },
      uAlpha: { value: 0.75 },
    },
  });
  const audience = new THREE.Points(audGeo, audMat);
  scene.add(audience);
  disposables.push(audGeo, audMat);

  /* Ambient motes: sparse depth dust. */
  const MOTE_N = 800;
  const moteDiff = new Float32Array(MOTE_N * 3);
  const moteSeed = new Float32Array(MOTE_N);
  for (let i = 0; i < MOTE_N; i++) {
    moteDiff.set(
      [CX - 6 + rand() * 12, GROUND_Y + rand() * 7.5, -6 + rand() * 8],
      i * 3,
    );
    moteSeed[i] = rand();
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(moteDiff.slice(), 3));
  moteGeo.setAttribute("aDiffuse", new THREE.BufferAttribute(moteDiff, 3));
  moteGeo.setAttribute("aCohere", new THREE.BufferAttribute(moteDiff, 3));
  moteGeo.setAttribute("aSeed", new THREE.BufferAttribute(moteSeed, 1));
  const moteMat = audMat.clone();
  moteMat.uniforms.uSize.value = 1.6 * Math.min(window.devicePixelRatio, 1.75);
  moteMat.uniforms.uAlpha.value = 0.22;
  moteMat.uniforms.uColor.value = new THREE.Color(0x8b93a8);
  const motes = new THREE.Points(moteGeo, moteMat);
  scene.add(motes);
  disposables.push(moteGeo, moteMat);

  /* Identity marks: abstract profile geometry (plate + head dot). */
  const ID_N = 14;
  const idPlateGeo = roundedPlate(0.12, 0.16, 0.03, 0.04);
  const idDotGeo = new THREE.SphereGeometry(0.032, 10, 10);
  const idPlates = new THREE.InstancedMesh(idPlateGeo, polymer, ID_N);
  const idDots = new THREE.InstancedMesh(idDotGeo, ceramic, ID_N);
  const idDiffuse: THREE.Vector3[] = [];
  const idCohere: THREE.Vector3[] = [];
  for (let i = 0; i < ID_N; i++) {
    const c = clusters[i % clusters.length];
    idDiffuse.push(
      c.clone().add(new THREE.Vector3((rand() - 0.5) * 2.6, (rand() - 0.5) * 1.8, (rand() - 0.5) * 1.4)),
    );
    idCohere.push(
      c.clone().add(new THREE.Vector3((rand() - 0.5) * 1.0, (rand() - 0.5) * 0.7, (rand() - 0.5) * 0.5)),
    );
  }
  scene.add(idPlates, idDots);
  disposables.push(idPlateGeo, idDotGeo);

  /* ── Content field: editorial planes resolving into a system ── */
  type PlaneSpec = {
    mesh: THREE.Mesh;
    from: { p: THREE.Vector3; r: THREE.Euler; s: number };
    to: { p: THREE.Vector3; r: THREE.Euler; s: number };
  };
  const contentPlanes: PlaneSpec[] = [];
  const planeDims: [number, number, "dark" | "white" | "accent"][] = [
    [1.15, 0.66, "dark"],
    [0.72, 0.94, "white"],
    [0.98, 0.6, "dark"],
    [0.66, 0.66, "dark"],
    [1.05, 0.62, "white"],
    [0.78, 0.5, "dark"],
    [0.6, 0.78, "dark"],
    [0.92, 0.56, "accent"],
  ];
  const alignedOrigin = new THREE.Vector3(CX + 1.55, 1.05, -0.35);
  planeDims.forEach(([w, h, kind], i) => {
    const g = roundedPlate(w, h, 0.045, 0.06);
    const m = new THREE.Mesh(g, kind === "white" ? ceramic : polymer);
    disposables.push(g);
    if (kind === "white") {
      /* Typographic geometry: unreadable layout bars. */
      const bar1 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, 0.045, 0.012), inkBar);
      const bar2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.38, 0.03, 0.012), inkBar);
      const bar3 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.46, 0.03, 0.012), inkBar);
      bar1.position.set(-w * 0.12, h * 0.26, 0.035);
      bar2.position.set(-w * 0.18, h * 0.1, 0.035);
      bar3.position.set(-w * 0.14, -0.02, 0.035);
      m.add(bar1, bar2, bar3);
      disposables.push(bar1.geometry, bar2.geometry, bar3.geometry);
    }
    if (kind === "accent") {
      const edgeMat = makeSignalMat(0.7, false);
      edgeMat.uniforms.uBand.value.set(0.7, 0.9);
      const edge = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.92, 0.03), edgeMat);
      edge.position.set(0, -h / 2 + 0.06, 0.032);
      m.add(edge);
      disposables.push(edge.geometry, edgeMat);
    }
    const col = i % 3;
    const row = Math.floor(i / 3);
    const to = {
      p: alignedOrigin.clone().add(new THREE.Vector3(col * 1.06, -row * 0.82, col * 0.02)),
      r: new THREE.Euler(0, -0.16, 0),
      s: 1,
    };
    const from = {
      p: to.p.clone().add(new THREE.Vector3((rand() - 0.5) * 1.7, (rand() - 0.5) * 1.3, (rand() - 0.5) * 1.6 + 0.5)),
      r: new THREE.Euler((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.7, (rand() - 0.5) * 0.4),
      s: 0.92,
    };
    scene.add(m);
    contentPlanes.push({ mesh: m, from, to });
  });

  /* ── Primary signal ribbons ── */
  const mkCurve = (pts: [number, number, number][]) =>
    new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const primarySpecs: {
    curve: THREE.CatmullRomCurve3;
    width: number;
    band: [number, number];
    intensity: number;
  }[] = [
    { // 1. Audience → Core
      curve: mkCurve([[CX - 2.9, 1.9, -0.5], [CX - 1.7, 1.5, 0.4], [CX - 0.6, 1.1, 0.62], [CX + 0.33, 0.85, 0.7]]),
      width: 0.1, band: [0.34, 0.52], intensity: 1.0,
    },
    { // 2. Content → Core
      curve: mkCurve([[CX + 2.3, 1.5, -0.3], [CX + 1.4, 1.1, 0.3], [CX + 0.55, 0.7, 0.66]]),
      width: 0.085, band: [0.6, 0.78], intensity: 0.85,
    },
    { // 3. Internal route down the fissure
      curve: mkCurve([[CX + 0.34, 0.95, 0.75], [CX + 0.36, -0.2, 0.76], [CX + 0.34, -1.35, 0.75]]),
      width: 0.07, band: [0.44, 0.6], intensity: 1.1,
    },
    { // 4. Core → Basin main fall
      curve: mkCurve([[CX + 0.34, -1.4, 0.74], [CX + 0.3, -1.95, 0.62], [CX + 0.22, -2.5, 0.48]]),
      width: 0.12, band: [0.48, 0.68], intensity: 1.25,
    },
    { // 5. Companion output
      curve: mkCurve([[CX + 0.5, -1.5, 0.6], [CX + 0.72, -2.05, 0.52], [CX + 0.85, -2.52, 0.4]]),
      width: 0.055, band: [0.55, 0.72], intensity: 0.7,
    },
  ];
  const primaryMats: THREE.ShaderMaterial[] = [];
  primarySpecs.forEach((spec) => {
    const g = ribbonGeometry(spec.curve, spec.width, 72);
    const m = makeSignalMat(0, false);
    m.uniforms.uBand.value.set(spec.band[0], spec.band[1]);
    m.uniforms.uIntensity.value = 0; // driven per progress
    const mesh = new THREE.Mesh(g, m);
    mesh.userData.maxIntensity = spec.intensity;
    mesh.userData.band = spec.band;
    scene.add(mesh);
    primaryMats.push(m);
    disposables.push(g, m);
  });
  const primaryMeshes = scene.children.filter((c) => (c as THREE.Mesh).userData?.maxIntensity) as THREE.Mesh[];

  /* ── Secondary relationships: 16 thin routes, ONE merged draw ── */
  const secondaryParts: THREE.BufferGeometry[] = [];
  const secBand = (g: THREE.BufferGeometry, a: number, b: number) => {
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) arr.set([a, b], i * 2);
    g.setAttribute("aBand", new THREE.BufferAttribute(arr, 2));
    return g;
  };
  // cluster ↔ cluster (4)
  for (let i = 0; i < 4; i++) {
    const a = clusters[i];
    const b2 = clusters[(i + 1) % clusters.length];
    const mid = a.clone().lerp(b2, 0.5).add(new THREE.Vector3(0, 0.25, -0.15));
    const g = ribbonGeometry(new THREE.CatmullRomCurve3([a, mid, b2]), 0.028, 40);
    secondaryParts.push(secBand(g, 0.3 + i * 0.02, 0.46 + i * 0.02));
  }
  // clusters → audience spine (4)
  for (let i = 0; i < 4; i++) {
    const a = clusters[i + 1] ?? clusters[0];
    const g = ribbonGeometry(
      new THREE.CatmullRomCurve3([a, a.clone().lerp(new THREE.Vector3(CX - 0.6, 1.1, 0.6), 0.55), new THREE.Vector3(CX - 0.4, 1.0, 0.62)]),
      0.024, 40,
    );
    secondaryParts.push(secBand(g, 0.4 + i * 0.02, 0.56 + i * 0.02));
  }
  // content ↔ content (4)
  for (let i = 0; i < 4; i++) {
    const a = contentPlanes[i].to.p;
    const b2 = contentPlanes[i + 2].to.p;
    const g = ribbonGeometry(
      new THREE.CatmullRomCurve3([a, a.clone().lerp(b2, 0.5).add(new THREE.Vector3(0, 0.14, 0.18)), b2]),
      0.022, 36,
    );
    secondaryParts.push(secBand(g, 0.66 + i * 0.02, 0.82 + i * 0.02));
  }
  // core seams → routes (4)
  [[-1.06, 0.4], [-0.6, 0.44], [0.38, 0.48], [1.28, 0.52]].forEach(([y, s]) => {
    const g = ribbonGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(CX - 0.9, y, 0.72),
        new THREE.Vector3(CX - 0.2, y + 0.15, 0.76),
        new THREE.Vector3(CX + 0.3, (y + 0.3) * 0.5, 0.75),
      ]),
      0.02, 32,
    );
    secondaryParts.push(secBand(g, s, s + 0.16));
  });
  const secondaryGeo = mergeGeometries(secondaryParts);
  secondaryParts.forEach((g) => g.dispose());
  const secondaryMat = makeSignalMat(0.3, true);
  const secondary = new THREE.Mesh(secondaryGeo, secondaryMat);
  scene.add(secondary);
  disposables.push(secondaryGeo, secondaryMat);

  /* ── State ── */
  let progress = 0;
  let running = true;
  let destroyed = false;
  let raf = 0;
  const pointer = { x: 0, y: 0 };
  const lerped = { x: 0, y: 0 };
  let last = performance.now();
  let time = 0;

  const vA = new THREE.Vector3();
  const dummy = new THREE.Object3D();

  const applyIdentity = (t: number) => {
    for (let i = 0; i < ID_N; i++) {
      dummy.position.lerpVectors(idDiffuse[i], idCohere[i], t);
      dummy.rotation.set(0, -0.3, 0);
      const s = 0.6 + 0.4 * t;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      idPlates.setMatrixAt(i, dummy.matrix);
      dummy.position.y += 0.115;
      dummy.scale.setScalar(s * 0.9);
      dummy.updateMatrix();
      idDots.setMatrixAt(i, dummy.matrix);
    }
    idPlates.instanceMatrix.needsUpdate = true;
    idDots.instanceMatrix.needsUpdate = true;
  };

  const apply = () => {
    const p = progress;

    /* World reveal out of the hero exit darkness. */
    renderer.domElement.style.opacity = String(band(p, 0.0, 0.08));

    /* Camera along keyframes. */
    let seg = 0;
    while (seg < CAM.length - 2 && p > CAM[seg + 1][0]) seg++;
    const [t0, p0, l0] = CAM[seg];
    const [t1, p1, l1] = CAM[seg + 1];
    const f = easeInOutCubic(clamp01((p - t0) / Math.max(1e-5, t1 - t0)));
    camera.position.set(
      p0[0] + (p1[0] - p0[0]) * f + lerped.x * 0.15,
      p0[1] + (p1[1] - p0[1]) * f + lerped.y * 0.1,
      p0[2] + (p1[2] - p0[2]) * f,
    );
    vA.set(l0[0] + (l1[0] - l0[0]) * f, l0[1] + (l1[1] - l0[1]) * f, l0[2] + (l1[2] - l0[2]) * f);
    camera.lookAt(vA);

    /* Audience cohesion + identity marks. The audience beat retires as
       Branding resolves so the field never lingers over the typography
       column at the later camera poses. */
    const cohereT = easeInOutCubic(band(p, 0.28, 0.5));
    audMat.uniforms.uCohere.value = cohereT;
    audMat.uniforms.uAlpha.value = 0.75 * (1 - 0.62 * band(p, 0.62, 0.8));
    const idT = easeInOutCubic(band(p, 0.3, 0.52));
    const idOut = 1 - 0.85 * easeInOutCubic(band(p, 0.6, 0.78));
    applyIdentity(idT);
    idPlates.count = ID_N;
    const fadeScale = Math.max(0.001, idOut);
    idPlates.scale.setScalar(fadeScale);
    idDots.scale.setScalar(fadeScale);

    /* Content alignment. */
    const alignT = easeInOutCubic(band(p, 0.62, 0.88));
    for (const cp of contentPlanes) {
      cp.mesh.position.lerpVectors(cp.from.p, cp.to.p, alignT);
      cp.mesh.rotation.set(
        cp.from.r.x + (cp.to.r.x - cp.from.r.x) * alignT,
        cp.from.r.y + (cp.to.r.y - cp.from.r.y) * alignT,
        cp.from.r.z + (cp.to.r.z - cp.from.r.z) * alignT,
      );
      cp.mesh.scale.setScalar(cp.from.s + (cp.to.s - cp.from.s) * alignT);
    }

    /* Signals. */
    primaryMeshes.forEach((mesh) => {
      const m = mesh.material as THREE.ShaderMaterial;
      const [a] = mesh.userData.band as [number, number];
      m.uniforms.uP.value = p;
      m.uniforms.uIntensity.value =
        (mesh.userData.maxIntensity as number) * band(p, a, Math.min(1, a + 0.1));
    });
    secondaryMat.uniforms.uP.value = p;
    seamMat.uniforms.uP.value = Math.max(p, 0.32); // seams awake once world visible
    seamMat.uniforms.uIntensity.value = 0.25 + 0.45 * band(p, 0.4, 0.65);

    /* Basin + rings + light. */
    basinMat.uniforms.uP.value = p;
    basinMat.uniforms.uIntensity.value = 1.1 * band(p, 0.52, 0.7);
    ringsMat.uniforms.uP.value = p;
    ringsMat.uniforms.uIntensity.value = 0.4 * band(p, 0.7, 0.92);
    const ringScale = 0.75 + 0.35 * easeInOutCubic(band(p, 0.68, 1));
    rings.scale.setScalar(ringScale);
    basinLight.intensity = 0.75 * band(p, 0.5, 0.7);

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__engine = {
        p: +p.toFixed(4),
        cam: camera.position.toArray().map((n) => +n.toFixed(2)),
        target: vA.toArray().map((n) => +n.toFixed(2)),
        cohere: +cohereT.toFixed(2),
        align: +alignT.toFixed(2),
        draws: renderer.info.render.calls,
        tris: renderer.info.render.triangles,
      };
    }
  };

  const tick = () => {
    if (destroyed) return;
    raf = running ? requestAnimationFrame(tick) : 0;
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    lerped.x += (pointer.x - lerped.x) * (1 - Math.exp(-dt * 5));
    lerped.y += (pointer.y - lerped.y) * (1 - Math.exp(-dt * 5));

    /* uTime drives ONLY micro pulse + mote drift — no narrative state. */
    audMat.uniforms.uTime.value = time;
    moteMat.uniforms.uTime.value = time * 0.4;
    [basinMat, ringsMat, seamMat, secondaryMat, ...primaryMats].forEach(
      (m) => (m.uniforms.uTime.value = time),
    );

    apply();
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  const onContextLost = (e: Event) => {
    e.preventDefault();
    renderer.domElement.style.opacity = "0";
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);

  return {
    setProgress(p) {
      progress = clamp01(p);
    },
    setPointer(x, y) {
      pointer.x = Math.min(0.5, Math.max(-0.5, x));
      pointer.y = Math.min(0.5, Math.max(-0.5, -y));
    },
    setRunning(r) {
      if (destroyed || running === r) return;
      running = r;
      if (r && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      disposables.forEach((d) => d.dispose());
      idPlates.dispose();
      idDots.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
