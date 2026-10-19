"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Vec3 = [number, number, number];

function makeSculpture(rows = 28, columns = 52) {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const point = (row: number, column: number): Vec3 => {
    const v = row / rows;
    const u = column / columns;
    const theta = v * Math.PI;
    const phi = u * Math.PI * 2;
    const ripple = 1 + 0.12 * Math.sin(phi * 3 + theta * 2) + 0.07 * Math.cos(theta * 5 - phi * 2);
    const lean = 0.12 * Math.sin(theta) * Math.sin(phi * 2);
    return [Math.sin(theta) * Math.cos(phi) * ripple + lean, Math.cos(theta) * ripple, Math.sin(theta) * Math.sin(phi) * ripple];
  };
  for (let row = 0; row <= rows; row += 1) {
    for (let column = 0; column <= columns; column += 1) {
      const p = point(row, column);
      positions.push(...p);
      const length = Math.hypot(...p);
      normals.push(p[0] / length, p[1] / length, p[2] / length);
    }
  }
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const next = row * (columns + 1) + column;
      const below = (row + 1) * (columns + 1) + column;
      indices.push(next, below, next + 1, next + 1, below, below + 1);
    }
  }
  return { positions, normals, indices };
}

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const item = gl.createShader(type);
  if (!item) throw new Error("Unable to create shader");
  gl.shaderSource(item, source);
  gl.compileShader(item);
  if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(item) || "Shader error");
  return item;
}

export function WebglSculpture({ reducedMotion, className }: { reducedMotion: boolean | null; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, powerPreference: "high-performance" });
    if (!gl) {
      fallbackRef.current?.setAttribute("data-active", "true");
      return;
    }
    const vertex = shader(gl, gl.VERTEX_SHADER, `attribute vec3 aPosition; attribute vec3 aNormal; uniform float uTime; uniform vec2 uPointer; uniform float uAspect; varying vec3 vNormal; varying vec3 vPosition; void main(){ float c=cos(uPointer.y*.26); float s=sin(uPointer.y*.26); vec3 p=aPosition; p=vec3(p.x*c-p.z*s,p.y,p.x*s+p.z*c); float cx=cos(uPointer.x*.18); float sx=sin(uPointer.x*.18); p=vec3(p.x,p.y*cx-p.z*sx,p.y*sx+p.z*cx); float breathe=1.0+sin(uTime*.75+p.y*3.0)*.025; p*=breathe; vPosition=p; vNormal=normalize(aNormal); gl_Position=vec4(p.x*.88/uAspect,p.y*.88,p.z*.22,1.0); }`);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, `precision mediump float; uniform float uTime; varying vec3 vNormal; varying vec3 vPosition; void main(){ vec3 light=normalize(vec3(-.45,.7,1.0)); float diffuse=max(dot(vNormal,light),0.0); float rim=pow(1.0-max(dot(vNormal,vec3(0.0,0.0,1.0)),0.0),2.0); vec3 violet=vec3(.65,.48,1.0); vec3 blue=vec3(.22,.68,.95); vec3 peach=vec3(1.0,.62,.72); float bands=sin(vPosition.y*4.0+uTime*.45)*.5+.5; vec3 color=mix(violet,blue,bands); color=mix(color,peach,rim*.42); color*=.36+diffuse*.82; gl_FragColor=vec4(color,.96); }`);
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const data = makeSculpture();
    const position = gl.createBuffer(); const normal = gl.createBuffer(); const index = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, normal); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, "aPosition"); const normalLocation = gl.getAttribLocation(program, "aNormal");
    const timeLocation = gl.getUniformLocation(program, "uTime"); const pointerLocation = gl.getUniformLocation(program, "uPointer"); const aspectLocation = gl.getUniformLocation(program, "uAspect");
    const pointer = { x: 0, y: 0 }; let frame = 0; let start = performance.now(); let active = true;
    const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 1.7); const bounds = canvas.getBoundingClientRect(); canvas.width = Math.max(1, bounds.width * ratio); canvas.height = Math.max(1, bounds.height * ratio); gl.viewport(0, 0, canvas.width, canvas.height); };
    const move = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); pointer.x = (event.clientX - bounds.left) / bounds.width * 2 - 1; pointer.y = (event.clientY - bounds.top) / bounds.height * 2 - 1; };
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active && !reducedMotion) frame = requestAnimationFrame(render); }, { threshold: 0.05 });
    const render = (now: number) => { if (!active) return; const seconds = reducedMotion ? 0 : (now - start) / 1000; gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.enableVertexAttribArray(positionLocation); gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ARRAY_BUFFER, normal); gl.enableVertexAttribArray(normalLocation); gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index); gl.uniform1f(timeLocation, seconds); gl.uniform2f(pointerLocation, pointer.x, pointer.y); gl.uniform1f(aspectLocation, canvas.width / canvas.height); gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0); if (!reducedMotion) frame = requestAnimationFrame(render); };
    resize(); observer.observe(canvas); window.addEventListener("resize", resize); canvas.addEventListener("pointermove", move, { passive: true }); frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", resize); canvas.removeEventListener("pointermove", move); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); gl.deleteBuffer(position); gl.deleteBuffer(normal); gl.deleteBuffer(index); };
  }, [reducedMotion]);

  return <div className={cn("webgl-sculpture", className)}><canvas ref={canvasRef} aria-label="Interactive iridescent 3D sculpture" /><div ref={fallbackRef} className="webgl-fallback" aria-hidden="true"><div /></div><div className="webgl-sculpture__caption"><span>interactive study</span><span>drag / explore</span></div></div>;
}
