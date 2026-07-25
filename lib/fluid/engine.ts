import {
  advectionShader,
  baseVertexShader,
  buoyancyShader,
  clearShader,
  copyShader,
  curlShader,
  displayShader,
  divergenceShader,
  gradientSubtractShader,
  pressureShader,
  splatShader,
  vorticityShader,
} from "./shaders";

export type FluidConfig = {
  simResolution: number;
  dyeResolution: number;
  densityDissipation: number;
  velocityDissipation: number;
  pressure: number;
  pressureIterations: number;
  curl: number;
  splatRadius: number;
  splatForce: number;
  buoyancy: number;
  intensity: number;
  palette: [number, number, number][];
};

export const defaultConfig: FluidConfig = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 0.32,
  velocityDissipation: 0.24,
  pressure: 0.8,
  pressureIterations: 20,
  curl: 32,
  splatRadius: 0.2,
  splatForce: 6000,
  buoyancy: 34,
  intensity: 0.085,
  palette: [
    [0.23, 0.12, 1.0],
    [0.42, 0.24, 0.95],
    [0.12, 0.06, 0.62],
    [0.32, 0.16, 0.9],
  ],
};

type GL = WebGLRenderingContext | WebGL2RenderingContext;

type Format = { internalFormat: number; format: number };

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

type Program = {
  uniforms: Record<string, WebGLUniformLocation | null>;
  bind: () => void;
};

function compileShader(gl: GL, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: GL,
  vertexSource: string,
  fragmentSource: string,
): Program | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i += 1) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }

  return { uniforms, bind: () => gl.useProgram(program) };
}

