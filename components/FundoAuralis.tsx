"use client";

import { useEffect, useRef, useState } from "react";

/* Fundo da seção História: shader Auralis (21st.dev) nas cores da marca.

   O GLSL abaixo é o original, intocado. O que mudou foi o invólucro: sem
   Tailwind, sem cn, estilo por classe semântica, e três proteções que o
   componente original não tinha.

   1. O rAF original rodava a 60fps enquanto a página estivesse aberta, mesmo
      com a seção fora da tela. Agora um IntersectionObserver corta o laço
      quando a seção sai da viewport, e visibilitychange corta com a aba em
      segundo plano.
   2. Abaixo de 768px o contexto GL não chega a ser criado — decidido por
      matchMedia, não por CSS. Fica o gradiente estático.
   3. prefers-reduced-motion também impede a criação.

   No cleanup, além de cancelAnimationFrame e deleteProgram, vão deleteBuffer
   e WEBGL_lose_context: o navegador limita contextos simultâneos e a navegação
   client-side do Next acumula órfãos. */

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderGLSL = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[3];

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv * vec2(ratio, 1.0);
  float t = u_time * 0.2;

  float n1 = snoise(p * 0.5 + t);
  float n2 = snoise(p * 0.9 - t * 0.5 + n1);

  float light = pow(abs(n2), 2.5) * 0.5;

  vec3 col = vec3(0.02, 0.01, 0.01);

  col += u_colors[0] * smoothstep(0.1, 1.0, n1) * 0.5;
  col += u_colors[1] * light;

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.5;

  float dist = length(uv - 0.5);
  col *= smoothstep(1.2, 0.2, dist);

  gl_FragColor = vec4(col, 1.0);
}
`;

/* Paleta do projeto: o vermelho da marca puxa o primeiro canal, os outros
   dois descem para marrom queimado, na direção de --ground-deep. */
const CORES = ["#df0100", "#6e2a14", "#2a1410"];
const VELOCIDADE = 0.3;
const GRAO = 0.6;

const hexParaRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

export default function FundoAuralis() {
  const container = useRef<HTMLDivElement>(null);
  const [comShader, setComShader] = useState(false);

  useEffect(() => {
    const alvo = container.current;
    if (!alvo) return;

    /* Proteções 2 e 3: o objetivo é não criar o contexto GL, não escondê-lo. */
    const estreito = window.matchMedia("(max-width: 767.98px)").matches;
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (estreito || semMovimento) return;

    /* O canvas nasce aqui, não no JSX. loseContext() mata o elemento para
       sempre: reaproveitar o mesmo canvas entre montagens — StrictMode em
       dev, navegação client-side em produção — devolveria um contexto já
       perdido e o shader nunca mais desenharia. Canvas novo a cada montagem,
       descartado no cleanup. */
    const canvas = document.createElement("canvas");
    canvas.className = "fundo-auralis__tela";
    canvas.setAttribute("aria-hidden", "true");

    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) return; /* Sem contexto: fica o gradiente estático. */

    alvo.prepend(canvas);

    const compilar = (tipo: number, src: string) => {
      const s = gl.createShader(tipo);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compilar(gl.VERTEX_SHADER, vertexShaderGLSL);
    const fs = compilar(gl.FRAGMENT_SHADER, fragmentShaderGLSL);
    const programa = vs && fs ? gl.createProgram() : null;

    /* Shader que não compila cai no gradiente, em vez de pintar preto. */
    if (!programa || !vs || !fs) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
      gl.deleteProgram(programa);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    gl.useProgram(programa);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(programa, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      res: gl.getUniformLocation(programa, "u_resolution"),
      time: gl.getUniformLocation(programa, "u_time"),
      grain: gl.getUniformLocation(programa, "u_grain"),
      colors: gl.getUniformLocation(programa, "u_colors"),
    };

    /* As cores não mudam em runtime: manda uma vez, não a cada quadro. */
    gl.uniform3fv(locs.colors, new Float32Array(CORES.flatMap(hexParaRgb)));
    gl.uniform1f(locs.grain, GRAO);

    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = alvo.clientWidth * dpr;
      canvas.height = alvo.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    redimensionar();

    const ro = new ResizeObserver(redimensionar);
    ro.observe(alvo);

    let raf = 0;
    let visivel = false;

    const desenhar = (t: number) => {
      gl.uniform2f(locs.res, canvas.width, canvas.height);
      gl.uniform1f(locs.time, t * 0.001 * VELOCIDADE);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(desenhar);
    };

    const tocar = () => {
      if (raf || !visivel || document.visibilityState === "hidden") return;
      raf = requestAnimationFrame(desenhar);
    };
    const parar = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /* Proteção 1: fora da viewport o laço não roda. */
    const obs = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting;
        if (visivel) tocar();
        else parar();
      },
      { threshold: 0 },
    );
    obs.observe(alvo);

    const aoTrocarAba = () => {
      if (document.visibilityState === "hidden") parar();
      else tocar();
    };
    document.addEventListener("visibilitychange", aoTrocarAba);

    setComShader(true);

    return () => {
      parar();
      obs.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", aoTrocarAba);
      gl.deleteProgram(programa);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return (
    <div
      className="fundo-auralis"
      ref={container}
      aria-hidden="true"
      {...(comShader ? { "data-ativo": "" } : {})}
    >
      <div className="fundo-auralis__veu" />
    </div>
  );
}
