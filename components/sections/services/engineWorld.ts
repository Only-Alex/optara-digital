import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * THE OPTARA INTELLIGENCE ENGINE — Stage 2D.1A visual fidelity pass.
 *
 * Same deterministic contract as 2D.1 (one progress in, everything a
 * pure function of it; uTime only for pulse/drift), with the scene
 * re-art-directed:
 *
 * CORE — no more box stack: two graphite structural FRAMES with real
 * openings, an asymmetric overhang, stepped slabs, three thin routing
 * planes, a recessed interior cavity with seam light, and rear routing
 * architecture in depth. Front/mid/rear layers occlude each other and
 * the signals, so the core reads as having an internal world.
 *
 * SIGNALS — layered ribbons: every primary route is a soft wide
 * envelope plus a bright narrow core in one shader system. Three
 * dominant flows (audience→core, internal, core→basin) + two quiet
 * companions. Routes travel through Z — behind the rear architecture,
 * over the front shoulder, down the cavity — never on one plane.
 *
 * AUDIENCE — five differently *shaped* segments (compact, elongated,
 * two-lobed, small high-value, distant) with per-cluster size and
 * brightness hierarchy; cohered targets lean toward the route mouth so
 * selection reads as intelligence. Identity marks are tiny person
 * glyphs (capsule body + head), briefly emphasized on the audience
 * beat, retired before Branding.
 *
 * CONTENT — an editorial family, not cards: one hero plane with
 * unreadable layout geometry, two mediums, three narrow typographic
 * structures, one optical plane, one thin accent frame; crisp corners,
 * staggered depths, controlled overlap; resolves into one composition.
 *
 * WORLD — fog kills the grey horizon (ground dissolves into the dark),
 * faint far verticals give parallax depth, the basin is a recessed
 * measured destination, and the final 10% runs an authored exit:
 * signals dim → distance deepens → core softens → canvas releases →
 * the bone page returns. Reverse replays the same order because every
 * step is a band of the same clock.
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

const CX = 2.1;
const GROUND_Y = -2.6;
const WORLD_BG = 0x0b0c10;

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

function plateGeo(w: number, h: number, depth: number, r = 0.02) {
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
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 6,
  });
  g.center();
  return g;
}

/** Structural frame: a plate with a rectangular void. */
function frameGeo(w: number, h: number, bw: number, depth: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  const hole = new THREE.Path();
  const iw = w / 2 - bw;
  const ih = h / 2 - bw;
  hole.moveTo(-iw, -ih);
  hole.lineTo(iw, -ih);
  hole.lineTo(iw, ih);
  hole.lineTo(-iw, ih);
  hole.closePath();
  s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 4,
  });
  g.center();
  return g;
}