export function createFluid(canvas: HTMLCanvasElement, config: FluidConfig) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  } as const;

  const gl2 = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
  const gl: GL | null =
    gl2 ?? (canvas.getContext("webgl", params) as WebGLRenderingContext | null);
  if (!gl) return null;

  const isWebGL2 = Boolean(gl2);
  let halfFloatType: number;

  if (isWebGL2) {
    const g = gl as WebGL2RenderingContext;
    if (!g.getExtension("EXT_color_buffer_float")) return null;
    g.getExtension("OES_texture_float_linear");
    halfFloatType = g.HALF_FLOAT;
  } else {
    const ext = gl.getExtension("OES_texture_half_float");
    if (!ext || !gl.getExtension("OES_texture_half_float_linear")) return null;
    halfFloatType = ext.HALF_FLOAT_OES;
  }

  const formatRGBA: Format = isWebGL2
    ? { internalFormat: (gl as WebGL2RenderingContext).RGBA16F, format: gl.RGBA }
    : { internalFormat: gl.RGBA, format: gl.RGBA };
  const formatRG: Format = isWebGL2
    ? { internalFormat: (gl as WebGL2RenderingContext).RG16F, format: (gl as WebGL2RenderingContext).RG }
    : { internalFormat: gl.RGBA, format: gl.RGBA };
  const formatR: Format = isWebGL2
    ? { internalFormat: (gl as WebGL2RenderingContext).R16F, format: (gl as WebGL2RenderingContext).RED }
    : { internalFormat: gl.RGBA, format: gl.RGBA };

  gl.disable(gl.BLEND);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  );
  const indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const blit = (target: FBO | null) => {
    if (target === null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  const createFBO = (
    w: number,
    h: number,
    fmt: Format,
    type: number,
    filter: number,
  ): FBO => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      fmt.internalFormat,
      w,
      h,
      0,
      fmt.format,
      type,
      null,
    );

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  };

  const createDoubleFBO = (
    w: number,
    h: number,
    fmt: Format,
    type: number,
    filter: number,
  ): DoubleFBO => {
    let fbo1 = createFBO(w, h, fmt, type, filter);
    let fbo2 = createFBO(w, h, fmt, type, filter);
    return {
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      get read() {
        return fbo1;
      },
      set read(value: FBO) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value: FBO) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  };

  const programs = {
    copy: createProgram(gl, baseVertexShader, copyShader),
    clear: createProgram(gl, baseVertexShader, clearShader),
    splat: createProgram(gl, baseVertexShader, splatShader),
    advection: createProgram(gl, baseVertexShader, advectionShader),
    divergence: createProgram(gl, baseVertexShader, divergenceShader),
    curl: createProgram(gl, baseVertexShader, curlShader),
    vorticity: createProgram(gl, baseVertexShader, vorticityShader),
    pressure: createProgram(gl, baseVertexShader, pressureShader),
    gradient: createProgram(gl, baseVertexShader, gradientSubtractShader),
    buoyancy: createProgram(gl, baseVertexShader, buoyancyShader),
    display: createProgram(gl, baseVertexShader, displayShader),
  };

  if (Object.values(programs).some((p) => p === null)) return null;
  const p = programs as { [K in keyof typeof programs]: Program };

  const linear = gl.LINEAR;
  const nearest = gl.NEAREST;
  const filtering = isWebGL2 ? linear : linear;

  let dye: DoubleFBO;
  let velocity: DoubleFBO;
  let divergence: FBO;
  let curlFBO: FBO;
  let pressure: DoubleFBO;

  const initFramebuffers = () => {
    const dyeRes = getResolution(config.dyeResolution);
    const simRes = getResolution(config.simResolution);
    dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA, halfFloatType, filtering);
    velocity = createDoubleFBO(simRes.width, simRes.height, formatRG, halfFloatType, filtering);
    divergence = createFBO(simRes.width, simRes.height, formatR, halfFloatType, nearest);
    curlFBO = createFBO(simRes.width, simRes.height, formatR, halfFloatType, nearest);
    pressure = createDoubleFBO(simRes.width, simRes.height, formatR, halfFloatType, nearest);
  };

  function getResolution(resolution: number) {
    let aspect = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    return gl!.drawingBufferWidth > gl!.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  }

  initFramebuffers();

  const splat = (
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: [number, number, number],
  ) => {
    const aspect = canvas.width / canvas.height;

    p.splat.bind();
    gl.uniform1i(p.splat.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(p.splat.uniforms.aspectRatio, aspect);
    gl.uniform2f(p.splat.uniforms.point, x, y);
    gl.uniform3f(p.splat.uniforms.color, dx, dy, 0);
    gl.uniform1f(p.splat.uniforms.radius, config.splatRadius / 100);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(p.splat.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(p.splat.uniforms.color, color[0], color[1], color[2]);
    blit(dye.write);
    dye.swap();
  };

  const step = (dt: number) => {
    gl.disable(gl.BLEND);

    // curl
    p.curl.bind();
    gl.uniform2f(p.curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(p.curl.uniforms.uVelocity, velocity.read.attach(0));
    blit(curlFBO);

    // vorticity confinement — this is what produces the filament roll-ups
    p.vorticity.bind();
    gl.uniform2f(p.vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(p.vorticity.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(p.vorticity.uniforms.uCurl, curlFBO.attach(1));
    gl.uniform1f(p.vorticity.uniforms.curl, config.curl);
    gl.uniform1f(p.vorticity.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    // buoyancy — dye drifts upward like ink in water
    p.buoyancy.bind();
    gl.uniform1i(p.buoyancy.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(p.buoyancy.uniforms.uDye, dye.read.attach(1));
    gl.uniform1f(p.buoyancy.uniforms.strength, config.buoyancy);
    gl.uniform1f(p.buoyancy.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    // divergence
    p.divergence.bind();
    gl.uniform2f(p.divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(p.divergence.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    // decay pressure
    p.clear.bind();
    gl.uniform1i(p.clear.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(p.clear.uniforms.value, config.pressure);
    blit(pressure.write);
    pressure.swap();

    // jacobi pressure solve
    p.pressure.bind();
    gl.uniform2f(p.pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(p.pressure.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.pressureIterations; i += 1) {
      gl.uniform1i(p.pressure.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    // project velocity to divergence-free
    p.gradient.bind();
    gl.uniform2f(p.gradient.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(p.gradient.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(p.gradient.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    // advect velocity
    p.advection.bind();
    gl.uniform2f(p.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform2f(p.advection.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(p.advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(p.advection.uniforms.uSource, velocity.read.attach(0));
    gl.uniform1f(p.advection.uniforms.dt, dt);
    gl.uniform1f(p.advection.uniforms.dissipation, config.velocityDissipation);
    blit(velocity.write);
    velocity.swap();

    // advect dye
    gl.uniform2f(p.advection.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(p.advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(p.advection.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(p.advection.uniforms.dissipation, config.densityDissipation);
    blit(dye.write);
    dye.swap();
  };

  const render = () => {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    p.display.bind();
    gl.uniform1i(p.display.uniforms.uTexture, dye.read.attach(0));
    gl.uniform1f(p.display.uniforms.uIntensity, config.intensity);
    blit(null);
  };

  const resize = () => {
    initFramebuffers();
  };

  const destroy = () => {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  return { splat, step, render, resize, destroy, config };
}
