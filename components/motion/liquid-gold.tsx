"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/**
 * Domain-warped fbm shaded like molten gold: normals from the noise gradient,
 * a fake environment band and sharp highlights. The light and a lens-like
 * bulge follow the pointer; scrolling
 * speeds the flow. `seed` shifts the pattern so reused panels differ.
 */
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uHover;uniform float uFlow;uniform float uSeed;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=r*p*2.02;a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse-.5*uRes)/uRes.y;
  vec2 dm=uv-m;float d=length(dm);
  uv-=dm*.35*exp(-d*d*9.)*uHover;
  float t=uTime*.042+uFlow+uSeed;
  vec2 q=vec2(fbm(uv*1.1+t),fbm(uv*1.1+vec2(5.2,1.3)-t*.8));
  vec2 r=vec2(fbm(uv*1.3+3.*q+vec2(1.7,9.2)+t*1.2),fbm(uv*1.3+3.*q+vec2(8.3,2.8)-t));
  vec2 P=uv*.95+3.4*r;
  float f=fbm(P);
  float e=.0025;
  vec2 g=vec2(fbm(P+vec2(e,0.))-f,fbm(P+vec2(0.,e))-f)/e;
  vec3 nrm=normalize(vec3(-g*.32,1.));
  vec3 L=normalize(vec3(-.5+m.x*.8,.6+m.y*.6,.7));
  float diff=clamp(dot(nrm,L),0.,1.);
  float spec=pow(clamp(dot(reflect(-L,nrm),vec3(0,0,1)),0.,1.),22.);
  float env=.5+.5*sin(nrm.x*7.+nrm.y*5.+f*9.);
  vec3 gold=vec3(.84,.68,.42);
  float body=smoothstep(.33,.86,f);
  vec3 base=mix(vec3(.01),gold*(.2+.62*env),body);
  vec3 col=base*(.28+.95*diff)+gold*spec*1.35*sqrt(body)+vec3(1.,.95,.82)*pow(spec,4.)*.9*sqrt(body);
  col*=1.-.58*smoothstep(.42,1.3,length(uv*vec2(.7,1.)));
  col+=(h(gl_FragCoord.xy+uTime)-.5)*.02;
  gl_FragColor=vec4(col,1.);
}`;

export function LiquidGold({ seed = 0, className = "" }: { seed?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!;
    const gl = el.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) { el.classList.add("is-fallback"); return; }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { el.classList.add("is-fallback"); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes"), uTime = u("uTime"), uMouse = u("uMouse"), uHover = u("uHover"), uFlow = u("uFlow"), uSeed = u("uSeed");
    gl.uniform1f(uSeed, seed);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = el.parentElement!;
    let w = 1, h = 1, raf = 0, visible = true, hover = 0, hoverTarget = 0, flow = 0, lastY = window.scrollY;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const resize = () => {
      const r = host.getBoundingClientRect();
      // The surface is soft, so render at most ~1400px wide and let CSS upscale.
      const dpr = Math.min(window.devicePixelRatio || 1, 1, 1400 / Math.max(1, r.width));
      w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr));
      el.width = w; el.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      if (!mouse.tx) { mouse.x = mouse.tx = w * 0.62; mouse.y = mouse.ty = h * 0.55; }
    };
    const frame = (t: number) => {
      const dy = window.scrollY - lastY; lastY = window.scrollY;
      flow += dy * 0.0006;
      hover += (hoverTarget - hover) * 0.06;
      mouse.x += (mouse.tx - mouse.x) * 0.08; mouse.y += (mouse.ty - mouse.y) * 0.08;
      gl.uniform1f(uTime, t / 1000);
      gl.uniform1f(uFlow, flow);
      gl.uniform1f(uHover, hover);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (t: number) => { if (visible) frame(t); raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect(), dpr = w / Math.max(1, r.width);
      mouse.tx = (e.clientX - r.left) * dpr; mouse.ty = (r.bottom - e.clientY) * dpr; hoverTarget = 1;
    };
    const leave = () => { hoverTarget = 0; };
    const ro = new ResizeObserver(() => { resize(); if (reduce) frame(12000); });
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    ro.observe(host); io.observe(host);
    resize();
    if (reduce) frame(12000);
    else {
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [seed]);
  return <canvas ref={canvas} className={`liquid-gold ${className}`} aria-hidden="true" />;
}