function ribbonGeometry(curve: THREE.CatmullRomCurve3, width: number, segments = 72) {
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

/* Layered energy: envelope passes render a broad soft body; core passes
   render a bright centre with a white-hot middle and two pulse bands.
   USE_ATTR_BAND switches per-route reveal to the merged-secondary path. */
const SIGNAL_FRAG = /* glsl */ `
  uniform float uP;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uEnvelope;
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
    float drawn = step(vUv.x, smoothstep(bandv.x, bandv.y, uP));
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    vec3 col;
    float a;
    if (uEnvelope > 0.5) {
      float body = pow(smoothstep(0.0, 1.0, edge), 1.6);
      float breathe = 0.85 + 0.15 * sin((vUv.x - uTime * 0.12) * 9.0);
      col = mix(uColorA, uColorB, 0.3);
      a = body * breathe * uIntensity * 0.30;
    } else {
      float core = smoothstep(0.3, 1.0, edge);
      float hot = smoothstep(0.78, 1.0, edge);
      float pulse = 0.7 + 0.3 * sin((vUv.x - uTime * 0.2) * 26.0);
      float pulse2 = 0.85 + 0.15 * sin((vUv.x - uTime * 0.31) * 11.0);
      col = mix(uColorA, uColorB, smoothstep(0.15, 0.95, vUv.x) * 0.3);
      col = mix(col, vec3(0.85, 0.92, 1.0), hot * 0.75);
      a = core * pulse * pulse2 * uIntensity;
    }
    gl_FragColor = vec4(col * (0.7 + edge), a * drawn);
  }
`;

const POINTS_VERT = /* glsl */ `
  attribute vec3 aDiffuse;
  attribute vec3 aCohere;
  attribute float aSeed;
  attribute float aScale;
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
    gl_PointSize = uSize * aScale * (10.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const POINTS_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * uAlpha;
    vec3 col = mix(uColor, vec3(0.92, 0.95, 1.0), step(0.9, vSeed) * 0.85);
    gl_FragColor = vec4(col, a * (0.55 + 0.45 * vSeed));
  }
`;

const CAM: [number, [number, number, number], [number, number, number]][] = [
  [0.0, [-1.6, 2.1, 15.4], [1.9, 0.3, -0.4]],
  [0.08, [-1.45, 1.95, 14.5], [1.9, 0.3, -0.4]],
  [0.28, [-0.6, 1.35, 12.1], [2.0, 0.25, -0.3]],
  [0.45, [-1.5, 1.75, 10.2], [CX - 1.7, 1.35, -0.6]],
  [0.6, [-0.3, 1.1, 9.4], [CX + 0.1, 0.15, -0.1]],
  [0.8, [0.75, 0.95, 9.4], [2.25, 0.7, -0.2]],
  [1.0, [1.1, 0.65, 8.8], [2.15, 0.45, -0.1]],
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
  /* Fog dissolves the ground into the dark — no grey horizon line — and
     gives the far architecture atmospheric depth for free. */
  scene.fog = new THREE.Fog(WORLD_BG, 11, 26);

  const camera = new THREE.PerspectiveCamera(
    34,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    80,
  );

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;

  scene.add(new THREE.HemisphereLight(0x9aa2b8, 0x101116, 0.3));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.15);
  key.position.set(-3, 6, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa9b7ff, 0.55);
  rim.position.set(6, 2, -5);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.22);
  fill.position.set(2, -1, 4);
  scene.add(fill);
  const basinLight = new THREE.PointLight(0x2b7fff, 0.0, 6.5, 1.9);
  basinLight.position.set(CX + 0.2, GROUND_Y + 0.45, 0.45);
  scene.add(basinLight);

  const graphite = new THREE.MeshStandardMaterial({ color: 0x272931, roughness: 0.36, metalness: 0.52, envMapIntensity: 0.5 });
  const polymer = new THREE.MeshStandardMaterial({ color: 0x0d0e13, roughness: 0.4, metalness: 0.35, envMapIntensity: 0.18, transparent: true });
  const optical = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.07, metalness: 0, transparent: true, opacity: 0.14, envMapIntensity: 0.85, depthWrite: false });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0xcfc9bc, roughness: 0.52, metalness: 0.03, envMapIntensity: 0.18 });
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0b10, roughness: 0.7, metalness: 0.15, envMapIntensity: 0.05 });
  const inkBar = new THREE.MeshStandardMaterial({ color: 0x191a20, roughness: 0.5, metalness: 0.1 });

  const makeSignalMat = (attrBand: boolean, envelope: boolean) =>
    new THREE.ShaderMaterial({
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
        uIntensity: { value: 0 },
        uEnvelope: { value: envelope ? 1 : 0 },
        uColorA: { value: new THREE.Color(0x2b7fff) },
        uColorB: { value: new THREE.Color(0x5b3df5) },
        uBand: { value: new THREE.Vector2(0, 1) },
      },
    });

  const disposables: (THREE.BufferGeometry | THREE.Material)[] = [
    graphite, polymer, optical, ceramic, groundMat, inkBar,
  ];

  /* ── Ground: near-black, fog-dissolved ── */
  const groundGeo = new THREE.PlaneGeometry(60, 40);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(CX, GROUND_Y, -4);
  scene.add(ground);
  disposables.push(groundGeo);

  /* Basin: recessed measured destination — inset ring of geometry plus a
     restrained light disc; rings barely-there until the signal lands. */
  const insetGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.08, 40, 1, true);
  const inset = new THREE.Mesh(insetGeo, polymer);
  inset.position.set(CX + 0.2, GROUND_Y - 0.02, 0.45);
  scene.add(inset);
  disposables.push(insetGeo);

  const basinMat = makeSignalMat(false, false);
  basinMat.uniforms.uBand.value.set(0.52, 0.72);
  const basinGeo = new THREE.CircleGeometry(0.95, 44);
  {
    const uv = basinGeo.attributes.uv as THREE.BufferAttribute;
    const pos = basinGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i)) / 0.95;
      uv.setXY(i, 0.5, 1 - r);
    }
  }
  const basin = new THREE.Mesh(basinGeo, basinMat);
  basin.rotation.x = -Math.PI / 2;
  basin.position.set(CX + 0.2, GROUND_Y + 0.005, 0.45);
  scene.add(basin);
  disposables.push(basinGeo, basinMat);

  const ringsMat = makeSignalMat(false, false);
  ringsMat.uniforms.uBand.value.set(0.74, 0.95);
  const ringParts = [1.5, 2.15, 2.9].map((r) => {
    const g = new THREE.RingGeometry(r, r + 0.022, 64);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.5, 0.5);
    return g;
  });
  const ringsGeo = mergeGeometries(ringParts);
  ringParts.forEach((g) => g.dispose());
  const rings = new THREE.Mesh(ringsGeo, ringsMat);
  rings.rotation.x = -Math.PI / 2;
  rings.position.set(CX + 0.2, GROUND_Y + 0.015, 0.45);
  scene.add(rings);
  disposables.push(ringsGeo, ringsMat);

  /* ── Intelligence core: front frames / mid cavity / rear architecture ── */
  const frontParts: THREE.BufferGeometry[] = [];
  {
    const f1 = frameGeo(2.9, 3.6, 0.34, 0.18);
    f1.rotateY(0.1);
    f1.translate(CX - 0.15, -0.15, 0.55);
    frontParts.push(f1);
    const f2 = frameGeo(2.1, 2.5, 0.26, 0.16);
    f2.rotateY(-0.14);
    f2.translate(CX + 0.75, 0.35, -0.15);
    frontParts.push(f2);
    /* Asymmetric overhang + stepped slabs. */
    const over = plateGeo(2.3, 0.3, 1.1, 0.05);
    over.rotateX(Math.PI / 2);
    over.rotateY(0.08);
    over.translate(CX + 0.55, 2.0, 0.1);
    frontParts.push(over);
    const slabA = plateGeo(2.0, 0.34, 1.25, 0.05);
    slabA.rotateX(Math.PI / 2);
    slabA.translate(CX - 0.35, -2.15, 0.15);
    frontParts.push(slabA);
    const slabB = plateGeo(1.55, 0.3, 1.05, 0.05);
    slabB.rotateX(Math.PI / 2);
    slabB.rotateY(-0.1);
    slabB.translate(CX + 0.7, -1.7, -0.3);
    frontParts.push(slabB);
    /* Three thin routing planes bridging the frames. */
    [[-0.75, 0.35, 0.2], [0.25, -0.5, -0.05], [1.05, 0.9, -0.4]].forEach(([y, x, z]) => {
      const rp = plateGeo(1.5, 0.08, 0.7, 0.02);
      rp.rotateX(Math.PI / 2);
      rp.translate(CX + x, y, z);
      frontParts.push(rp);
    });
  }
  const frontGeo = mergeGeometries(frontParts);
  frontParts.forEach((g) => g.dispose());
  const front = new THREE.Mesh(frontGeo, graphite);
  scene.add(front);
  disposables.push(frontGeo);

  /* Interior cavity volume (dark) — visible through the frame voids. */
  const cavityGeo = new THREE.BoxGeometry(1.6, 3.0, 0.7);
  const cavity = new THREE.Mesh(cavityGeo, polymer);
  cavity.position.set(CX + 0.1, -0.1, -0.55);
  scene.add(cavity);
  disposables.push(cavityGeo);

  /* Rear routing architecture + far environment verticals (fog eats
     them into atmosphere). One merged transparent-capable mesh. */
  const rearParts: THREE.BufferGeometry[] = [];
  [[-0.6, 2.6, 3.4, -1.6], [0.9, 2.1, 2.7, -2.1], [0.1, 1.5, 4.2, -2.8]].forEach(
    ([x, w, h, z]) => {
      const g = plateGeo(w, h, 0.12, 0.03);
      g.translate(CX + x, 0.2, z);
      rearParts.push(g);
    },
  );
  /* (Far vertical edge posts were tried here and rejected: they rendered
     as bright poles crossing the composition and the headline. The rear
     planes + fog carry the environmental depth on their own.) */
  const rearGeo = mergeGeometries(rearParts);
  rearParts.forEach((g) => g.dispose());
  const rear = new THREE.Mesh(rearGeo, polymer);
  scene.add(rear);
  disposables.push(rearGeo);

  /* Optical volumes intersecting the cavity. */
  const opticGeo = plateGeo(1.7, 1.15, 0.05, 0.03);
  const optic1 = new THREE.Mesh(opticGeo, optical);
  optic1.rotation.set(Math.PI / 2, 0, 0.06);
  optic1.position.set(CX + 0.05, -0.45, 0.1);
  const optic2 = new THREE.Mesh(opticGeo, optical);
  optic2.rotation.set(Math.PI / 2, 0, -0.05);
  optic2.position.set(CX + 0.15, 0.75, -0.1);
  scene.add(optic1, optic2);
  disposables.push(opticGeo);

  /* Seam light inside the cavity + the vertical routing fissure. */
  const seamMat = makeSignalMat(false, false);
  seamMat.uniforms.uBand.value.set(0.08, 0.28);
  const seamParts: THREE.BufferGeometry[] = [];
  [[-1.35, 1.3], [-0.45, 1.5], [0.55, 1.35], [1.45, 1.0]].forEach(([y, w]) => {
    const g = new THREE.PlaneGeometry(w, 0.035);
    g.translate(CX + 0.05, y, -0.18);
    seamParts.push(g);
  });
  {
    const fissure = new THREE.PlaneGeometry(0.06, 3.6);
    fissure.translate(CX + 0.32, -0.3, 0.66);
    seamParts.push(fissure);
  }
  const seamGeo = mergeGeometries(seamParts);
  seamParts.forEach((g) => g.dispose());
  const seams = new THREE.Mesh(seamGeo, seamMat);
  scene.add(seams);
  disposables.push(seamGeo, seamMat);

  /* ── Audience: five differently shaped segments ── */
  const AUD_N = 3000;
  const rand = mulberry32(20260813);
  type Cluster = { c: THREE.Vector3; gen: () => THREE.Vector3; n: number; size: number; bright: number };
  const routeMouth = new THREE.Vector3(CX - 2.6, 1.7, -0.6);
  const mk = (x: number, y: number, z: number) => new THREE.Vector3(CX + x, y, z);
  const clusters: Cluster[] = [
    { c: mk(-3.0, 2.3, -1.0), n: 850, size: 1.0, bright: 0.7, // A dense compact
      gen: () => new THREE.Vector3((rand() - 0.5) * 0.9, (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.8) },
    { c: mk(-3.9, 1.2, 0.1), n: 750, size: 0.9, bright: 0.55, // B elongated
      gen: () => new THREE.Vector3((rand() - 0.5) * 2.6, (rand() - 0.5) * 0.55, (rand() - 0.5) * 0.7) },
    { c: mk(-2.2, 0.85, -2.0), n: 700, size: 0.85, bright: 0.5, // C two-lobed
      gen: () => {
        const lobe = rand() > 0.5 ? -0.65 : 0.65;
        return new THREE.Vector3(lobe + (rand() - 0.5) * 0.7, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.6);
      } },
    { c: mk(-1.55, 2.75, 0.3), n: 320, size: 1.25, bright: 1.0, // D small high-value
      gen: () => new THREE.Vector3((rand() - 0.5) * 0.55, (rand() - 0.5) * 0.5, (rand() - 0.5) * 0.5) },
    { c: mk(-1.1, 1.5, -3.2), n: 380, size: 0.7, bright: 0.35, // E distant support
      gen: () => new THREE.Vector3((rand() - 0.5) * 1.6, (rand() - 0.5) * 1.1, (rand() - 0.5) * 1.2) },
  ];
  const diffuse = new Float32Array(AUD_N * 3);
  const cohere = new Float32Array(AUD_N * 3);
  const seeds = new Float32Array(AUD_N);
  const scales = new Float32Array(AUD_N);
  {
    let i = 0;
    for (const cl of clusters) {
      for (let k = 0; k < cl.n && i < AUD_N; k++, i++) {
        const off = cl.gen();
        const dPos = cl.c.clone().add(off.clone().multiplyScalar(1.75));
        /* Cohered target: tighter AND leaning toward the route mouth —
           selection, not teleportation. */
        const cPos = cl.c.clone().add(off.clone().multiplyScalar(0.8)).lerp(routeMouth, 0.14);
        diffuse.set([dPos.x, dPos.y, dPos.z], i * 3);
        cohere.set([cPos.x, cPos.y, cPos.z], i * 3);
        seeds[i] = rand() * cl.bright;
        scales[i] = cl.size * (0.7 + rand() * 0.6);
      }
    }
  }
  const audGeo = new THREE.BufferGeometry();
  audGeo.setAttribute("position", new THREE.BufferAttribute(diffuse.slice(), 3));
  audGeo.setAttribute("aDiffuse", new THREE.BufferAttribute(diffuse, 3));
  audGeo.setAttribute("aCohere", new THREE.BufferAttribute(cohere, 3));
  audGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  audGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  const audMat = new THREE.ShaderMaterial({
    vertexShader: POINTS_VERT,
    fragmentShader: POINTS_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uCohere: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.7 * Math.min(window.devicePixelRatio, 1.75) },
      uColor: { value: new THREE.Color(0x4d7dff) },
      uAlpha: { value: 0 },
    },
  });
  const audience = new THREE.Points(audGeo, audMat);
  scene.add(audience);
  disposables.push(audGeo, audMat);

  const MOTE_N = 800;
  const moteDiff = new Float32Array(MOTE_N * 3);
  const moteSeed = new Float32Array(MOTE_N);
  const moteScale = new Float32Array(MOTE_N);
  for (let i = 0; i < MOTE_N; i++) {
    moteDiff.set([CX - 7 + rand() * 14, GROUND_Y + rand() * 8, -8 + rand() * 9], i * 3);
    moteSeed[i] = rand();
    moteScale[i] = 0.6 + rand() * 0.7;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(moteDiff.slice(), 3));
  moteGeo.setAttribute("aDiffuse", new THREE.BufferAttribute(moteDiff, 3));
  moteGeo.setAttribute("aCohere", new THREE.BufferAttribute(moteDiff, 3));
  moteGeo.setAttribute("aSeed", new THREE.BufferAttribute(moteSeed, 1));
  moteGeo.setAttribute("aScale", new THREE.BufferAttribute(moteScale, 1));
  const moteMat = audMat.clone();
  moteMat.uniforms.uSize.value = 1.5 * Math.min(window.devicePixelRatio, 1.75);
  moteMat.uniforms.uAlpha.value = 0.16;
  moteMat.uniforms.uColor.value = new THREE.Color(0x7d86a0);
  const motes = new THREE.Points(moteGeo, moteMat);
  scene.add(motes);
  disposables.push(moteGeo, moteMat);

  /* Identity marks: tiny person glyphs (capsule body + head). */
  const ID_N = 14;
  const idBodyGeo = new THREE.CapsuleGeometry(0.035, 0.075, 4, 8);
  const idHeadGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const idBodies = new THREE.InstancedMesh(idBodyGeo, graphite, ID_N);
  const idHeads = new THREE.InstancedMesh(idHeadGeo, ceramic, ID_N);
  const idDiffuse: THREE.Vector3[] = [];
  const idCohere: THREE.Vector3[] = [];
  for (let i = 0; i < ID_N; i++) {
    const cl = clusters[i % clusters.length];
    idDiffuse.push(cl.c.clone().add(new THREE.Vector3((rand() - 0.5) * 2.2, (rand() - 0.5) * 1.5, (rand() - 0.5) * 1.2)));
    idCohere.push(cl.c.clone().add(new THREE.Vector3((rand() - 0.5) * 0.9, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.5)));
  }
  scene.add(idBodies, idHeads);
  disposables.push(idBodyGeo, idHeadGeo);

  /* ── Content: editorial family, crisp corners, staggered depth ── */
  type PlaneSpec = {
    mesh: THREE.Mesh;
    mat: THREE.MeshStandardMaterial;
    from: { p: THREE.Vector3; r: THREE.Euler; s: number };
    to: { p: THREE.Vector3; r: THREE.Euler; s: number };
  };
  const contentPlanes: PlaneSpec[] = [];
  const alignedOrigin = new THREE.Vector3(CX + 1.7, 1.15, -0.55);
  const contentSpecs: {
    kind: "hero" | "medium" | "narrow" | "optic" | "accentFrame";
    w: number; h: number; to: [number, number, number]; rotY: number;
  }[] = [
    { kind: "hero", w: 1.65, h: 1.05, to: [0, 0, 0], rotY: -0.18 },
    { kind: "medium", w: 0.95, h: 0.68, to: [-0.55, -0.85, 0.35], rotY: -0.14 },
    { kind: "medium", w: 0.8, h: 1.05, to: [1.15, -0.25, 0.2], rotY: -0.22 },
    { kind: "narrow", w: 0.24, h: 0.95, to: [-1.05, 0.15, 0.5], rotY: -0.1 },
    { kind: "narrow", w: 0.2, h: 0.7, to: [0.95, 0.75, 0.55], rotY: -0.2 },
    { kind: "narrow", w: 0.26, h: 1.15, to: [1.85, 0.35, -0.15], rotY: -0.26 },
    { kind: "optic", w: 1.1, h: 0.75, to: [0.45, -0.7, 0.65], rotY: -0.16 },
    { kind: "accentFrame", w: 0.85, h: 0.6, to: [-0.35, 0.85, 0.25], rotY: -0.12 },
  ];
  contentSpecs.forEach((spec) => {
    let g: THREE.BufferGeometry;
    let baseMat: THREE.MeshStandardMaterial;
    if (spec.kind === "accentFrame") {
      g = frameGeo(spec.w, spec.h, 0.05, 0.04);
      baseMat = graphite;
    } else {
      g = plateGeo(spec.w, spec.h, 0.035, 0.015);
      baseMat = spec.kind === "hero" ? ceramic : spec.kind === "optic" ? optical : polymer;
    }
    const mat = baseMat.clone() as THREE.MeshStandardMaterial;
    mat.transparent = true;
    const m = new THREE.Mesh(g, mat);
    disposables.push(g, mat);
    if (spec.kind === "hero") {
      const bars: THREE.Mesh[] = [
        new THREE.Mesh(new THREE.BoxGeometry(spec.w * 0.52, 0.05, 0.012), inkBar),
        new THREE.Mesh(new THREE.BoxGeometry(spec.w * 0.34, 0.028, 0.012), inkBar),
        new THREE.Mesh(new THREE.BoxGeometry(spec.w * 0.42, 0.028, 0.012), inkBar),
        new THREE.Mesh(new THREE.BoxGeometry(spec.w * 0.2, 0.06, 0.014), inkBar),
      ];
      bars[0].position.set(-spec.w * 0.14, spec.h * 0.3, 0.03);
      bars[1].position.set(-spec.w * 0.2, spec.h * 0.14, 0.03);
      bars[2].position.set(-spec.w * 0.17, spec.h * 0.0, 0.03);
      bars[3].position.set(-spec.w * 0.28, -spec.h * 0.3, 0.032);
      bars.forEach((b) => {
        m.add(b);
        disposables.push(b.geometry);
      });
    }
    const to = {
      p: alignedOrigin.clone().add(new THREE.Vector3(...spec.to)),
      r: new THREE.Euler(0, spec.rotY, 0),
      s: 1,
    };
    const from = {
      p: to.p.clone().add(new THREE.Vector3((rand() - 0.5) * 2.2, (rand() - 0.5) * 1.6, (rand() - 0.5) * 2.0 + 0.7)),
      r: new THREE.Euler((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.35),
      s: 0.9,
    };
    scene.add(m);
    contentPlanes.push({ mesh: m, mat, from, to });
  });

  /* ── Primary signals: envelope + core pairs ── */
  const mkCurve = (pts: [number, number, number][]) =>
    new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q)));
  const primarySpecs = [
    { // 1. Audience → Core: sweeps from deep left over the front shoulder into the cavity
      curve: mkCurve([[CX - 3.6, 2.0, -1.8], [CX - 2.4, 1.75, -0.4], [CX - 1.2, 1.35, 0.9], [CX - 0.2, 0.9, 0.75], [CX + 0.25, 0.55, 0.0]]),
      width: 0.13, band: [0.34, 0.52] as [number, number], max: 1.2, dominant: true,
    },
    { // 2. Content → Core: passes behind the rear planes, emerges into the cavity
      curve: mkCurve([[CX + 2.6, 1.5, -1.9], [CX + 1.6, 1.0, -1.2], [CX + 0.8, 0.6, -0.5], [CX + 0.35, 0.35, -0.1]]),
      width: 0.08, band: [0.6, 0.78] as [number, number], max: 0.55, dominant: false,
    },
    { // 3. Internal: down the fissure
      curve: mkCurve([[CX + 0.32, 0.85, 0.68], [CX + 0.33, -0.4, 0.7], [CX + 0.32, -1.45, 0.66]]),
      width: 0.085, band: [0.44, 0.6] as [number, number], max: 1.1, dominant: true,
    },
    { // 4. Core → Basin fall (foreground)
      curve: mkCurve([[CX + 0.32, -1.5, 0.68], [CX + 0.28, -2.0, 0.58], [CX + 0.22, -2.52, 0.47]]),
      width: 0.15, band: [0.48, 0.68] as [number, number], max: 1.3, dominant: true,
    },
    { // 5. Companion output
      curve: mkCurve([[CX + 0.55, -1.6, 0.5], [CX + 0.8, -2.1, 0.44], [CX + 0.95, -2.54, 0.38]]),
      width: 0.05, band: [0.55, 0.72] as [number, number], max: 0.45, dominant: false,
    },
  ];
  const primary: { core: THREE.ShaderMaterial; env: THREE.ShaderMaterial; band: [number, number]; max: number; dominant: boolean }[] = [];
  primarySpecs.forEach((spec) => {
    const gCore = ribbonGeometry(spec.curve, spec.width, 80);
    const gEnv = ribbonGeometry(spec.curve, spec.width * 3.4, 80);
    const mCore = makeSignalMat(false, false);
    const mEnv = makeSignalMat(false, true);
    [mCore, mEnv].forEach((m) => m.uniforms.uBand.value.set(spec.band[0], spec.band[1]));
    scene.add(new THREE.Mesh(gEnv, mEnv));
    scene.add(new THREE.Mesh(gCore, mCore));
    primary.push({ core: mCore, env: mEnv, band: spec.band, max: spec.max, dominant: spec.dominant });
    disposables.push(gCore, gEnv, mCore, mEnv);
  });

  /* ── Secondary relationships: one merged draw ── */
  const secondaryParts: THREE.BufferGeometry[] = [];
  const withBand = (g: THREE.BufferGeometry, a: number, b: number) => {
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) arr.set([a, b], i * 2);
    g.setAttribute("aBand", new THREE.BufferAttribute(arr, 2));
    return g;
  };
  for (let i = 0; i < 4; i++) {
    const a = clusters[i].c;
    const b2 = clusters[(i + 1) % clusters.length].c;
    const mid = a.clone().lerp(b2, 0.5).add(new THREE.Vector3(0, 0.3, -0.2));
    secondaryParts.push(withBand(ribbonGeometry(new THREE.CatmullRomCurve3([a, mid, b2]), 0.022, 40), 0.3 + i * 0.02, 0.48 + i * 0.02));
  }
  for (let i = 0; i < 4; i++) {
    const a = clusters[(i + 1) % clusters.length].c;
    secondaryParts.push(withBand(
      ribbonGeometry(new THREE.CatmullRomCurve3([a, a.clone().lerp(routeMouth, 0.6), routeMouth]), 0.018, 36),
      0.38 + i * 0.02, 0.54 + i * 0.02,
    ));
  }
  for (let i = 0; i < 4; i++) {
    const a = contentPlanes[i].to.p;
    const b2 = contentPlanes[(i + 3) % contentPlanes.length].to.p;
    secondaryParts.push(withBand(
      ribbonGeometry(new THREE.CatmullRomCurve3([a, a.clone().lerp(b2, 0.5).add(new THREE.Vector3(0, 0.16, 0.2)), b2]), 0.016, 32),
      0.66 + i * 0.02, 0.84 + i * 0.02,
    ));
  }
  [[-1.35, 0.42], [-0.45, 0.46], [0.55, 0.5], [1.45, 0.54]].forEach(([y, s]) => {
    secondaryParts.push(withBand(
      ribbonGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(CX - 1.0, y, -0.15),
        new THREE.Vector3(CX - 0.3, y + 0.2, 0.3),
        new THREE.Vector3(CX + 0.28, y * 0.5, 0.6),
      ]), 0.016, 30),
      s, s + 0.16,
    ));
  });
  const secondaryGeo = mergeGeometries(secondaryParts);
  secondaryParts.forEach((g) => g.dispose());
  const secondaryMat = makeSignalMat(true, false);
  secondaryMat.uniforms.uIntensity.value = 0.26;
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

  const applyIdentity = (t: number, fade: number) => {
    for (let i = 0; i < ID_N; i++) {
      dummy.position.lerpVectors(idDiffuse[i], idCohere[i], t);
      const s = (0.5 + 0.5 * t) * fade;
      dummy.scale.setScalar(Math.max(0.001, s));
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      idBodies.setMatrixAt(i, dummy.matrix);
      dummy.position.y += 0.095 * s;
      dummy.updateMatrix();
      idHeads.setMatrixAt(i, dummy.matrix);
    }
    idBodies.instanceMatrix.needsUpdate = true;
    idHeads.instanceMatrix.needsUpdate = true;
  };

  const apply = () => {
    const p = progress;

    /* Authored exit (last ~10%): signals dim → distance deepens → core
       softens → canvas releases. Reverse replays the same bands. */
    const exitSignals = 1 - 0.9 * band(p, 0.9, 0.945);
    const exitDistance = 1 - band(p, 0.92, 0.96);
    const exitCore = 1 - 0.5 * band(p, 0.94, 0.985);
    renderer.domElement.style.opacity = String(
      band(p, 0.0, 0.08) * (1 - 0.45 * band(p, 0.955, 1)),
    );

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

    /* Progressive intro reveal: audience and content fade up in turn. */
    const audienceIn = band(p, 0.07, 0.2);
    const contentIn = band(p, 0.18, 0.32);

    /* Audience beat, then Branding retirement. */
    const cohereT = easeInOutCubic(band(p, 0.28, 0.5));
    const brandCalm = band(p, 0.8, 0.92);
    audMat.uniforms.uCohere.value = cohereT;
    audMat.uniforms.uAlpha.value =
      0.8 * audienceIn * (1 - 0.55 * band(p, 0.62, 0.8)) * (1 - 0.5 * brandCalm) * exitSignals;
    const idT = easeInOutCubic(band(p, 0.3, 0.52));
    const idFade = audienceIn * (1 - easeInOutCubic(band(p, 0.58, 0.74)));
    applyIdentity(idT, idFade);

    /* Content alignment into the Branding composition. */
    const alignT = easeInOutCubic(band(p, 0.62, 0.88));
    for (const cp of contentPlanes) {
      cp.mesh.position.lerpVectors(cp.from.p, cp.to.p, alignT);
      cp.mesh.rotation.set(
        cp.from.r.x + (cp.to.r.x - cp.from.r.x) * alignT,
        cp.from.r.y + (cp.to.r.y - cp.from.r.y) * alignT,
        cp.from.r.z + (cp.to.r.z - cp.from.r.z) * alignT,
      );
      cp.mesh.scale.setScalar(cp.from.s + (cp.to.s - cp.from.s) * alignT);
      /* Optical clones keep their glassy 0.14 ceiling; everything else
         fades to full presence as the content beat begins. */
      const ceiling = cp.mat.color.getHex() === 0xffffff ? 0.14 : 1;
      cp.mat.opacity = contentIn * ceiling;
    }

    /* Signals: routing is the energy peak; Branding calms; exit dims. */
    const routingBoost = 1 + 0.15 * band(p, 0.45, 0.6) * (1 - band(p, 0.78, 0.9));
    primary.forEach(({ core, env, band: b, max, dominant }) => {
      const reveal = band(p, b[0], Math.min(1, b[0] + 0.1));
      const calm = dominant ? 1 - 0.25 * brandCalm : 1 - 0.55 * brandCalm;
      const v = max * reveal * routingBoost * calm * exitSignals;
      core.uniforms.uP.value = p;
      env.uniforms.uP.value = p;
      core.uniforms.uIntensity.value = v;
      env.uniforms.uIntensity.value = v * 0.9;
    });
    secondaryMat.uniforms.uP.value = p;
    secondaryMat.uniforms.uIntensity.value =
      0.26 * (1 - 0.5 * brandCalm) * exitSignals;
    seamMat.uniforms.uP.value = Math.max(p, 0.3);
    seamMat.uniforms.uIntensity.value =
      (0.2 + 0.5 * band(p, 0.4, 0.65)) * exitCore;

    basinMat.uniforms.uP.value = p;
    basinMat.uniforms.uIntensity.value = 0.6 * band(p, 0.52, 0.7) * exitSignals;
    ringsMat.uniforms.uP.value = p;
    ringsMat.uniforms.uIntensity.value = 0.22 * band(p, 0.74, 0.92) * exitSignals;
    rings.scale.setScalar(0.8 + 0.3 * easeInOutCubic(band(p, 0.72, 1)));
    basinLight.intensity = 0.7 * band(p, 0.5, 0.7) * exitSignals;

    /* Distance/environment deepen on exit; motes follow the world. */
    (rear.material as THREE.MeshStandardMaterial).opacity = exitDistance;
    moteMat.uniforms.uAlpha.value = 0.16 * exitDistance;
    key.intensity = 1.15 * (0.75 + 0.25 * exitCore);

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

    audMat.uniforms.uTime.value = time;
    moteMat.uniforms.uTime.value = time * 0.35;
    [basinMat, ringsMat, seamMat, secondaryMat].forEach((m) => (m.uniforms.uTime.value = time));
    primary.forEach(({ core, env }) => {
      core.uniforms.uTime.value = time;
      env.uniforms.uTime.value = time;
    });

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
      idBodies.dispose();
      idHeads.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
